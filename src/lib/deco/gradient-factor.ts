/**
 * Gradient Factor 보간
 *
 * GF는 가장 깊은 감압 정지 수심(deepestStop)에서 GF_lo,
 * 해수면(0m)에서 GF_hi 값을 가지며 선형 보간된다.
 */
export function interpolateGF(
  currentDepthM: number,
  deepestStopDepthM: number,
  gfLow: number,
  gfHigh: number
): number {
  if (deepestStopDepthM <= 0) return gfHigh;
  const ratio = currentDepthM / deepestStopDepthM;
  return gfLow + (gfHigh - gfLow) * (1 - ratio);
}

/** 수심을 3m 단위 감압 정지 수심으로 올림 */
export function roundUpToStop(depthM: number, increment = 3): number {
  if (depthM <= 0) return 0;
  return Math.ceil(depthM / increment) * increment;
}
