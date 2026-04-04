import { ead, end } from '../../src/lib/gas/ead-end';

describe('EAD / END calculations', () => {
  // EAD = (fN2 / 0.79) * (depth + 10) - 10

  test('EAD for Nitrox32 at 40m → 33.04m', () => {
    // (0.68 / 0.79) * 50 - 10 = 43.04 - 10 = 33.04
    expect(ead(0.68, 40)).toBeCloseTo(33.04, 1);
  });

  test('EAD for air (fN2=0.79) at 30m → 30m', () => {
    expect(ead(0.79, 30)).toBeCloseTo(30, 1);
  });

  test('EAD for Nitrox36 at 30m → 21.8m', () => {
    // (0.64 / 0.79) * 40 - 10 = 32.4 - 10 = 22.4
    expect(ead(0.64, 30)).toBeCloseTo(22.4, 1);
  });

  test('END for Trimix 21/35 at 60m → less than 60m', () => {
    // fHe=0.35, narcotic fraction=0.65
    // P_abs = 7 bar, P_narcotic = 0.65 * 7 = 4.55
    // END = (4.55 - 1) * 10 = 35.5m
    const result = end(0.35, 60);
    expect(result).toBeCloseTo(35.5, 1);
  });
});
