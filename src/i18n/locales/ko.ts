export const ko = {
  // 탭
  tab_home: '홈',
  tab_blending: '블렌딩',
  tab_calculator: '계산기',
  tab_gas_info: '기체 분석',
  tab_gas_plan: '가스 계획',
  tab_deco: '감압 계획',
  tab_settings: '설정',

  // 공통
  save: '저장',
  reset: '초기화',
  calculate: '계산',
  cancel: '취소',
  confirm: '확인',
  warning: '경고',
  error: '오류',

  // 홈
  home_title: 'Gas Blender',
  home_card_oc_title: 'OC 블렌딩',
  home_card_oc_sub: 'Nitrox / Trimix 부분압 블렌딩',
  home_card_ccr_title: 'CCR 블렌딩',
  home_card_ccr_sub: 'Diluent + O₂ Setpoint',
  home_card_gas_plan_title: '가스 계획',
  home_card_gas_plan_sub: 'SAC · 가스량 · 실린더 계획',
  home_card_deco_title: '감압 계획',
  home_card_deco_sub: 'Bühlmann ZHL-16C + GF',
  home_card_calc_title: '기체 분석',
  home_card_calc_sub: 'MOD / EAD / END 빠른 계산',
  home_subtitle: 'Technical Diving Calculator',
  home_disclaimer: '⚠️ 계산 결과는 참고용입니다. 실제 다이빙은 자격을 갖춘 강사와 함께 계획하세요.',

  // 계산기
  calc_gas_settings: '기체 설정',
  calc_gas_subtitle: 'O₂, He 비율 입력',
  calc_mod: 'MOD (최대 운용 수심)',
  calc_mod_work: 'MOD (작업)',
  calc_mod_deco: 'MOD (감압)',
  calc_best_mix: 'Best Mix',
  calc_best_mix_subtitle: '목표 수심 기준 최적 O₂ 비율',
  calc_ead: 'EAD (등가 공기 수심)',
  calc_end: 'END (등가 나르코틱 수심)',
  calc_target_depth: '목표 수심',
  calc_ead_negative: '수심이 너무 얕아 EAD 계산 불가',
  calc_end_none: 'He 0% — END = 실제 수심과 동일',
  calc_n2_auto: 'N₂ (자동)',
  calc_sac: 'SAC Rate (표면 공기 소비율)',
  calc_sac_subtitle: '실제 소비량을 해수면 기준으로 환산',
  calc_sac_pressure_used: '사용 압력',
  calc_sac_tank_volume: '실린더 용량',
  calc_sac_avg_depth: '평균 수심',
  calc_sac_dive_time: '잠수 시간',
  calc_sac_result: 'SAC Rate',
  calc_sac_rmv: 'RMV (해당 수심)',
  calc_sac_gas_consumed: '총 소비량',
  calc_endurance: '가스 사용 가능 시간',
  calc_endurance_subtitle: '현재 실린더로 계획 수심에서 사용 가능한 시간',
  calc_endurance_current_pressure: '현재 실린더 압력',
  calc_endurance_reserve: '예비 압력',
  calc_endurance_depth: '계획 수심',
  calc_endurance_result: '잔여 사용 시간',
  calc_endurance_usable_gas: '사용 가능 기체량',
  calc_enter_o2: 'O₂ 비율을 입력하세요',
  calc_enter_gas: '기체 설정을 입력하세요',
  calc_check_input: '입력값을 확인하세요',
  calc_err_reserve: '예비 압력 부족',

  // 블렌딩
  blend_oc: 'OC (개방회로)',
  blend_ccr: 'CCR (폐쇄회로)',
  blend_current_tank: '현재 실린더',
  blend_target_mix: '목표 혼합기체',
  blend_calc: '블렌딩 계산',
  blend_result: '계산 결과',
  blend_diluent: 'Diluent 기체',
  blend_diluent_subtitle: 'CCR 희석 기체 설정',
  blend_setpoint: 'Setpoint 설정',
  blend_setpoint_hint: '일반적으로 1.0~1.3 bar',
  blend_max_depth: '계획 최대 수심',
  blend_ccr_calc: 'CCR 계산',
  blend_max_setpoint_depth: 'Setpoint 유지 최대 수심',
  blend_actual_ppo2: '목표 수심 ppO₂',
  blend_err_target_pressure: '목표 압력은 현재 압력보다 높아야 합니다.',
  blend_err_gas_sum: 'O₂ + He 합이 100%를 초과할 수 없습니다.',
  blend_err_negative_topup: '공기 탑업 압력이 음수입니다. 실린더를 완전히 비운 후 다시 블렌딩하세요.',
  blend_result_empty: '계산 결과가 여기에 표시됩니다',
  blend_step_order: '주입 순서',
  blend_step_he: '① He 주입',
  blend_step_he_note: '헬륨 먼저 주입',
  blend_step_o2: '② O₂ 주입',
  blend_step_o2_note: '산소 다음 주입',
  blend_step_air: '③ Air 탑업',
  blend_step_air_note: '마지막으로 공기 채우기',
  blend_step_skip: '불필요',
  blend_result_mix_verify: '최종 혼합비 (검증)',
  blend_setpoint_label: 'ppO₂ Setpoint',
  blend_diluent_fo2_basis: 'Diluent fO₂ 기준',
  blend_warn_setpoint_exceeded: 'ppO₂ setpoint 초과',
  blend_err_setpoint_high: 'Setpoint이 감압 한계(1.6 bar)를 초과합니다.',
  blend_err_setpoint_low: 'Setpoint이 최소 ppO₂(0.16 bar) 미만입니다.',
  blend_err_diluent_hypoxic: 'Diluent 해수면 ppO₂({val} bar)가 최소 한계(0.16 bar) 미만 — 저산소증 위험.',
  blend_err_setpoint_exceeded_at_depth: '{depth}m에서 Diluent ppO₂({ppo2} bar)가 setpoint({sp} bar)를 초과합니다.',
  blend_err_depth_exceeds_mod: '목표 수심({depth}m)이 Diluent MOD({mod}m)를 초과합니다.',
  blend_oxygen_pct: 'O₂ %',
  blend_helium_pct: 'He %',

  // CCR 블렌딩 추가 결과
  blend_diluent_mod: 'Diluent MOD (ppO₂ 1.4)',
  blend_diluent_mod_subtitle: 'ppO₂ 1.4 bar 기준 최대 운용 수심',
  blend_hypoxic_limit: '저산소 한계 수심',
  blend_hypoxic_limit_subtitle: 'Diluent ppO₂ = 0.16 bar 수심 (음수=해수면 저산소)',
  blend_pn2_at_depth: '최대 수심 pN₂',
  blend_pn2_at_depth_subtitle: '질소 마취 참고값',
  blend_setpoint2_label: 'SP2 (상승용)',
  blend_setpoint2_hint: '상승 시 전환할 저수심 setpoint (예: 0.70)',
  blend_sp2_switch_depth: 'SP1→SP2 전환 수심',
  blend_sp2_switch_depth_subtitle: '이 수심 이상에서 SP2로 전환',
  blend_o2_consumption: 'O₂ 소비량 추정',
  blend_o2_consumption_subtitle: 'CCR VO₂ = 0.5 L/min 기준',
  blend_dive_time: '계획 다이빙 시간',
  blend_o2_tank_size: 'O₂ 실린더 수중 용량',
  blend_o2_consumed: '예상 O₂ 소비량',
  blend_o2_consumed_subtitle: '0.5 L/min × 다이빙 시간',
  blend_o2_pressure_drop: '예상 압력 강하',
  blend_o2_pressure_drop_subtitle: '소비량 ÷ 실린더 용량',

  // 감압 계획
  deco_profile: '다이브 프로파일',
  deco_target_depth: '목표 수심',
  deco_bottom_time: '바닥 시간 (런타임)',
  deco_bottom_mix: '바닥 기체 (Bottom Mix)',
  deco_deco_gases: '감압 기체 (Deco Gases)',
  deco_deco_gases_subtitle: '설정의 ppO₂ {limit} bar 기준으로 MOD 자동 계산',
  deco_cylinder: '실린더',
  deco_switch_depth: '전환 수심',
  deco_remove_gas: '삭제',
  deco_add_gas: '+ 감압 기체 추가',
  deco_gf: 'Gradient Factor (GF)',
  deco_gf_subtitle: '이 다이브에 적용할 GF를 선택하세요',
  deco_gf_mode_normal: '일반 계획',
  deco_gf_mode_bailout: 'Bailout',
  deco_gf_low: 'GF Low',
  deco_gf_high: 'GF High',
  deco_gf_normal_hint: '설정 탭 기본값과 독립적으로 이 다이브만 조정합니다',
  deco_gf_bailout_active_label: 'Bailout GF 적용 중',
  deco_gf_bailout_from_settings: '설정 탭에서 지정한 Bailout GF를 사용합니다.\n일반 OC 감압 계획이 아닌 비상 상승 시나리오용입니다.',
  deco_calc: '감압 계획 계산',
  deco_result: '감압 계획 결과',
  deco_table: '감압 정지 테이블',
  deco_no_deco: '감압 불필요 (NDL 이내)',
  deco_no_deco_sub: '직접 상승 가능합니다.',
  deco_col_depth: '수심',
  deco_col_stop: '정지',
  deco_col_gas: '믹스',
  deco_col_runtime: '런타임',
  deco_at_depth_val: '수심 체류 {min}min',
  deco_tts: 'TTS',
  deco_tts_sub: '분 (Time to Surface)',
  deco_total_deco: '총 감압',
  deco_otu_units: 'units',
  deco_disclaimer: '⚠️ 계산 결과는 참고용입니다. 실제 다이빙은 자격을 갖춘 전문가와 함께 계획하세요.',
  deco_err_depth: '유효한 수심을 입력하세요.',
  deco_err_bottom_time: '유효한 바닥 시간을 입력하세요.',
  deco_err_bottom_time_short: '바닥 시간이 하강 시간({desc}min)보다 짧습니다.',
  deco_bottom_time_hint: '하강 포함 총 런타임 · 수심 체류 = 바닥시간 − 하강 {desc}min',
  deco_err_gf: 'GF Low는 GF High보다 낮아야 합니다.',
  deco_err_input: '입력값을 확인하세요.',
  deco_warn_cns_suffix: '— 산소 독성 위험 수준',
  deco_warn_otu_suffix: '— 일일 한계(300 OTU) 초과',
  deco_ascent_label: '상승',
  deco_last_stop: '마지막 정지 수심',
  deco_rmv: 'RMV 설정',
  deco_rmv_subtitle: '가스 소비량 자동 계산 (미입력 시 생략)',
  deco_rmv_bottom: '바닥 RMV',
  deco_rmv_deco: '감압 RMV',
  deco_gas_consumption: '기체별 예상 소비량',
  deco_icd_warning: '⚠ ICD 경고',
  deco_icd_detail: '{depth}m 전환: N₂ {prev}% → {next}% (역방향 증가)',
  deco_icd_note: '역방향 가스 전환은 불활성 기체 불균형(ICD)을 유발할 수 있습니다.',
  deco_hypoxic_warning: '⚠ 저산소 기체 경고',
  deco_hypoxic_detail: '{gas} ({depth}m에서 ppO₂ {ppo2} bar) — 최소 한계 0.16 bar 미만',
  deco_hypoxic_note: '해당 수심에서 저산소증 위험. 기체 조성 또는 전환 수심을 조정하세요.',
  deco_bailout_mode: 'Bailout 모드',
  deco_bailout_active: 'Bailout GF {lo}/{hi} 적용 중',

  // 설정
  settings_ppo2: 'ppO₂ 한계',
  settings_ppo2_subtitle: '산소 독성 기준 압력',
  settings_ppo2_work: '작업 한계',
  settings_ppo2_work_hint: '권장: 1.4 bar (작업 다이빙 중)',
  settings_ppo2_deco: '감압 한계',
  settings_ppo2_deco_hint: '권장: 1.6 bar (감압 정지 중)',
  settings_gf: 'Gradient Factor',
  settings_gf_subtitle: '감압 보수성 설정',
  settings_gf_bailout: 'Bailout GF',
  settings_gf_bailout_subtitle: 'CCR Bailout 시 사용할 Gradient Factor',
  settings_gf_bailout_hint: 'GUE 권장: GF 30/90',
  settings_units: '단위',
  settings_depth: '수심',
  settings_pressure: '압력',
  settings_rates: '상승 / 하강 속도',
  settings_ascent: '상승 속도',
  settings_ascent_hint: '권장: 9 m/min',
  settings_descent: '하강 속도',
  settings_descent_hint: '권장: 20 m/min',
  settings_air_composition: '공기 조성 기준',
  settings_air_composition_subtitle: '블렌딩·EAD·감압 계산에 적용',
  settings_air_precise: '정밀\n(O₂ 20.9% / N₂ 78.1%)',
  settings_air_approx: '계산용\n(O₂ 21% / N₂ 79%)',
  settings_appearance: '화면',
  settings_language: '언어',
  settings_theme: '테마',
  settings_theme_system: '시스템',
  settings_theme_light: '라이트',
  settings_theme_dark: '다크',
  settings_disclaimer: '⚠️ 이 앱의 계산 결과는 참고용입니다. 실제 다이빙 계획은 반드시 자격을 갖춘 강사와 함께 수립하세요.',
  settings_feedback: '🐛 버그 신고 및 건의사항',
  settings_err_ppo2_work_range: 'ppO₂ 작업 한계는 0.16~2.0 범위여야 합니다.',
  settings_err_ppo2_deco_range: 'ppO₂ 감압 한계는 0.16~2.0 범위여야 합니다.',
  settings_err_ppo2_order: 'ppO₂ 작업 한계는 감압 한계보다 낮아야 합니다.',
  settings_err_ascent_rate: '상승 속도는 양수여야 합니다.',
  settings_err_descent_rate: '하강 속도는 양수여야 합니다.',
  settings_save_done: '저장 완료',
  settings_reset_confirm: '모든 설정을 기본값으로 되돌리겠습니까?',
  settings_warn_ppo2_work: '⚠ 작업 한계 1.4 bar 초과',
  settings_warn_ppo2_deco: '⚠ 감압 한계 1.6 bar 초과',
  settings_gf_conservative: '보수적',
  settings_gf_aggressive: '공격적',
  settings_gf_moderate: '중간',
  settings_depth_m: '미터 (m)',
  settings_depth_ft: '피트 (ft)',

  // 가스 계획
  gplan_avg_depth_suffix: '평균 수심 기준',
  gplan_cylinders: '실린더 계획',
  gplan_cylinders_subtitle: '실린더별 가스 사용 가능 시간 계산',
  gplan_depth: '계획 수심',
  gplan_add_cylinder: '+ 실린더 추가',
  gplan_cylinder_label: '실린더',
  gplan_volume: '용량 (L)',
  gplan_start_pressure: '시작 압력',
  gplan_reserve: '예비 압력',
  gplan_usable_gas: '사용 가능 기체량',
  gplan_time: '예상 사용 시간',

  // 다이빙 세션
  session_title: '다이빙 세션',
  session_subtitle: '연속 다이빙 OTU · CNS% 누적 추적',
  session_empty: '"세션에 추가"를 탭하면 이 다이빙이 세션에 기록됩니다',
  session_add: '이 다이빙을 세션에 추가',
  session_clear: '세션 초기화',
  session_clear_confirm: '모든 다이빙 기록을 삭제하시겠습니까?',
  session_surface_interval: '수면 휴식',
  session_dive_n: '다이빙 {n}',
  session_cumulative: '세션 누적',
  session_this_dive: '이번',
  session_prev: '이전',
  session_total: '합계',
  session_total_cns: 'CNS% (회복 반영)',
  session_remove: '삭제',
  session_status_banner: '세션 누적 — OTU {otu} · CNS {cns}% ({count}회)',
  session_otu_pct: '하루 OTU 한도({limit})의 {pct}%',
  session_otu_warning: '⚠ OTU {otu} — 하루 한도 {pct}% 달성',

  // 인포 모달
  info_close: '닫기',

  info_blending_title: '블렌딩 계산 안내',
  info_blending_content:
    '◆ 이 탭에서 할 수 있는 것\n\n' +
    '현재 실린더 압력과 목표 혼합비를 입력하면 헬륨·산소·공기를 얼마나 주입해야 하는지 계산합니다. OC(개방회로)와 CCR(폐쇄회로 리브리더) 두 모드를 지원합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ OC 부분압 블렌딩\n\n' +
    '헬륨 → 산소 → 공기 순서로 주입해 목표 혼합기체를 만듭니다. 각 기체를 얼마나 더 넣어야 하는지를 목표 압력과 현재 압력의 차이로 계산하며, 마지막 공기 탑업 시 공기 속 O₂ 비율까지 자동 보정합니다.\n\n' +
    '주입 순서가 중요한 이유: 헬륨을 먼저 넣으면 혼합 열이 분산되고, 산소를 중간에 넣어 농도를 희석한 뒤 공기로 최종 조정해 산소 위험을 최소화합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ CCR — Setpoint와 Diluent\n\n' +
    'CCR은 Diluent(희석 기체)와 순산소를 자동 혼합해 목표 O₂ 분압(Setpoint)을 일정하게 유지합니다. 여기서는 Diluent 혼합비와 Setpoint를 기준으로 5가지 안전 지표를 계산합니다.\n\n' +
    '① Diluent MOD: Diluent 자체의 O₂ 분압이 1.4 bar를 초과하는 수심. 계획 수심은 이 값보다 얕아야 합니다.\n\n' +
    '② 저산소 한계 수심: 수심이 얕아지면 Diluent ppO₂도 낮아집니다. 0.16 bar 아래로 떨어지면 블랙아웃 위험이 있어 이 수심보다 얕아지면 O₂ flush가 필요합니다.\n\n' +
    '③ 최대 수심 pN₂: 계획 수심에서의 질소 분압. 3.2 bar 초과 시 공기 40m와 같은 나르코시스 효과가 나타납니다. Trimix를 사용하는 핵심 이유입니다.\n\n' +
    '④ Dual Setpoint 전환 수심: 깊은 곳에선 높은 SP1(예: 1.3 bar)로 대사 효율을 높이고, 올라오면서 낮은 SP2(예: 0.7 bar)로 전환해 산소 독성을 줄입니다. 전환해야 하는 수심을 계산합니다.\n\n' +
    '⑤ O₂ 소비량 추정: CCR은 대사로 소비된 O₂를 자동 보충합니다. 표준 소비율 0.5 L/min 기준으로 다이빙 시간 동안의 총 O₂ 소비량과 실린더 압력 강하를 추정합니다.',

  info_calculator_title: '기체 분석 안내',
  info_calculator_content:
    '◆ 이 탭에서 할 수 있는 것\n\n' +
    '기체 혼합비와 수심을 입력하면 산소 독성·감압 계획에 필요한 핵심 지표를 즉시 확인할 수 있습니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ MOD (최대 운용 수심)\n\n' +
    '내 기체를 안전하게 쓸 수 있는 가장 깊은 수심입니다. O₂ 분압이 기준을 넘으면 산소 경련 위험이 있습니다.\n' +
    '• 작업 한도 1.4 bar — 바닥 구간 기준\n' +
    '• 감압 한도 1.6 bar — 감압 정지 구간 기준\n\n' +
    '활용: 계획 수심이 MOD보다 깊다면 그 기체는 해당 수심에서 사용할 수 없습니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ Best Mix (최적 혼합비)\n\n' +
    '목표 수심에서 ppO₂ work 한도에 딱 맞는 O₂ 비율을 역산합니다. 이 비율로 혼합하면 산소 독성 한계 내에서 가장 높은 O₂ 농도를 쓸 수 있어 감압 부담이 가장 적습니다.\n\n' +
    '활용: 수심을 먼저 정하고 "이 수심에 가장 좋은 나이트록스는 몇 %인가?"를 찾을 때 사용합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ EAD (등가 공기 수심)\n\n' +
    '나이트록스의 감압 이점을 수심으로 환산한 값입니다. EAD가 실제 수심보다 얕을수록 질소 흡수가 줄어 감압 부담이 그만큼 감소합니다.\n\n' +
    '예: 30m에서 EAN32 사용 시 EAD ≈ 26m → 공기로 26m 다이빙한 것과 같은 감압 부담.\n\n' +
    '──────────────────────\n\n' +
    '◆ END (등가 나르코틱 수심)\n\n' +
    '트라이믹스의 마취 효과를 수심으로 환산한 값입니다. 헬륨은 나르코시스를 일으키지 않으므로 헬륨 비율이 높을수록 END가 낮아집니다.\n\n' +
    '활용: END 40m 이하를 유지하면 공기 40m 수준의 마취 효과로 제한됩니다.\n' +
    '공식: END = (1 − fHe) × (수심 + 10) − 10',

  info_gasplan_title: '가스 계획 안내',
  info_gasplan_content:
    '◆ 이 탭에서 할 수 있는 것\n\n' +
    'SAC Rate(표면 공기 소비율)를 입력하면 실린더별 예상 사용 가능 시간을 계산합니다. 복수 실린더를 사용하는 테크니컬 다이빙의 가스 계획 도구입니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ SAC Rate (표면 공기 소비율)\n\n' +
    '수심과 관계없이 비교할 수 있는 다이버 개인의 호흡량 기준값입니다. 이전 다이빙의 기록(압력 변화·실린더 용량·수심·시간)으로 구합니다.\n\n' +
    '참고 범위: 초급 15–20 L/min · 일반 12–15 L/min · 숙련 10–12 L/min\n' +
    '공식: SAC = (ΔP × 실린더 용량) ÷ (ATA × 시간)\n\n' +
    '──────────────────────\n\n' +
    '◆ RMV (실제 분당 호흡량)\n\n' +
    '특정 수심에서 실제로 소비하는 분당 가스량입니다. 수심이 깊을수록 압력이 높아 같은 SAC라도 더 많은 가스를 소비합니다.\n\n' +
    'RMV = SAC × ATA  (ATA = 1 + 수심 ÷ 10)\n' +
    '예: SAC 12 L/min, 수심 30m(4 ATA) → RMV = 48 L/min\n\n' +
    '──────────────────────\n\n' +
    '◆ 가스 사용 가능 시간\n\n' +
    '현재 압력에서 예비 압력을 뺀 "실제 사용 가능한 가스"로 몇 분간 호흡할 수 있는지 계산합니다.\n\n' +
    '사용 가능 가스 = (현재 압력 − 예비 압력) × 실린더 용량 [L]\n' +
    '사용 가능 시간 = 사용 가능 가스 ÷ RMV [min]\n\n' +
    '활용: 실린더마다 수심과 예비 압력을 개별 설정할 수 있어, 스테이지 실린더나 감압 실린더의 계획도 가능합니다.',

  info_deco_title: '감압 계획 안내',
  info_deco_content:
    '◆ 이 탭에서 할 수 있는 것\n\n' +
    '수심·바닥 시간·기체·GF를 입력하면 Bühlmann ZHL-16C 알고리즘으로 감압 정지 테이블과 산소 독성 누적(CNS%·OTU)을 계산합니다. 복수 감압 기체 전환, 연속 다이빙 세션 추적도 지원합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ Bühlmann ZHL-16C 알고리즘\n\n' +
    '인체의 16개 조직(혈관·지방·뼈 등)이 각자 다른 속도로 질소를 흡수하고 방출하는 것을 시뮬레이션합니다. 너무 빨리 상승하면 조직 내 질소가 기포를 형성해 감압병이 발생합니다. 가장 부하가 큰 조직이 허용 한도를 넘지 않는 속도로 상승 속도와 정지 수심을 결정합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ Gradient Factor (GF)\n\n' +
    '감압의 보수성을 조절하는 두 값입니다. 낮을수록 보수적(감압 정지 길어짐), 높을수록 공격적(짧아짐).\n' +
    '• GF Low: 첫 감압 정지 수심 결정. 낮을수록 더 깊은 곳에서 먼저 정지합니다.\n' +
    '• GF High: 수면 직전 마지막 정지 기준\n' +
    '• 참고: GUE 기본 30/85 · 보수적 20/70 · 공격적 80/100\n\n' +
    '탭 상단의 [일반 계획] / [⚠ Bailout] 버튼으로 모드를 전환합니다.\n' +
    'Bailout 모드는 CCR 비상 OC 전환 시 설정 탭의 Bailout GF를 적용합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ 감압 기체 (실린더 번호 표시)\n\n' +
    '감압 기체를 추가하면 "실린더 1, 2, 3..."처럼 번호가 붙습니다. 각 카드 하단에 전환 수심에서의 ppO₂와 N₂%가 자동 표시되므로 기체 전환 안전 여부를 바로 확인할 수 있습니다.\n\n' +
    'O₂ 농도가 높은 기체로 전환할수록 질소 방출 속도가 빨라져 감압 시간이 단축됩니다. 전환 수심은 ppO₂가 deco 한도(기본 1.6 bar)를 넘지 않는 가장 깊은 수심으로 설정하세요.\n\n' +
    '──────────────────────\n\n' +
    '◆ ICD (역확산) 경고\n\n' +
    '기체 전환 시 질소 분압이 갑자기 높아지는 상황입니다. 트라이믹스에서 고농도 O₂ 감압 기체로 바꿀 때 발생하기 쉽습니다. fN₂ 차이가 0.5% 이상이면 경고를 표시합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ CNS% · OTU (산소 독성)\n\n' +
    '• CNS% — 중추신경 독성 누적. 80% 초과 시 경련 위험. 단일 다이빙 80% 이하 권장.\n' +
    '• OTU — 폐 산소 독성 누적. 300 초과 시 폐 기능 저하 위험. 일일 300 이하 권장.\n\n' +
    '──────────────────────\n\n' +
    '◆ 다이빙 세션 (연속 다이빙 OTU 관리)\n\n' +
    '계산 완료 후 "이 다이빙을 세션에 추가"를 탭하면 해당 다이빙의 OTU·CNS%가 세션에 기록됩니다. 다음 다이빙 계산 시 이전 누적 OTU와 회복된 CNS%가 자동으로 합산 표시됩니다.\n\n' +
    '• 다이빙 간 수면 휴식 시간을 설정하면 CNS%는 반감기 90분 기준으로 회복되어 반영됩니다.\n' +
    '• OTU는 수면 중 회복 없이 하루 종일 누적됩니다. 300 초과 시 주의하세요.\n' +
    '• 세션 데이터는 앱 종료 후에도 저장되며, 세션 패널에서 초기화할 수 있습니다.',

  // 면책 조항
  disclaimer_title: '⚠️ 중요 안전 안내',
  disclaimer_body:
    'Gas Blender는 테크니컬 다이빙 계산을 보조하는 참고용 도구입니다.\n\n' +
    '• 이 앱의 계산 결과를 실제 다이빙 계획의 유일한 근거로 사용하지 마세요.\n' +
    '• 모든 다이빙 계획은 자격을 갖춘 강사 또는 다이브마스터와 함께 검토하세요.\n' +
    '• 가스 블렌딩은 반드시 훈련받은 전문가가 수행해야 합니다.\n' +
    '• 개발자는 이 앱 사용으로 인한 결과에 책임을 지지 않습니다.',
  disclaimer_agree: '동의하고 계속하기',
};
