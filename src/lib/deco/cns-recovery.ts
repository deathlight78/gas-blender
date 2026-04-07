import { SessionEntry } from '../../types/deco.types';

/** CNS% 회복 반감기: 90분 */
const CNS_HALF_LIFE_MIN = 90;

/**
 * 수면 휴식 후 잔류 CNS% 계산
 * 지수 회복: CNS_잔류 = CNS × 0.5^(휴식시간 / 90)
 */
export function cnsAfterRecovery(cns: number, surfaceIntervalMin: number): number {
  if (surfaceIntervalMin <= 0) return cns;
  return cns * Math.pow(0.5, surfaceIntervalMin / CNS_HALF_LIFE_MIN);
}

/**
 * 세션 엔트리 목록에서 현재 다이빙 전 carry-over OTU · CNS% 계산
 * - OTU: 수면 휴식 중 회복 없음, 단순 누적
 * - CNS%: 수면 휴식마다 지수 감소 적용
 */
export function calcSessionCarryover(entries: SessionEntry[]): { cns: number; otu: number } {
  let cns = 0;
  let otu = 0;
  for (const entry of entries) {
    cns += entry.diveCns;
    cns = cnsAfterRecovery(cns, entry.surfaceIntervalMin);
    otu += entry.diveOtu;
  }
  return {
    cns: Math.max(0, Math.round(cns * 10) / 10),
    otu: Math.round(otu * 10) / 10,
  };
}
