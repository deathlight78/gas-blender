/** 기체 혼합 비율 (0~1 사이 소수) */
export interface GasMix {
  fO2: number;  // 산소 비율
  fHe: number;  // 헬륨 비율
  fN2: number;  // 질소 비율 (= 1 - fO2 - fHe)
}

/** 실린더 상태 */
export interface Tank {
  id: string;
  name: string;
  volume: number;     // 리터
  pressure: number;   // bar
  mix: GasMix;
}

/** ppO₂ 설정 한계 */
export interface PpO2Limits {
  work: number;   // 작업 한계 (기본 1.4 bar)
  deco: number;   // 감압 한계 (기본 1.6 bar)
}

export type DepthUnit = 'm' | 'ft';
export type PressureUnit = 'bar' | 'psi';
