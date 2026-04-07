import { GasMix } from './gas.types';

/** OC 블렌딩 입력 */
export interface OCBlendInput {
  /** 현재 탱크 압력 (bar) */
  currentPressure: number;
  /** 현재 탱크 혼합비 */
  currentMix: GasMix;
  /** 목표 최종 압력 (bar) */
  targetPressure: number;
  /** 목표 혼합비 */
  targetMix: GasMix;
  /** 공기 O₂ 비율 (설정값, 기본 0.209) */
  airO2?: number;
}

/** OC 블렌딩 결과 — 각 기체 주입 순서와 압력 */
export interface OCBlendResult {
  /** 먼저 헬륨 주입 압력 (bar) */
  addHePressure: number;
  /** 그다음 산소 주입 압력 (bar) */
  addO2Pressure: number;
  /** 마지막 공기/탑업 압력 (bar) */
  addTopPressure: number;
  /** 탑업 기체 종류 */
  topGas: 'air' | 'nitrox32' | 'nitrox36';
  /** 최종 혼합비 (검증용) */
  resultMix: GasMix;
  /** 경고 메시지 목록 */
  warnings: string[];
  /** 결과가 물리적으로 유효한지 (false면 단계별 수치를 신뢰할 수 없음) */
  isValid: boolean;
}

/** CCR 블렌딩 입력 */
export interface CCRBlendInput {
  /** Diluent 탱크 */
  diluentMix: GasMix;
  diluentPressure: number;
  /** O₂ 탱크 */
  o2Pressure: number;
  /** 목표 setpoint (ppO₂, bar) */
  setpoint: number;
  /** CCR-4: 저수심 전환 setpoint (optional) */
  setpoint2?: number;
  /** 계획 최대 수심 (m) */
  maxDepth: number;
  /** CCR-5: 계획 다이빙 시간 (분) */
  diveTimeMin?: number;
  /** CCR-5: O₂ 실린더 수중용량 (L, 예: 2L 실린더) */
  o2TankSizeL?: number;
}

/** CCR 블렌딩 결과 */
export interface CCRBlendResult {
  /** Setpoint 유지 가능 최대 수심 (m) */
  maxSetpointDepth: number;
  /** 해당 수심에서의 실제 ppO₂ */
  actualPpO2AtDepth: number;
  /** CCR-1: Diluent MOD (ppO₂ 1.4 기준, m) */
  diluentMod: number;
  /** CCR-2: 저산소 한계 수심 (Diluent ppO₂ = 0.16 bar, m). 음수이면 해수면에서도 저산소 */
  hypoxicLimitDepth: number;
  /** CCR-3: 최대 수심에서의 Diluent pN₂ (bar) */
  pN2AtDepth: number;
  /** CCR-4: SP2 기준 전환 수심 (m). setpoint2 미입력 시 undefined */
  sp2SwitchDepth?: number;
  /** CCR-5: O₂ 소비량 (L). diveTimeMin 입력 시 계산 */
  o2ConsumedL?: number;
  /** CCR-5: O₂ 탱크 압력 강하 (bar). o2TankSizeL 입력 시 계산 */
  o2PressureDrop?: number;
  warnings: string[];
}
