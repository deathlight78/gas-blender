import { GasMix } from './gas.types';

/** 다이빙 프로파일 세그먼트 */
export interface DiveSegment {
  type: 'descent' | 'bottom' | 'ascent' | 'stop';
  startDepth: number;  // m
  endDepth: number;    // m
  time: number;        // 분
  gas: GasMix;
}

/** 감압 계획 입력 */
export interface DecoInput {
  /** 다이빙 프로파일 세그먼트 목록 */
  segments: DiveSegment[];
  /** 사용 가능한 감압 기체 목록 (수심 얕은 순) */
  decoGases: Array<{ switchDepth: number; mix: GasMix }>;
  /** Gradient Factor */
  gfLow: number;   // 0~1 (예: 0.3)
  gfHigh: number;  // 0~1 (예: 0.8)
  /** 상승 속도 (m/min) */
  ascentRate: number;
  /** 하강 속도 (m/min) */
  descentRate: number;
  /** 공기 O₂ 비율 (설정값, 기본 0.209) */
  airO2?: number;
  /** 공기 N₂ 비율 (설정값, 기본 0.79) */
  airN2?: number;
  /** 마지막 감압 정지 수심 (m, 기본 6) */
  lastStopDepth?: number;
  /** 바닥 RMV (L/min, 미설정 시 가스 소비량 미계산) */
  rmvBottom?: number;
  /** 감압 RMV (L/min, 미설정 시 rmvBottom 사용) */
  rmvDeco?: number;
}

/** 감압 정지 */
export interface DecoStop {
  depth: number;   // m
  time: number;    // 분
  gas: GasMix;
  /** 해당 정지에서 소비되는 가스량 (L, RMV 입력 시에만 존재) */
  gasUsedL?: number;
}

/** 기체별 소비량 요약 */
export interface GasConsumption {
  mix: GasMix;
  /** 기체 라벨 (예: "EAN50", "Trimix 21/35") */
  label: string;
  /** 총 소비량 (L) */
  totalL: number;
}

/** ICD(역방향 가스 전환) 경고 */
export interface IcdWarning {
  /** 전환 수심 (m) */
  depth: number;
  /** 이전 기체 fN₂ */
  prevFN2: number;
  /** 신규 기체 fN₂ */
  newFN2: number;
}

/** 감압 계획 결과 */
export interface DecoResult {
  stops: DecoStop[];
  /** 총 감압 시간 (분) */
  totalDecoTime: number;
  /** TTS — Time To Surface (분) */
  tts: number;
  /** 최대 CNS % */
  maxCns: number;
  /** 최대 OTU */
  maxOtu: number;
  /** 기체별 소비량 (RMV 입력 시에만 존재) */
  gasConsumptions?: GasConsumption[];
  /** ICD 경고 목록 */
  icdWarnings?: IcdWarning[];
}
