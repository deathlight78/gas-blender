import { planDeco } from '../../src/lib/deco/deco-planner';
import { interpolateGF, roundUpToStop } from '../../src/lib/deco/gradient-factor';
import { cnsPerMinute, otuPerMinute } from '../../src/lib/deco/oxygen-toxicity';
import { DecoInput } from '../../src/types/deco.types';

const AIR: { fO2: number; fHe: number; fN2: number } = { fO2: 0.21, fHe: 0, fN2: 0.79 };
const EAN50: { fO2: number; fHe: number; fN2: number } = { fO2: 0.5, fHe: 0, fN2: 0.5 };

describe('Gradient Factor', () => {
  test('deepestStop 30m, 현재 30m → gfLow', () => {
    expect(interpolateGF(30, 30, 0.3, 0.8)).toBeCloseTo(0.3, 5);
  });
  test('deepestStop 30m, 현재 0m → gfHigh', () => {
    expect(interpolateGF(0, 30, 0.3, 0.8)).toBeCloseTo(0.8, 5);
  });
  test('중간 수심 보간', () => {
    expect(interpolateGF(15, 30, 0.3, 0.8)).toBeCloseTo(0.55, 5);
  });
  test('roundUpToStop', () => {
    expect(roundUpToStop(7)).toBe(9);
    expect(roundUpToStop(9)).toBe(9);
    expect(roundUpToStop(0)).toBe(0);
    expect(roundUpToStop(3)).toBe(3);
  });
});

describe('Oxygen Toxicity', () => {
  test('ppO2 0.4 → CNS 0%/min', () => {
    expect(cnsPerMinute(0.4)).toBe(0);
  });
  test('ppO2 1.4 → CNS 1/180 per min', () => {
    expect(cnsPerMinute(1.4)).toBeCloseTo(1 / 180 * 100, 5);
  });
  test('ppO2 0.4 → OTU 0', () => {
    expect(otuPerMinute(0.4)).toBe(0);
  });
  test('ppO2 1.0 → OTU > 0', () => {
    expect(otuPerMinute(1.0)).toBeGreaterThan(0);
  });
});

describe('Deco Planner', () => {
  function makeSquareProfile(
    depthM: number,
    bottomMin: number,
    gas = AIR
  ): DecoInput {
    return {
      segments: [
        { type: 'descent', startDepth: 0, endDepth: depthM, time: depthM / 20, gas },
        { type: 'bottom', startDepth: depthM, endDepth: depthM, time: bottomMin, gas },
      ],
      decoGases: [{ switchDepth: 6, mix: EAN50 }],
      gfLow: 0.3,
      gfHigh: 0.85,
      ascentRate: 9,
      descentRate: 20,
    };
  }

  test('매우 얕은 다이빙 (12m/10min air, GF 85/85) — 감압 없음', () => {
    const result = planDeco({
      ...makeSquareProfile(12, 10),
      gfLow: 0.85,
      gfHigh: 0.85,
    });
    expect(result.stops).toHaveLength(0);
    expect(result.totalDecoTime).toBe(0);
  });

  test('깊은 다이빙 (40m/30min air) — 감압 정지 존재', () => {
    const result = planDeco(makeSquareProfile(40, 30));
    expect(result.stops.length).toBeGreaterThan(0);
    expect(result.totalDecoTime).toBeGreaterThan(0);
  });

  test('40m/30min air — TTS > 0', () => {
    const result = planDeco(makeSquareProfile(40, 30));
    expect(result.tts).toBeGreaterThan(0);
  });

  test('40m/30min air — CNS% > 0', () => {
    const result = planDeco(makeSquareProfile(40, 30));
    expect(result.maxCns).toBeGreaterThan(0);
  });

  test('감압 정지는 얕은 순서로 정렬됨', () => {
    const result = planDeco(makeSquareProfile(40, 30));
    for (let i = 1; i < result.stops.length; i++) {
      expect(result.stops[i].depth).toBeLessThan(result.stops[i - 1].depth);
    }
  });

  test('GF 보수적으로 설정 시 감압 시간 더 길어짐', () => {
    const conservative = planDeco({
      ...makeSquareProfile(40, 30),
      gfLow: 0.2,
      gfHigh: 0.7,
    });
    const aggressive = planDeco({
      ...makeSquareProfile(40, 30),
      gfLow: 0.7,
      gfHigh: 0.85,
    });
    expect(conservative.totalDecoTime).toBeGreaterThan(aggressive.totalDecoTime);
  });
});
