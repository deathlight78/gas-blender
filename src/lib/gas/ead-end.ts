import { AIR_N2, SURFACE_PRESSURE } from './constants';

/**
 * EAD (Equivalent Air Depth) — 다이빙 업계 표준 공식
 * Nitrox의 N₂ 부분압이 공기와 같은 수심 (m)
 * EAD = (fN2 / 0.79) * (depth + 10) - 10
 * @param fN2 질소 비율
 * @param depthM 실제 수심 (m)
 */
export function ead(fN2: number, depthM: number): number {
  return (fN2 / AIR_N2) * (depthM + 10) - 10;
}

/**
 * END (Equivalent Narcotic Depth) — 헬륨은 비마취성으로 가정
 * N₂ + O₂를 마취 기체로 계산
 * @param fHe 헬륨 비율
 * @param depthM 실제 수심 (m)
 */
export function end(fHe: number, depthM: number): number {
  const pAbs = SURFACE_PRESSURE + depthM / 10;
  const narcoticFraction = 1 - fHe;
  const pNarcotic = narcoticFraction * pAbs;
  return (pNarcotic - SURFACE_PRESSURE) * 10;
}

/**
 * 산소도 마취성으로 포함한 END (일부 기관 방식)
 */
export function endWithO2(fHe: number, depthM: number): number {
  return end(fHe, depthM);
}
