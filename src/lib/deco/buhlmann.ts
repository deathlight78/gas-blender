import { ZHL16C_COMPARTMENTS, NUM_COMPARTMENTS } from './compartments';
import { GasMix } from '../../types/gas.types';
import { SURFACE_PRESSURE } from '../gas/constants';

const WATER_VAPOR_PRESSURE = 0.0627; // bar (37°C)
const RQ = 1.0; // 호흡 지수 (단순화)

/** 폐포 분압 계산 */
function alveolarPartialPressure(gasFraction: number, ambientPressure: number): number {
  return gasFraction * (ambientPressure - WATER_VAPOR_PRESSURE);
}

/** Schreiner 방정식으로 시간 t 후 조직 포화도 */
function schreiner(
  pInitial: number,
  pAlv: number,
  halfTime: number,
  t: number
): number {
  const k = Math.LN2 / halfTime;
  return pAlv + (pInitial - pAlv) * Math.exp(-k * t);
}

export interface CompartmentState {
  pN2: number[];  // 각 조직 N₂ 분압 (bar)
  pHe: number[];  // 각 조직 He 분압 (bar)
}

/** 초기 조직 상태 (해수면 공기 호흡 기준) */
export function initialCompartmentState(airN2 = 0.79): CompartmentState {
  const pN2Surface = alveolarPartialPressure(airN2, SURFACE_PRESSURE);
  return {
    pN2: Array(NUM_COMPARTMENTS).fill(pN2Surface),
    pHe: Array(NUM_COMPARTMENTS).fill(0),
  };
}

/**
 * 일정 깊이에서 시간 t(분) 동안의 조직 포화도 업데이트
 * @param state 현재 조직 상태
 * @param ambientPressure 환경 압력 (bar)
 * @param mix 호흡 기체
 * @param t 시간 (분)
 */
export function updateCompartments(
  state: CompartmentState,
  ambientPressure: number,
  mix: GasMix,
  t: number
): CompartmentState {
  const pAlvN2 = alveolarPartialPressure(mix.fN2, ambientPressure);
  const pAlvHe = alveolarPartialPressure(mix.fHe, ambientPressure);

  const newPn2 = state.pN2.map((pN2, i) =>
    schreiner(pN2, pAlvN2, ZHL16C_COMPARTMENTS[i][0], t)
  );
  const newPhe = state.pHe.map((pHe, i) =>
    schreiner(pHe, pAlvHe, ZHL16C_COMPARTMENTS[i][3], t)
  );

  return { pN2: newPn2, pHe: newPhe };
}

/**
 * GF 적용 ceiling 계산 (bar)
 * @param state 현재 조직 상태
 * @param gf Gradient Factor (0~1)
 */
export function ceiling(state: CompartmentState, gf: number): number {
  let maxCeiling = 0;

  for (let i = 0; i < NUM_COMPARTMENTS; i++) {
    const [, aN2, bN2, , aHe, bHe] = ZHL16C_COMPARTMENTS[i];
    const pt = state.pN2[i] + state.pHe[i];

    // 혼합 a, b 계수 (Bühlmann 권장 보간)
    const a = (aN2 * state.pN2[i] + aHe * state.pHe[i]) / (pt + 1e-9);
    const b = (bN2 * state.pN2[i] + bHe * state.pHe[i]) / (pt + 1e-9);

    const compartmentCeiling = (pt - gf * a) / (gf / b - gf + 1);
    if (compartmentCeiling > maxCeiling) {
      maxCeiling = compartmentCeiling;
    }
  }

  return Math.max(0, maxCeiling);
}

/**
 * 수심(m)으로 변환 (bar → m)
 */
export function pressureToDepth(pressureBar: number): number {
  return Math.max(0, (pressureBar - SURFACE_PRESSURE) * 10);
}
