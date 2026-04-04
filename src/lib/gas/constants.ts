/**
 * 다이빙 계산용 해수면 압력 (bar)
 * 물리적 표준 대기압은 1.013bar이지만,
 * 다이빙 업계 표준(10m = 1 bar)에 따라 1.0을 사용한다.
 */
export const SURFACE_PRESSURE = 1.0;

/** 해수 10m당 압력 (bar) */
export const PRESSURE_PER_10M = 1.0;

/** 공기 O₂ 비율 */
export const AIR_O2 = 0.209;

/** 공기 N₂ 비율 (다이빙 계산 표준값) */
export const AIR_N2 = 0.79;

/** 기본 ppO₂ 작업 한계 (bar) */
export const DEFAULT_PPO2_WORK = 1.4;

/** 기본 ppO₂ 감압 한계 (bar) */
export const DEFAULT_PPO2_DECO = 1.6;

/** 최소 ppO₂ 한계 — 저산소증 방지 (bar) */
export const MIN_PPO2 = 0.16;

/** 표준 감압 정지 수심 간격 (m) */
export const DECO_STOP_INCREMENT = 3;
