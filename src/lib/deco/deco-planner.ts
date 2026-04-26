import { GasMix } from '../../types/gas.types';
import {
  DecoInput, DecoResult, DecoStop,
  GasConsumption, IcdWarning, HypoxicWarning,
} from '../../types/deco.types';
import { SURFACE_PRESSURE, MIN_PPO2 } from '../gas/constants';
import {
  CompartmentState,
  initialCompartmentState,
  updateCompartments,
  ceiling,
  pressureToDepth,
} from './buhlmann';
import { interpolateGF, roundUpToStop } from './gradient-factor';
import { accumulateO2Toxicity } from './oxygen-toxicity';

const STOP_INCREMENT  = 3;   // m
const MAX_STOP_MINUTES = 999;
const DEFAULT_LAST_STOP = 6; // m (GUE 스타일 기본값)

function depthToPressure(depthM: number): number {
  return SURFACE_PRESSURE + depthM / 10;
}

/** 수심에서 ppO₂ 한계 이내 최대 O₂ 기체 자동 선택 */
function selectBestGas(
  decoGases: Array<{ mix: GasMix }>,
  bottomMix: GasMix,
  depthM: number,
  ppO2Max: number
): GasMix {
  let best    = bottomMix;
  let bestFO2 = bottomMix.fO2;
  for (const dg of decoGases) {
    const ppO2AtDepth = dg.mix.fO2 * depthToPressure(depthM);
    if (ppO2AtDepth <= ppO2Max && dg.mix.fO2 > bestFO2) {
      best    = dg.mix;
      bestFO2 = dg.mix.fO2;
    }
  }
  return best;
}

/** 기체 라벨 생성 */
function gasLabel(mix: GasMix): string {
  if (mix.fHe > 0.001) {
    return `Trimix ${Math.round(mix.fO2 * 100)}/${Math.round(mix.fHe * 100)}`;
  }
  if (Math.abs(mix.fO2 - 0.21) < 0.005) return 'Air';
  return `EAN ${Math.round(mix.fO2 * 100)}`;
}

/** 두 기체가 동일한지 비교 (1% 허용) */
function sameGas(a: GasMix, b: GasMix): boolean {
  return Math.abs(a.fO2 - b.fO2) < 0.01 && Math.abs(a.fHe - b.fHe) < 0.01;
}

/** 가스 소비량 계산 (L) */
function gasUsed(rmv: number, depthM: number, minutes: number): number {
  return rmv * (depthToPressure(depthM)) * minutes;
}

/** 상승 구간 시뮬레이션 */
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
  const timeMin   = distanceM / ascentRate;
  const avgDepth  = (fromDepth + toDepth) / 2;
  const ppO2      = gas.fO2 * depthToPressure(avgDepth);
  const tox       = accumulateO2Toxicity(ppO2, timeMin);

  const steps    = Math.max(1, Math.ceil(distanceM));
  const stepTime = timeMin / steps;
  let s = state;
  for (let i = 0; i < steps; i++) {
    const d = fromDepth - ((i + 0.5) / steps) * distanceM;
    s = updateCompartments(s, depthToPressure(d), gas, stepTime);
  }

  return { state: s, cns: cnsAcc + tox.cns, otu: otuAcc + tox.otu, minutes: timeMin };
}

/**
 * ICD(Inert Composition Discrepancy) 체크
 * 새 기체의 fN₂가 이전 기체보다 높으면 역방향 전환 → 기포 위험
 */
function checkIcd(prevMix: GasMix, newMix: GasMix): boolean {
  const prevFN2 = 1 - prevMix.fO2 - prevMix.fHe;
  const newFN2  = 1 - newMix.fO2  - newMix.fHe;
  return newFN2 > prevFN2 + 0.005; // 0.5% 이상 N₂ 증가 시
}

/**
 * Bühlmann ZHL-16C + GF 감압 계획 메인 함수
 */
