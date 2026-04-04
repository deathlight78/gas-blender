/**
 * 산소 독성 계산
 * - CNS%: NOAA 단일 노출 한계 기반
 * - OTU: Repex 공식 기반
 */

/** ppO₂ → 단일 노출 한계 (분). NOAA 표 기반 구간 보간 */
function cnsExposureLimit(ppO2: number): number {
  if (ppO2 < 0.5) return Infinity;
  if (ppO2 <= 0.6) return 720;
  if (ppO2 <= 0.7) return 570;
  if (ppO2 <= 0.8) return 450;
  if (ppO2 <= 0.9) return 360;
  if (ppO2 <= 1.0) return 300;
  if (ppO2 <= 1.1) return 270;
  if (ppO2 <= 1.2) return 240;
  if (ppO2 <= 1.3) return 210;
  if (ppO2 <= 1.4) return 180;
  if (ppO2 <= 1.5) return 150;
  if (ppO2 <= 1.6) return 45;
  return 10; // >1.6 bar — 매우 위험
}

/**
 * CNS% 증가량 (1분당)
 * @param ppO2 산소 부분압 (bar)
 */
export function cnsPerMinute(ppO2: number): number {
  const limit = cnsExposureLimit(ppO2);
  return limit === Infinity ? 0 : (1 / limit) * 100;
}

/**
 * OTU 증가량 (1분당) — Repex 공식
 * OTU/min = max(0, ((ppO2 - 0.5) / 0.5)^0.833)
 * @param ppO2 산소 부분압 (bar)
 */
export function otuPerMinute(ppO2: number): number {
  if (ppO2 <= 0.5) return 0;
  return Math.pow((ppO2 - 0.5) / 0.5, 0.833);
}

/** t분 동안의 CNS%, OTU 누적 계산 */
export function accumulateO2Toxicity(
  ppO2: number,
  minutes: number
): { cns: number; otu: number } {
  return {
    cns: cnsPerMinute(ppO2) * minutes,
    otu: otuPerMinute(ppO2) * minutes,
  };
}
