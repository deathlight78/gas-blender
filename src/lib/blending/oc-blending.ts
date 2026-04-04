import { GasMix } from '../../types/gas.types';
import { OCBlendInput, OCBlendResult } from '../../types/blending.types';

/**
 * OC 부분압 블렌딩 계산 (Top-up 방식)
 *
 * 주입 순서: He → O₂ → Air(또는 Top 기체)
 * 각 단계에서 누적 압력을 계산하여 최종 혼합비 달성.
 */
export function calcOCBlend(input: OCBlendInput): OCBlendResult {
  const { currentPressure, currentMix, targetPressure, targetMix } = input;
  const warnings: string[] = [];

  if (targetPressure <= currentPressure) {
    warnings.push('Target pressure must be greater than current pressure.');
  }

  // 현재 탱크 기체 절대량 (bar)
  const currentO2 = currentMix.fO2 * currentPressure;
  const currentHe = currentMix.fHe * currentPressure;

  // He는 순수 헬륨으로 주입 — 목표 He 절대량에서 현재 He를 뺀 만큼
  const addHePressure = Math.max(0, targetMix.fHe * targetPressure - currentHe);

  // O₂ 주입량 계산: 탑업 기체(Air)의 O₂ 기여분을 고려
  // 공식: addO2 = (fO2_target * P_final - fO2_current * P_current - AIR_O2 * (P_final - P_current - addHe)) / (1 - AIR_O2)
  const airTopBase = targetPressure - currentPressure - addHePressure;
  const neededExtraO2 =
    targetMix.fO2 * targetPressure - currentO2 - 0.209 * airTopBase;
  const addO2Pressure = Math.max(0, neededExtraO2 / (1 - 0.209));

  // 나머지는 Air로 채움
  const addTopPressure = targetPressure - currentPressure - addHePressure - addO2Pressure;

  if (addTopPressure < -0.1) {
    warnings.push(
      'Calculation results in negative top-up pressure. Check mix ratios or consider a full drain.'
    );
  }

  // 최종 혼합비 검증
  const totalO2 = currentO2 + addO2Pressure + 0.209 * Math.max(0, addTopPressure);
  const totalHe = currentHe + addHePressure;
  const resultFO2 = totalO2 / targetPressure;
  const resultFHe = totalHe / targetPressure;

  return {
    addHePressure,
    addO2Pressure,
    addTopPressure: Math.max(0, addTopPressure),
    topGas: 'air',
    resultMix: {
      fO2: resultFO2,
      fHe: resultFHe,
      fN2: 1 - resultFO2 - resultFHe,
    },
    warnings,
  };
}