export function planDeco(input: DecoInput): DecoResult {
  const {
    segments, decoGases,
    gfLow, gfHigh, ascentRate,
    airO2 = 0.209, airN2 = 0.79,
    lastStopDepth = DEFAULT_LAST_STOP,
    rmvBottom, rmvDeco,
    ppO2DecoCeiling = 1.6,
  } = input;

  const rmvDecoEff = rmvDeco ?? rmvBottom; // deco RMV 미입력 시 bottom RMV 사용
  const trackGas   = rmvBottom != null && rmvBottom > 0;

  // ── 저산소 경고 (ppO₂ < 0.16 bar) ──────────────────────────────────
  const hypoxicWarnings: HypoxicWarning[] = [];
  const targetDepth =
    segments.find(s => s.type === 'bottom')?.startDepth
    ?? segments[segments.length - 1]?.endDepth
    ?? 0;
  const bottomMixForCheck = segments[0]?.gas ?? { fO2: airO2, fHe: 0, fN2: airN2 };
  const bottomPpO2 = bottomMixForCheck.fO2 * depthToPressure(targetDepth);
  if (bottomPpO2 < MIN_PPO2) {
    hypoxicWarnings.push({
      gasLabel: gasLabel(bottomMixForCheck),
      depth:    targetDepth,
      ppO2:     Math.round(bottomPpO2 * 1000) / 1000,
    });
  }
  for (const dg of decoGases) {
    // 감압 기체는 수면(0m)에서 ppO₂ = fO₂ 가 최솟값 → 저산소 여부만 체크
    if (dg.mix.fO2 < MIN_PPO2) {
      hypoxicWarnings.push({
        gasLabel: gasLabel(dg.mix),
        depth:    0,
        ppO2:     Math.round(dg.mix.fO2 * 1000) / 1000,
      });
    }
  }
  // ────────────────────────────────────────────────────────────────────

  let state: CompartmentState = initialCompartmentState(airN2);
  let cns = 0, otu = 0, runTime = 0;

  // ── 가스 소비량 추적 맵 (label → L) ──
  const consumptionMap = new Map<string, { mix: GasMix; l: number }>();
  function addConsumption(mix: GasMix, l: number) {
    if (!trackGas) return;
    const key = gasLabel(mix);
    const cur = consumptionMap.get(key);
    if (cur) cur.l += l;
    else consumptionMap.set(key, { mix, l });
  }

  // ── ICD 경고 ──
  const icdWarnings: IcdWarning[] = [];
  let prevGas: GasMix | null = null;
  function recordGasSwitch(newGas: GasMix, depthM: number) {
    if (prevGas && !sameGas(prevGas, newGas)) {
      if (checkIcd(prevGas, newGas)) {
        const prevFN2 = 1 - prevGas.fO2 - prevGas.fHe;
        const newFN2  = 1 - newGas.fO2  - newGas.fHe;
        icdWarnings.push({ depth: depthM, prevFN2, newFN2 });
      }
    }
    prevGas = newGas;
  }

  // ── 1. 다이브 프로파일 시뮬레이션 ──
  let currentDepth = 0;
  let bottomGas: GasMix = segments[0]?.gas ?? { fO2: airO2, fHe: 0, fN2: airN2 };

  for (const seg of segments) {
    bottomGas = seg.gas;
    recordGasSwitch(seg.gas, seg.startDepth);
    const avgDepth = (seg.startDepth + seg.endDepth) / 2;
    const pAbs     = depthToPressure(avgDepth);
    const ppO2     = seg.gas.fO2 * pAbs;
    const tox      = accumulateO2Toxicity(ppO2, seg.time);

    // 하강 구간은 단계별 적분 — 평균 수심 단일 계산보다 조직 포화도를 정확히 추적
    const distM = Math.abs(seg.endDepth - seg.startDepth);
    if (distM > 0 && seg.time > 0) {
      const steps    = Math.max(1, Math.ceil(distM));
      const stepTime = seg.time / steps;
      for (let i = 0; i < steps; i++) {
        const frac = (i + 0.5) / steps;
        const d    = seg.startDepth + frac * (seg.endDepth - seg.startDepth);
        state = updateCompartments(state, depthToPressure(d), seg.gas, stepTime);
      }
    } else {
      state = updateCompartments(state, pAbs, seg.gas, seg.time);
    }

    cns     += tox.cns;
    otu     += tox.otu;
    runTime += seg.time;
    currentDepth = seg.endDepth;

    if (trackGas && rmvBottom) {
      addConsumption(seg.gas, gasUsed(rmvBottom, avgDepth, seg.time));
    }
  }

  // ── 2. 첫 감압 정지 수심 동적 탐색 ──
  // 바닥에서의 정적 ceiling 대신, 실제 상승 시 off-gassing을 반영해
  // ceiling ≥ 현재 수심이 처음 발생하는 수심을 탐색 (MultiDeco 방식).
  // 예) ceiling@21m=19m(<21m) → 정지 불필요, ceiling@18m=18.5m(≥18m) → 첫 정지=18m
  const effectiveLastStopEarly = Math.max(STOP_INCREMENT, lastStopDepth);
  const deepestStopDepth = (() => {
    const gfLoCeiling  = pressureToDepth(ceiling(state, gfLow));
    const candidateTop = roundUpToStop(gfLoCeiling, STOP_INCREMENT);
    if (candidateTop <= 0) return 0;

    let s = state;
    let d = currentDepth;
    for (let target = candidateTop; target >= effectiveLastStopEarly; target -= STOP_INCREMENT) {
      const asc = simulateAscent(s, d, target, ascentRate, bottomGas, 0, 0);
      s = asc.state;
      d = target;
      if (pressureToDepth(ceiling(s, gfLow)) >= target) return target;
    }
    return 0; // 모든 정지 수심에서 천장 < 현재 수심 → 감압 불필요
  })();

  const stops: DecoStop[] = [];

  if (deepestStopDepth <= 0) {
    return {
      stops: [], totalDecoTime: 0,
      tts: Math.ceil(currentDepth / ascentRate),
      maxCns: cns, maxOtu: otu,
      gasConsumptions:  trackGas ? buildConsumptions(consumptionMap) : undefined,
      icdWarnings:      icdWarnings.length > 0 ? icdWarnings : undefined,
      hypoxicWarnings:  hypoxicWarnings.length > 0 ? hypoxicWarnings : undefined,
    };
  }

  // ── 3. 바닥 → 첫 감압 정지 수심으로 상승 (ppO₂ 기반 자동 기체 전환) ──
  // 각 감압 기체의 MOD(ppO₂ 한계 기준)를 3m 단위로 내림 → 깊은 것부터 순서대로 전환
  {
    let fromD = currentDepth;
    let gas   = bottomGas;

    const switchPoints = decoGases
      .map(dg => ({
        mix:     dg.mix,
        switchD: Math.floor((ppO2DecoCeiling / dg.mix.fO2 - 1) * 10 / STOP_INCREMENT) * STOP_INCREMENT,
      }))
      .filter(sp => sp.switchD >= deepestStopDepth && sp.switchD < fromD)
      .sort((a, b) => b.switchD - a.switchD);

    for (const sp of switchPoints) {
      if (sp.mix.fO2 <= gas.fO2) continue; // 현재 기체보다 O₂ 낮으면 스킵
      const asc = simulateAscent(state, fromD, sp.switchD, ascentRate, gas, cns, otu);
      state   = asc.state; cns = asc.cns; otu = asc.otu; runTime += asc.minutes;
      if (trackGas) {
        const rmv = sameGas(gas, bottomGas) ? rmvBottom : rmvDecoEff;
        if (rmv) addConsumption(gas, gasUsed(rmv, (fromD + sp.switchD) / 2, asc.minutes));
      }
      fromD = sp.switchD;
      gas   = sp.mix;
      recordGasSwitch(gas, fromD);
    }

    const asc = simulateAscent(state, fromD, deepestStopDepth, ascentRate, gas, cns, otu);
    state       = asc.state; cns = asc.cns; otu = asc.otu; runTime += asc.minutes;
    currentDepth = deepestStopDepth;
    if (trackGas) {
      const rmv = sameGas(gas, bottomGas) ? rmvBottom : rmvDecoEff;
      if (rmv) addConsumption(gas, gasUsed(rmv, (fromD + deepestStopDepth) / 2, asc.minutes));
    }
  }

  // ── 4. 감압 정지 처리 ──
  const effectiveLastStop = effectiveLastStopEarly;
  let stopDepth = deepestStopDepth;

  while (stopDepth >= effectiveLastStop) {
    const nextStopDepth = stopDepth - STOP_INCREMENT;
    const gas = selectBestGas(decoGases, bottomGas, stopDepth, ppO2DecoCeiling);
    recordGasSwitch(gas, stopDepth);

    let stopMinutes = 0;

    for (let i = 0; i < MAX_STOP_MINUTES; i++) {
      const gf           = interpolateGF(stopDepth, deepestStopDepth, gfLow, gfHigh);
      const ceilingDepth = pressureToDepth(ceiling(state, gf));
      // 마지막 정지는 수면(0m)까지 클리어, 그 외는 현재 수심 이하가 되면 출발 가능
      // (MultiDeco / Shearwater 방식: ceiling ≤ currentDepth → proceed)
      const clearTarget  = stopDepth <= effectiveLastStop ? 0 : stopDepth;
      if (ceilingDepth <= clearTarget) break;

      const pAbs = depthToPressure(stopDepth);
      const tox  = accumulateO2Toxicity(gas.fO2 * pAbs, 1);
      state    = updateCompartments(state, pAbs, gas, 1);
      cns     += tox.cns;
      otu     += tox.otu;
      runTime += 1;
      stopMinutes++;
    }

    if (stopMinutes > 0) {
      const usedL = trackGas && rmvDecoEff
        ? gasUsed(rmvDecoEff, stopDepth, stopMinutes)
        : undefined;
      stops.push({ depth: stopDepth, time: stopMinutes, gas, gasUsedL: usedL });
      if (usedL != null) addConsumption(gas, usedL);
    }

    if (stopDepth <= effectiveLastStop) break;

    // 다음 정지 수심으로 상승
    const ascResult = simulateAscent(
      state, stopDepth, nextStopDepth, ascentRate,
      selectBestGas(decoGases, bottomGas, stopDepth, ppO2DecoCeiling), cns, otu
    );
    if (trackGas && rmvDecoEff) {
      addConsumption(gas, gasUsed(rmvDecoEff, (stopDepth + nextStopDepth) / 2, ascResult.minutes));
    }
    state       = ascResult.state;
    cns         = ascResult.cns;
    otu         = ascResult.otu;
    runTime    += ascResult.minutes;
    stopDepth   = nextStopDepth;
  }

  // ── 5. 마지막 정지 → 수면 상승 시간 ──
  const lastActualStop  = stops.length > 0 ? stops[stops.length - 1].depth : 0;
  const surfaceAscentMin = Math.ceil(lastActualStop / ascentRate);
  const totalDecoTime    = stops.reduce((acc, s) => acc + s.time, 0);
  const tts              = totalDecoTime + surfaceAscentMin + Math.ceil(deepestStopDepth / ascentRate);

  return {
    stops,
    totalDecoTime,
    tts,
    maxCns: Math.round(cns * 10) / 10,
    maxOtu: Math.round(otu * 10) / 10,
    gasConsumptions:  trackGas ? buildConsumptions(consumptionMap) : undefined,
    icdWarnings:      icdWarnings.length > 0 ? icdWarnings : undefined,
    hypoxicWarnings:  hypoxicWarnings.length > 0 ? hypoxicWarnings : undefined,
  };
}

function buildConsumptions(
  map: Map<string, { mix: GasMix; l: number }>
): GasConsumption[] {
  return Array.from(map.entries()).map(([label, { mix, l }]) => ({
    mix,
    label,
    totalL: Math.round(l),
  }));
}
