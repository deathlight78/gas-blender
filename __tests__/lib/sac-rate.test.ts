import { calcSAC, calcGasEndurance } from '../../src/lib/gas/sac-rate';

describe('calcSAC', () => {
  test('기본 SAC Rate 계산 — 20m 수심, 100 bar 사용, 12L 탱크, 45분', () => {
    const result = calcSAC({
      pressureUsed: 100,
      tankVolume: 12,
      avgDepth: 20,
      diveTime: 45,
    });
    // ambientPressure = 1 + 20/10 = 3 bar
    // totalGasConsumed = 100 * 12 = 1200 L
    // sacRate = 1200 / (3 * 45) = 8.889 L/min
    expect(result.totalGasConsumed).toBeCloseTo(1200, 1);
    expect(result.ambientPressure).toBeCloseTo(3, 5);
    expect(result.sacRate).toBeCloseTo(8.889, 2);
    expect(result.rmv).toBeCloseTo(result.sacRate, 5);
  });

  test('해수면(0m) 수심 — ambientPressure = 1 bar', () => {
    const result = calcSAC({
      pressureUsed: 50,
      tankVolume: 10,
      avgDepth: 0,
      diveTime: 10,
    });
    expect(result.ambientPressure).toBeCloseTo(1, 5);
    expect(result.totalGasConsumed).toBeCloseTo(500, 1);
    expect(result.sacRate).toBeCloseTo(50, 2); // 500 / (1 * 10)
  });

  test('40m 수심 — ambientPressure = 5 bar', () => {
    const result = calcSAC({
      pressureUsed: 150,
      tankVolume: 15,
      avgDepth: 40,
      diveTime: 30,
    });
    expect(result.ambientPressure).toBeCloseTo(5, 5);
    // sacRate = (150 * 15) / (5 * 30) = 2250 / 150 = 15 L/min
    expect(result.sacRate).toBeCloseTo(15, 2);
  });
});

describe('calcGasEndurance', () => {
  test('기본 가스 사용 가능 시간 계산 — 200 bar, 예비 50 bar, 12L, 30m, SAC 20 L/min', () => {
    const result = calcGasEndurance({
      currentPressure: 200,
      reservePressure: 50,
      tankVolume: 12,
      depth: 30,
      sacRate: 20,
    });
    // ambientPressure = 1 + 30/10 = 4 bar
    // usablePressure = 200 - 50 = 150 bar
    // usableGasL = 150 * 12 = 1800 L
    // enduranceMin = 1800 / (20 * 4) = 22.5 min
    expect(result.ambientPressure).toBeCloseTo(4, 5);
    expect(result.usableGasL).toBeCloseTo(1800, 1);
    expect(result.enduranceMin).toBeCloseTo(22.5, 2);
  });

  test('예비 압력 부족 (현재 압력 <= 예비 압력) — usableGasL = 0, enduranceMin = 0', () => {
    const result = calcGasEndurance({
      currentPressure: 50,
      reservePressure: 50,
      tankVolume: 12,
      depth: 20,
      sacRate: 20,
    });
    expect(result.usableGasL).toBeCloseTo(0, 5);
    expect(result.enduranceMin).toBeCloseTo(0, 5);
  });

  test('예비 압력 0 bar — 전체 탱크 사용 가능', () => {
    const result = calcGasEndurance({
      currentPressure: 200,
      reservePressure: 0,
      tankVolume: 10,
      depth: 10,
      sacRate: 20,
    });
    // ambientPressure = 2, usableGasL = 2000, enduranceMin = 2000 / (20 * 2) = 50
    expect(result.usableGasL).toBeCloseTo(2000, 1);
    expect(result.enduranceMin).toBeCloseTo(50, 2);
  });

  test('해수면(0m) — ambientPressure = 1 bar, 사용 가능 시간 최대', () => {
    const result = calcGasEndurance({
      currentPressure: 200,
      reservePressure: 0,
      tankVolume: 12,
      depth: 0,
      sacRate: 20,
    });
    expect(result.ambientPressure).toBeCloseTo(1, 5);
    // enduranceMin = (200 * 12) / (20 * 1) = 120 min
    expect(result.enduranceMin).toBeCloseTo(120, 2);
  });
});
