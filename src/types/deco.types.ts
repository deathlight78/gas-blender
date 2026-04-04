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
}

/** 감압 정지 */
export interface DecoStop {
  depth: number;   // m
  time: number;    // 분
  gas: GasMix;
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
}
