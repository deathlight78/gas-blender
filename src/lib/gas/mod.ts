import { DEFAULT_PPO2_WORK, MIN_PPO2, SURFACE_PRESSURE } from './constants';

/**
 * MOD (Maximum Operating Depth) — 미터 단위
 * @param fO2 산소 비율 (0~1)
 * @param ppO2Limit ppO₂ 한계 (bar), 기본 1.4
 */
export function mod(fO2: number, ppO2Limit: number = DEFAULT_PPO2_WORK): number {
  if (fO2 <= 0 || fO2 > 1) throw new RangeError('fO2 must be between 0 and 1');
  return (ppO2Limit / fO2 - SURFACE_PRESSURE) * 10;
}

/**
 * Best Mix — 주어진 수심과 ppO₂ 한계에서 최적 O₂ 비율
 * @param depthM 수심 (m)
 * @param ppO2Limit ppO₂ 한계 (bar)
 */
export function bestMix(depthM: number, ppO2Limit: number = DEFAULT_PPO2_WORK): number {
  const pAbs = SURFACE_PRESSURE + depthM / 10;
  return Math.min(1.0, ppO2Limit / pAbs);
}

/**
 * 최소 운용 수심 — 저산소증 방지 (m)
 * @param fO2 산소 비율
 * @param minPpO2 최소 ppO₂ (기본 0.16 bar)
 */
export function minOperatingDepth(fO2: number, minPpO2: number = MIN_PPO2): number {
  return Math.max(0, (minPpO2 / fO2 - SURFACE_PRESSURE) * 10);
}
