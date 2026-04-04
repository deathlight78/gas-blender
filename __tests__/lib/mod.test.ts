import { mod, bestMix, minOperatingDepth } from '../../src/lib/gas/mod';

describe('MOD calculations', () => {
  // surface=1.0 bar 기준: MOD = (ppO2 / fO2 - 1) * 10

  test('Nitrox32 MOD at 1.4 ppO2 → 33.75m', () => {
    expect(mod(0.32, 1.4)).toBeCloseTo(33.75, 1);
  });

  test('EAN21 (air) MOD at 1.4 ppO2 → 56.67m', () => {
    expect(mod(0.21, 1.4)).toBeCloseTo(56.67, 1);
  });

  test('100% O2 MOD at 1.6 ppO2 → 6m', () => {
    expect(mod(1.0, 1.6)).toBeCloseTo(6.0, 1);
  });

  test('bestMix at 40m for 1.4 ppO2 → 28%', () => {
    // P_abs = 1 + 4 = 5 bar, fO2 = 1.4/5 = 0.28
    expect(bestMix(40, 1.4)).toBeCloseTo(0.28, 2);
  });

  test('minOperatingDepth for Nitrox32 → 0m (해수면에서 ppO2 충분)', () => {
    expect(minOperatingDepth(0.32)).toBe(0);
  });

  test('throws for invalid fO2', () => {
    expect(() => mod(0, 1.4)).toThrow(RangeError);
    expect(() => mod(1.1, 1.4)).toThrow(RangeError);
  });
});
