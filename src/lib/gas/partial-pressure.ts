import { PRESSURE_PER_10M, SURFACE_PRESSURE } from './constants';

/**
 * 수심(m)에서의 절대 압력 반환 (bar)
 * 민물은 freshwater=true
 */
export function absolutePressure(depthM: number, freshwater = false): number {
  const gradient = freshwater ? 0.098 : PRESSURE_PER_10M;
  return SURFACE_PRESSURE + (depthM / 10) * gradient;
}

/**
 * 특정 수심에서 기체의 부분압 (bar)
 */
export function partialPressure(fraction: number, depthM: number, freshwater = false): number {
  return fraction * absolutePressure(depthM, freshwater);
}

/**
 * 목표 ppO₂와 수심으로 필요한 O₂ 비율 계산
 */
export function fractionFromPP(ppTarget: number, depthM: number, freshwater = false): number {
  return ppTarget / absolutePressure(depthM, freshwater);
}
