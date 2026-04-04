import { SURFACE_PRESSURE } from './constants';

export interface SACInput {
  /** 사용한 기체량 (bar) */
  pressureUsed: number;
  /** 탱크 용량 (리터) */
  tankVolume: number;
  /** 평균 수심 (m) */
  avgDepth: number;
  /** 잠수 시간 (min) */
  diveTime: number;
}

export interface SACResult {
  /** SAC Rate (L/min, 해수면 기준) */
  sacRate: number;
  /** RMV (Respiratory Minute Volume) = SAC Rate (동일 단위) */
  rmv: number;
  /** 해당 수심에서의 절대 압력 (bar) */
  ambientPressure: number;
  /** 실제 소비한 기체량 (리터) */
  totalGasConsumed: number;
}

/**
 * SAC Rate 계산 (Surface Air Consumption)
 *
 * 공식: SAC = (pressure_used × tank_volume) / (depth_factor × dive_time)
 * depth_factor = (avg_depth / 10) + 1  (절대 압력, bar)
 */
export function calcSAC(input: SACInput): SACResult {
  const { pressureUsed, tankVolume, avgDepth, diveTime } = input;
  const ambientPressure = SURFACE_PRESSURE + avgDepth / 10;
  const totalGasConsumed = pressureUsed * tankVolume;
  const sacRate = totalGasConsumed / (ambientPressure * diveTime);

  return {
    sacRate,
    rmv: sacRate,
    ambientPressure,
    totalGasConsumed,
  };
}

export interface GasEnduranceInput {
  /** 현재 탱크 압력 (bar) */
  currentPressure: number;
  /** 예비 압력 (bar) — 최소 잔압 */
  reservePressure: number;
  /** 탱크 용량 (리터) */
  tankVolume: number;
  /** 계획 수심 (m) */
  depth: number;
  /** SAC Rate (L/min) */
  sacRate: number;
}

export interface GasEnduranceResult {
  /** 사용 가능한 잔여 시간 (min) */
  enduranceMin: number;
  /** 사용 가능한 기체량 (리터, 해수면 기준) */
  usableGasL: number;
  /** 해당 수심 절대 압력 (bar) */
  ambientPressure: number;
}

/**
 * 주어진 수심에서 가스 사용 가능 시간 계산
 */
export function calcGasEndurance(input: GasEnduranceInput): GasEnduranceResult {
  const { currentPressure, reservePressure, tankVolume, depth, sacRate } = input;
  const ambientPressure = SURFACE_PRESSURE + depth / 10;
  const usablePressure = Math.max(0, currentPressure - reservePressure);
  const usableGasL = usablePressure * tankVolume;
  const enduranceMin = usableGasL / (sacRate * ambientPressure);

  return {
    enduranceMin,
    usableGasL,
    ambientPressure,
  };
}
