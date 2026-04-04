import { calcOCBlend } from '../../src/lib/blending/oc-blending';

describe('OC Blending', () => {
  test('빈 탱크에서 Nitrox32 200bar 채우기 — O₂ 주입량 검증', () => {
    // addO2 = (0.32*200 - 0 - 0.209*200) / (1 - 0.209) = (64-41.8)/0.791 ≈ 28.06
    const result = calcOCBlend({
      currentPressure: 0,
      currentMix: { fO2: 0.21, fHe: 0, fN2: 0.79 },
      targetPressure: 200,
      targetMix: { fO2: 0.32, fHe: 0, fN2: 0.68 },
    });
    expect(result.addHePressure).toBe(0);
    expect(result.addO2Pressure).toBeCloseTo(28.06, 0);
    expect(result.warnings).toHaveLength(0);
  });

  test('탑업 결과 혼합비가 목표에 수렴', () => {
    const result = calcOCBlend({
      currentPressure: 50,
      currentMix: { fO2: 0.21, fHe: 0, fN2: 0.79 },
      targetPressure: 200,
      targetMix: { fO2: 0.32, fHe: 0, fN2: 0.68 },
    });
    expect(result.resultMix.fO2).toBeCloseTo(0.32, 2);
  });

  test('Trimix 블렌딩 — He + O₂ 모두 주입', () => {
    // 빈탱크 → Trimix 21/35 at 200bar
    const result = calcOCBlend({
      currentPressure: 0,
      currentMix: { fO2: 0.21, fHe: 0, fN2: 0.79 },
      targetPressure: 200,
      targetMix: { fO2: 0.21, fHe: 0.35, fN2: 0.44 },
    });
    expect(result.addHePressure).toBeCloseTo(70, 0); // 0.35 * 200 = 70
    expect(result.resultMix.fO2).toBeCloseTo(0.21, 2);
    expect(result.resultMix.fHe).toBeCloseTo(0.35, 2);
  });

  test('target <= current 경고 발생', () => {
    const result = calcOCBlend({
      currentPressure: 200,
      currentMix: { fO2: 0.32, fHe: 0, fN2: 0.68 },
      targetPressure: 150,
      targetMix: { fO2: 0.32, fHe: 0, fN2: 0.68 },
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
