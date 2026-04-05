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
  /** 계획 최대 수심 (m) */
  maxDepth: number;
}

/** CCR 블렌딩 결과 */
export interface CCRBlendResult {
  /** Setpoint 유지 가능 최대 수심 (m) */
  maxSetpointDepth: number;
  /** 해당 수심에서의 실제 ppO₂ */
  actualPpO2AtDepth: number;
  warnings: string[];
}
