import { calcCCRBlend } from '../../src/lib/blending/ccr-blending';

const AIR_MIX = { fO2: 0.21, fHe: 0, fN2: 0.79 };
const TRIMIX_MIX = { fO2: 0.21, fHe: 0.35, fN2: 0.44 };

describe('CCR Blending', () => {
  test('Trimix diluent setpoint 1.3 — 최대 수심 계산', () => {
    // maxSetpointDepth = (1.3 / 0.21 - 1) * 10 = (6.19 - 1) * 10 = 51.9m
    const result = calcCCRBlend({
      diluentMix: AIR_MIX,
      diluentPressure: 200,
      o2Pressure: 200,
      setpoint: 1.3,
      maxDepth: 40,
    });
    expect(result.maxSetpointDepth).toBeCloseTo(51.9, 0);
    expect(result.warnings).toHaveLength(0);
  });

  test('목표 수심이 setpoint 유지 가능 수심을 초과하면 경고', () => {
    // Air diluent, setpoint 1.3, maxDepth 60m → depth > maxSetpointDepth(51.9m)
    const result = calcCCRBlend({
      diluentMix: AIR_MIX,
      diluentPressure: 200,
      o2Pressure: 200,
      setpoint: 1.3,
      maxDepth: 60,
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test('setpoint 1.6 초과 시 경고', () => {
    const result = calcCCRBlend({
      diluentMix: AIR_MIX,
      diluentPressure: 200,
      o2Pressure: 200,
      setpoint: 1.7,
      maxDepth: 40,
    });
    expect(result.warnings.some((w) => w.includes('1.6'))).toBe(true);
  });

  test('Trimix diluent 목표 수심 ppO2 검증', () => {
    // 45m에서 P_abs = 5.5 bar, fO2=0.21, ppO2 = 0.21 * 5.5 = 1.155
    const result = calcCCRBlend({
      diluentMix: TRIMIX_MIX,
      diluentPressure: 200,
      o2Pressure: 200,
      setpoint: 1.3,
      maxDepth: 45,
    });
    expect(result.actualPpO2AtDepth).toBeCloseTo(1.155, 2);
  });
});
