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
    warnings.push('blend_err_setpoint_high');
  }
  if (setpoint < MIN_PPO2) {
    warnings.push('blend_err_setpoint_low');
  }

  // Diluent 해수면 O₂ 검증 — 저산소증 위험
  const ppO2Surface = diluentMix.fO2 * SURFACE_PRESSURE;
  if (ppO2Surface < MIN_PPO2) {
    warnings.push(`blend_err_diluent_hypoxic|${ppO2Surface.toFixed(2)}`);
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
      `blend_err_setpoint_exceeded_at_depth|${maxDepth}|${actualPpO2AtDepth.toFixed(2)}|${setpoint}`
    );
  }

  // Diluent MOD 검증 (ppO₂ 1.4 기준)
  if (diluentMix.fO2 > 0) {
    const diluentMod = mod(diluentMix.fO2, 1.4);
    if (maxDepth > diluentMod) {
      warnings.push(`blend_err_depth_exceeds_mod|${maxDepth}|${diluentMod.toFixed(0)}`);
    }
  }

  return {
    maxSetpointDepth: Math.max(0, maxSetpointDepth),
    actualPpO2AtDepth,
    warnings,
  };
}
