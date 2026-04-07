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
  const { diluentMix, setpoint, setpoint2, maxDepth, diveTimeMin, o2TankSizeL } = input;
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

  // CCR-1: Diluent MOD (ppO₂ 1.4 기준)
  const diluentMod = diluentMix.fO2 > 0 ? mod(diluentMix.fO2, 1.4) : 0;
  if (diluentMix.fO2 > 0 && maxDepth > diluentMod) {
    warnings.push(`blend_err_depth_exceeds_mod|${maxDepth}|${diluentMod.toFixed(0)}`);
  }

  // CCR-2: 저산소 한계 수심 — Diluent ppO₂ = MIN_PPO2 가 되는 수심
  // depth = (MIN_PPO2 / fO2 - 1) * 10  (음수이면 해수면에서도 저산소)
  const hypoxicLimitDepth = diluentMix.fO2 > 0
    ? (MIN_PPO2 / diluentMix.fO2 - SURFACE_PRESSURE) * 10
    : 0;

  // CCR-3: 최대 수심에서의 pN₂
  const pN2AtDepth = diluentMix.fN2 * (maxDepth / 10 + SURFACE_PRESSURE);

  // CCR-4: SP2 기준 전환 수심 (상승 시 SP1 → SP2 전환)
  // SP2 = fO2_dil × P_abs → P_abs = SP2 / fO2_dil → depth = (P_abs - 1) × 10
  const sp2SwitchDepth = setpoint2 !== undefined && diluentMix.fO2 > 0
    ? Math.max(0, (setpoint2 / diluentMix.fO2 - SURFACE_PRESSURE) * 10)
    : undefined;

  // CCR-5: O₂ 소비량 (VO₂ = 0.5 L/min)
  const VO2 = 0.5;
  const o2ConsumedL = diveTimeMin !== undefined ? VO2 * diveTimeMin : undefined;
  const o2PressureDrop = o2ConsumedL !== undefined && o2TankSizeL && o2TankSizeL > 0
    ? o2ConsumedL / o2TankSizeL
    : undefined;

  return {
    maxSetpointDepth: Math.max(0, maxSetpointDepth),
    actualPpO2AtDepth,
    diluentMod,
    hypoxicLimitDepth,
    pN2AtDepth,
    sp2SwitchDepth,
    o2ConsumedL,
    o2PressureDrop,
    warnings,
  };
}
