import { CCRBlendInput, CCRBlendResult } from '../../types/blending.types';
import { partialPressure } from '../gas/partial-pressure';
import { mod } from '../gas/mod';
import { MIN_PPO2, SURFACE_PRESSURE } from '../gas/constants';

/**
 * CCR 블렌딩 계산
 *
 * Diluent 기체와 O₂ setpoint를 기준으로:
 * - Setpoint 유지 가능 최대 수심
 * - 입력 수심에서의 실제 ppO₂
 * - 경고 조건 평가
 */
export function calcCCRBlend(input: CCRBlendInput): CCRBlendResult {
  const { diluentMix, setpoint, maxDepth } = input;
  const warnings: string[] = [];

  // Setpoint 한계 검증
  if (setpoint > 1.6) {
    warnings.push('Setpoint이 감압 한계(1.6 bar)를 초과합니다.');
  }
  if (setpoint < MIN_PPO2) {
    warnings.push('Setpoint이 최소 ppO₂(0.16 bar) 미만입니다.');
  }

  // Diluent 해수면 O₂ 검증 — 저산소증 위험
  const ppO2Surface = diluentMix.fO2 * SURFACE_PRESSURE;
  if (ppO2Surface < MIN_PPO2) {
    warnings.push(
      `Diluent의 해수면 ppO₂(${ppO2Surface.toFixed(2)} bar)가 최소 한계(0.16 bar) 미만 — 저산소증 위험.`
    );
  }

  // Setpoint 유지 가능 최대 수심
  // ppO2 = fO2_diluent * P_abs → P_abs = setpoint / fO2_diluent
  // depth = (P_abs - 1) * 10
  const maxSetpointDepth =
    diluentMix.fO2 > 0
      ? (setpoint / diluentMix.fO2 - SURFACE_PRESSURE) * 10
      : 0;

  // 입력 수심에서의 Diluent ppO₂
  const actualPpO2AtDepth = partialPressure(diluentMix.fO2, maxDepth);

  // 목표 수심에서 ppO₂ 초과 검증
  if (actualPpO2AtDepth > setpoint * 1.05) {
    warnings.push(
      `${maxDepth}m에서 Diluent ppO₂(${actualPpO2AtDepth.toFixed(2)} bar)가 setpoint(${setpoint} bar)를 초과합니다.`
    );
  }

  // Diluent MOD 검증 (ppO₂ 1.4 기준)
  if (diluentMix.fO2 > 0) {
    const diluentMod = mod(diluentMix.fO2, 1.4);
    if (maxDepth > diluentMod) {
      warnings.push(
        `목표 수심(${maxDepth}m)이 Diluent MOD(${diluentMod.toFixed(0)}m)를 초과합니다.`
      );
    }
  }

  return {
    maxSetpointDepth: Math.max(0, maxSetpointDepth),
    actualPpO2AtDepth,
    warnings,
  };
}
