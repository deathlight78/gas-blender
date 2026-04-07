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
  deco_bottom_time: '바닥 시간',
  deco_bottom_mix: '바닥 기체 (Bottom Mix)',
  deco_deco_gases: '감압 기체 (Deco Gases)',
  deco_deco_gases_subtitle: '전환 수심 이하에서 사용',
  deco_switch_depth: '전환 수심',
  deco_add_gas: '+ 감압 기체 추가',
  deco_gf: 'Gradient Factor',
  deco_gf_subtitle: 'Settings 화면 기본값 오버라이드',
  deco_gf_low: 'GF Low',
  deco_gf_high: 'GF High',
  deco_calc: '감압 계획 계산',
  deco_result: '감압 계획 결과',
  deco_table: '감압 정지 테이블',
  deco_no_deco: '감압 불필요 (NDL 이내)',
  deco_no_deco_sub: '직접 상승 가능합니다.',
  deco_col_depth: '수심',
  deco_col_stop: '정지(분)',
  deco_col_gas: '기체',
  deco_col_runtime: '런타임',
  deco_tts: 'TTS',
  deco_tts_sub: '분 (Time to Surface)',
  deco_total_deco: '총 감압',
  deco_otu_units: 'units',
  deco_disclaimer: '⚠️ 계산 결과는 참고용입니다. 실제 다이빙은 자격을 갖춘 전문가와 함께 계획하세요.',
  deco_err_depth: '유효한 수심을 입력하세요.',
  deco_err_bottom_time: '유효한 바닥 시간을 입력하세요.',
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

  // 인포 모달
  info_close: '닫기',

  info_blending_title: '블렌딩 계산 안내',
  info_blending_content:
    '◆ OC 부분압 블렌딩\n\n' +
    '헬륨 → 산소 → 공기 순서로 주입해 목표 혼합기체를 만듭니다. ' +
    '각 기체를 얼마나 더 넣어야 하는지를 "목표 압력에서 현재 압력을 뺀 차이"로 계산하며, ' +
    '마지막 공기 탑업 시 공기 속 O₂ 비율까지 자동 보정합니다.\n\n' +
    '주입 순서가 중요한 이유: 헬륨을 먼저 넣으면 혼합 열이 분산되고, ' +
    '산소를 중간에 넣어 농도를 희석한 뒤 공기로 최종 조정합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ CCR — Setpoint와 Diluent\n\n' +
    'CCR(폐쇄회로 리브리더)은 Diluent(희석 기체)와 순산소를 자동 혼합해 ' +
    '목표 O₂ 분압(Setpoint)을 일정하게 유지합니다.\n\n' +
    '특정 수심에서 Diluent만으로의 O₂ 분압:\n' +
    '  → O₂ 분압 = Diluent O₂ 비율 × 절대압(ATA)\n' +
    '  → 절대압(ATA) = 1 + 수심 ÷ 10\n\n' +
    'Setpoint를 유지할 수 있는 최대 수심:\n' +
    '  → 최대 수심 = (Setpoint ÷ Diluent O₂ 비율 − 1) × 10\n\n' +
    '──────────────────────\n\n' +
    '◆ Diluent MOD (최대 운용 수심)\n\n' +
    'Diluent 자체의 O₂ 분압이 1.4 bar를 초과하는 수심부터는 산소 독성 위험이 생깁니다. ' +
    '이 수심이 Diluent MOD이며, 계획 수심은 반드시 이 값보다 얕아야 합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ 저산소 한계 수심\n\n' +
    '수심이 얕아질수록 Diluent O₂ 분압이 낮아집니다. ' +
    'O₂ 분압이 0.16 bar 아래로 떨어지면 저산소 블랙아웃 위험이 있습니다. ' +
    '이 수심(저산소 한계)보다 얕아지면 O₂ flush(순산소 주입)로 분압을 보충해야 합니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ 최대 수심 pN₂ (질소 분압)\n\n' +
    'Diluent 속 질소가 수심에서 얼마나 압축되는지 나타냅니다. ' +
    '질소 분압이 3.2 bar를 넘으면 공기 40m와 같은 마취 효과(나르코시스)가 생깁니다. ' +
    'Trimix를 사용하는 이유 중 하나입니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ Dual Setpoint (이중 Setpoint)\n\n' +
    '깊은 곳에서는 높은 Setpoint(SP1, 예: 1.3 bar)로 대사 효율을 높이고, ' +
    '얕은 곳으로 올라오면 낮은 Setpoint(SP2, 예: 0.7 bar)로 전환해 산소 독성 위험을 줄입니다. ' +
    'SP1→SP2로 전환해야 하는 수심은 Diluent ppO₂ = SP2가 되는 깊이입니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ O₂ 소비량 추정\n\n' +
    'CCR은 다이버의 대사로 소비된 O₂만큼 자동으로 보충합니다. ' +
    '안정 상태의 표준 소비율은 약 0.5 L/분이며, ' +
    '총 소비량 = 0.5 × 다이빙 시간(분)으로 계산합니다. ' +
    '실린더 수중 용량(L)으로 나누면 예상 압력 강하를 알 수 있어 O₂ 탱크 계획에 활용합니다.',

  info_calculator_title: '기체 분석 계산 안내',
  info_calculator_content:
    '◆ MOD (최대 운용 수심)\n\n' +
    '산소 분압이 허용 한도(작업 시 1.4 bar, 감압 시 1.6 bar)를 넘지 않는 가장 깊은 수심입니다. ' +
    'O₂ 비율이 높을수록 MOD는 얕아지고, 낮을수록 깊어집니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ Best Mix (최적 혼합비)\n\n' +
    '목표 수심에서 O₂ 분압이 정확히 작업 기준(ppO₂ work)이 되도록 역산한 O₂ 비율입니다. ' +
    '이 비율로 혼합하면 산소 독성 한계 내에서 가장 높은 O₂ 농도를 사용할 수 있습니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ EAD (등가 공기 수심)\n\n' +
    'Nitrox 기체를 사용할 때 감압 부담이 "공기로 다이빙한다면 몇 미터에 해당하는가"를 나타냅니다. ' +
    'EAD가 실제 수심보다 얕으면 질소 흡수가 적어 감압 부담이 줄어드는 효과가 있습니다.\n\n' +
    '──────────────────────\n\n' +
    '◆ END (등가 나르코틱 수심)\n\n' +
    'Trimix에서 헬륨을 넣으면 마취 효과가 줄어듭니다. ' +
    'END는 "이 혼합기체를 쓰면 공기로 몇 미터를 다이빙하는 것과 같은 마취 효과인가"를 나타냅니다. ' +
    '헬륨이 많을수록 END가 낮아져 깊은 수심에서도 맑은 정신을 유지할 수 있습니다.',

  info_gasplan_title: '가스 계획 공식',
  info_gasplan_content:
    '[ SAC Rate (표면 공기 소비율) ]\n\n' +
    '  SAC = (P_used × V) / (ATA × T)  [L/min]\n' +
    '  ATA = 1 + depth / 10\n\n' +
    '─────────────────────────\n' +
    '[ RMV (실제 분당 호흡량) ]\n\n' +
    '  RMV = SAC × ATA  [L/min]\n\n' +
    '─────────────────────────\n' +
    '[ 가스 총 소비량 ]\n\n' +
    '  gas_L = P × V  [L]\n\n' +
    '─────────────────────────\n' +
    '[ 가스 사용 가능 시간 ]\n\n' +
    '  T = usable_gas / RMV  [min]\n' +
    '  usable_gas = (P_cur − P_reserve) × V  [L]',

  info_deco_title: '감압 계획 알고리즘',
  info_deco_content:
    '[ Bühlmann ZHL-16C ]\n\n' +
    '  16개 조직 구획, 반감기 4 ~ 635 min\n\n' +
    '─────────────────────────\n' +
    '[ Schreiner 방정식 (조직 포화) ]\n\n' +
    '  P_t = P_alv + (P₀ − P_alv) × e^(−λ×t)\n' +
    '  λ = ln2 / t½\n' +
    '  P_alv = (P_amb − 0.0627) × fGas\n\n' +
    '─────────────────────────\n' +
    '[ GF Ceiling ]\n\n' +
    '  M-value: P_limit = a + P_t / b\n' +
    '  GF 보간: gf = GFlow + (GFhigh−GFlow)\n' +
    '           × (depth−firstStop) / firstStop\n' +
    '  Ceiling = (P_t − a×GF) / (GF/b − 1)\n\n' +
    '─────────────────────────\n' +
    '[ ICD (역확산) 경고 ]\n\n' +
    '  기체 전환 시 ΔfN₂ > 0.5% → 경고\n\n' +
    '─────────────────────────\n' +
    '[ CNS% (중추신경 독성) ]\n\n' +
    '  NOAA 표 기반 ppO₂별 허용 노출 시간\n' +
    '  CNS% = Σ (Δt / limit(ppO₂)) × 100\n\n' +
    '─────────────────────────\n' +
    '[ OTU (폐 산소 독성) ]\n\n' +
    '  OTU/min = ((ppO₂ − 0.5) / 0.5)^0.83\n' +
    '  (Repex 공식, ppO₂ > 0.5 bar 구간)',

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
