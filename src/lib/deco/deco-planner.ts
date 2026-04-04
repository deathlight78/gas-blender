import { GasMix } from '../../types/gas.types';
import { DecoInput, DecoResult, DecoStop } from '../../types/deco.types';
import { SURFACE_PRESSURE } from '../gas/constants';
import {
  CompartmentState,
  initialCompartmentState,
  updateCompartments,
  ceiling,
  pressureToDepth,
} from './buhlmann';
import { interpolateGF, roundUpToStop } from './gradient-factor';
import { accumulateO2Toxicity } from './oxygen-toxicity';

const STOP_INCREMENT = 3; // m
const MAX_STOP_MINUTES = 999;

function depthToPressure(depthM: number): number {
  return SURFACE_PRESSURE + depthM / 10;
}

/** 주어진 수심에서 사용할 deco gas 선택 (전환 수심 이하에서 ppO2 최대 기체) */
function selectGas(
  decoGases: Array<{ switchDepth: number; mix: GasMix }>,
  bottomMix: GasMix,
  depthM: number
): GasMix {
  let best = bottomMix;
  for (const dg of decoGases) {
    if (depthM <= dg.switchDepth) {
      best = dg.mix;
    }
  }
  return best;
}

/**
 * 상승 구간 시뮬레이션 (연속 상승)
 * fromDepth → toDepth 를 ascentRate(m/min)으로 상승
 */
function simulateAscent(
  state: CompartmentState,
  fromDepth: number,
  toDepth: number,
  ascentRate: number,
  gas: GasMix,
  cnsAcc: number,
  otuAcc: number
): { state: CompartmentState; cns: number; otu: number; minutes: number } {
  if (fromDepth <= toDepth) return { state, cns: cnsAcc, otu: otuAcc, minutes: 0 };

  const distanceM = fromDepth - toDepth;
  const timeMin = distanceM / ascentRate;
  // 상승 중 평균 압력에서 ppO2 계산
  const avgDepth = (fromDepth + toDepth) / 2;
  const avgPAbs = depthToPressure(avgDepth);
  const ppO2 = gas.fO2 * avgPAbs;

  const tox = accumulateO2Toxicity(ppO2, timeMin);
  // 상승은 짧은 구간으로 나눠 Schreiner 적용 (정확도 향상)
  const steps = Math.max(1, Math.ceil(distanceM));
  let s = state;
  const stepTime = timeMin / steps;
  for (let i = 0; i < steps; i++) {
    const d = fromDepth - ((i + 0.5) / steps) * distanceM;
    s = updateCompartments(s, depthToPressure(d), gas, stepTime);
  }

  return {
    state: s,
    cns: cnsAcc + tox.cns,
    otu: otuAcc + tox.otu,
    minutes: timeMin,
  };
}

/**
 * Bühlmann ZHL-16C + GF 감압 계획 메인 함수
 */
export function planDeco(input: DecoInput): DecoResult {
  const { segments, decoGases, gfLow, gfHigh, ascentRate, airO2 = 0.209, airN2 = 0.79 } = input;

  let state: CompartmentState = initialCompartmentState(airN2);
  let cns = 0;
  let otu = 0;
  let runTime = 0;

  // 1. 다이브 프로파일 시뮬레이션
  let currentDepth = 0;
  let bottomGas: GasMix = segments[0]?.gas ?? { fO2: airO2, fHe: 0, fN2: airN2 };

  for (const seg of segments) {
    bottomGas = seg.gas;
    const segTimeMin = seg.time;
    const avgDepth = (seg.startDepth + seg.endDepth) / 2;
    const pAbs = depthToPressure(avgDepth);
    const ppO2 = seg.gas.fO2 * pAbs;
    const tox = accumulateO2Toxicity(ppO2, segTimeMin);

    state = updateCompartments(state, pAbs, seg.gas, segTimeMin);
    cns += tox.cns;
    otu += tox.otu;
    runTime += segTimeMin;
    currentDepth = seg.endDepth;
  }

  // 2. GF_lo 기준 최초 ceiling → 가장 깊은 감압 정지 수심 결정
  const gfLoCeiling = pressureToDepth(ceiling(state, gfLow));
  const deepestStopDepth = roundUpToStop(gfLoCeiling, STOP_INCREMENT);

  const stops: DecoStop[] = [];

  if (deepestStopDepth <= 0) {
    // 감압 불필요 (NDL 이내)
    return {
      stops: [],
      totalDecoTime: 0,
      tts: Math.ceil((currentDepth / ascentRate)),
      maxCns: cns,
      maxOtu: otu,
    };
  }

  // 3. 바닥에서 최초 감압 정지 수심까지 상승
  const ascToFirst = simulateAscent(
    state, currentDepth, deepestStopDepth, ascentRate, bottomGas, cns, otu
  );
  state = ascToFirst.state;
  cns = ascToFirst.cns;
  otu = ascToFirst.otu;
  runTime += ascToFirst.minutes;
  currentDepth = deepestStopDepth;

  // 4. 감압 정지 처리 (깊은 정지 → 얕은 정지)
  let stopDepth = deepestStopDepth;

  while (stopDepth > 0) {
    const nextStopDepth = stopDepth - STOP_INCREMENT;
    const gas = selectGas(decoGases, bottomGas, stopDepth);
    let stopMinutes = 0;

    // 현재 정지 수심에서 기다리며 ceiling이 다음 정지 수심 이하로 내려올 때까지 대기
    for (let i = 0; i < MAX_STOP_MINUTES; i++) {
      const gf = interpolateGF(stopDepth, deepestStopDepth, gfLow, gfHigh);
      const ceilingDepth = pressureToDepth(ceiling(state, gf));

      if (ceilingDepth <= Math.max(0, nextStopDepth)) break;

      const pAbs = depthToPressure(stopDepth);
      const ppO2 = gas.fO2 * pAbs;
      const tox = accumulateO2Toxicity(ppO2, 1);

      state = updateCompartments(state, pAbs, gas, 1);
      cns += tox.cns;
      otu += tox.otu;
      runTime += 1;
      stopMinutes++;
    }

    if (stopMinutes > 0) {
      stops.push({ depth: stopDepth, time: stopMinutes, gas });
    }

    if (nextStopDepth <= 0) break;

    // 다음 정지 수심으로 상승
    const ascResult = simulateAscent(
      state, stopDepth, nextStopDepth, ascentRate,
      selectGas(decoGases, bottomGas, stopDepth), cns, otu
    );
    state = ascResult.state;
    cns = ascResult.cns;
    otu = ascResult.otu;
    runTime += ascResult.minutes;
    stopDepth = nextStopDepth;
  }

  // 5. 해수면까지 상승 시간 (마지막 3m 정지 → 수면)
  const surfaceAscentMin = Math.ceil(
    (stops.length > 0 ? stops[stops.length - 1].depth : 0) / ascentRate
  );

  const totalDecoTime = stops.reduce((acc, s) => acc + s.time, 0);
  const tts = totalDecoTime + surfaceAscentMin + Math.ceil(deepestStopDepth / ascentRate);

  return {
    stops,
    totalDecoTime,
    tts,
    maxCns: Math.round(cns * 10) / 10,
    maxOtu: Math.round(otu * 10) / 10,
  };
}
