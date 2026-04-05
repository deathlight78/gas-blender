/**
 * buildRange — 등간격 숫자 배열 생성
 * @param min  시작 값 (포함)
 * @param max  끝 값 (포함)
 * @param step 간격 (기본값 1)
 */
export function buildRange(min: number, max: number, step = 1): number[] {
  const arr: number[] = [];
  for (let v = min; v <= max; v = Math.round((v + step) * 1000) / 1000) {
    arr.push(v);
  }
  return arr;
}
