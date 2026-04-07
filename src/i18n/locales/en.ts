export const en = {
  // Tabs
  tab_home: 'Home',
  tab_blending: 'Blending',
  tab_calculator: 'Calculator',
  tab_gas_info: 'Gas Info',
  tab_gas_plan: 'Gas Plan',
  tab_deco: 'Deco Plan',
  tab_settings: 'Settings',

  // Common
  save: 'Save',
  reset: 'Reset',
  calculate: 'Calculate',
  cancel: 'Cancel',
  confirm: 'OK',
  warning: 'Warning',
  error: 'Error',

  // Home
  home_title: 'Gas Blender',
  home_subtitle: 'Technical Diving Calculator',
  home_disclaimer: '⚠️ For reference only. Always plan dives with a qualified instructor.',
  home_card_oc_title: 'OC Blending',
  home_card_oc_sub: 'Nitrox / Trimix partial pressure',
  home_card_ccr_title: 'CCR Blending',
  home_card_ccr_sub: 'Diluent + O₂ Setpoint',
  home_card_gas_plan_title: 'Gas Plan',
  home_card_gas_plan_sub: 'SAC · Gas Volume · Cylinder Plan',
  home_card_deco_title: 'Deco Plan',
  home_card_deco_sub: 'Bühlmann ZHL-16C + GF',
  home_card_calc_title: 'Gas Info',
  home_card_calc_sub: 'MOD / EAD / END Quick Calc',

  // Calculator
  calc_gas_settings: 'Gas Settings',
  calc_gas_subtitle: 'Enter O₂ and He fractions',
  calc_mod: 'MOD (Maximum Operating Depth)',
  calc_mod_work: 'MOD (Working)',
  calc_mod_deco: 'MOD (Deco)',
  calc_best_mix: 'Best Mix',
  calc_best_mix_subtitle: 'Optimal O₂ for target depth',
  calc_ead: 'EAD (Equivalent Air Depth)',
  calc_end: 'END (Equivalent Narcotic Depth)',
  calc_target_depth: 'Target Depth',
  calc_ead_negative: 'Depth too shallow for EAD calculation',
  calc_end_none: 'He 0% — END equals actual depth',
  calc_n2_auto: 'N₂ (auto)',
  calc_sac: 'SAC Rate (Surface Air Consumption)',
  calc_sac_subtitle: 'Convert actual consumption to surface equivalent',
  calc_sac_pressure_used: 'Pressure Used',
  calc_sac_tank_volume: 'Cylinder Volume',
  calc_sac_avg_depth: 'Avg Depth',
  calc_sac_dive_time: 'Dive Time',
  calc_sac_result: 'SAC Rate',
  calc_sac_rmv: 'RMV (at depth)',
  calc_sac_gas_consumed: 'Total Gas Used',
  calc_endurance: 'Gas Endurance',
  calc_endurance_subtitle: 'Available dive time at planned depth',
  calc_endurance_current_pressure: 'Current Cylinder Pressure',
  calc_endurance_reserve: 'Reserve Pressure',
  calc_endurance_depth: 'Planned Depth',
  calc_endurance_result: 'Available Time',
  calc_endurance_usable_gas: 'Usable Gas',
  calc_enter_o2: 'Enter O₂ fraction',
  calc_enter_gas: 'Enter gas settings',
  calc_check_input: 'Check input values',
  calc_err_reserve: 'Insufficient reserve pressure',

  // Blending
  blend_oc: 'OC (Open Circuit)',
  blend_ccr: 'CCR (Closed Circuit)',
  blend_current_tank: 'Current Tank',
  blend_target_mix: 'Target Mix',
  blend_calc: 'Calculate Blend',
  blend_result: 'Result',
  blend_diluent: 'Diluent Gas',
  blend_diluent_subtitle: 'CCR diluent gas settings',
  blend_setpoint: 'Setpoint',
  blend_setpoint_hint: 'Typically 1.0–1.3 bar',
  blend_max_depth: 'Planned Max Depth',
  blend_ccr_calc: 'Calculate CCR',
  blend_max_setpoint_depth: 'Max Setpoint Depth',
  blend_actual_ppo2: 'ppO₂ at Target Depth',
  blend_err_target_pressure: 'Target pressure must be greater than current pressure.',
  blend_err_gas_sum: 'O₂ + He cannot exceed 100%.',
  blend_err_negative_topup: 'Negative top-up pressure. Drain the tank completely before blending.',
  blend_result_empty: 'Results will appear here',
  blend_step_order: 'Injection Order',
  blend_step_he: '① He Injection',
  blend_step_he_note: 'Inject helium first',
  blend_step_o2: '② O₂ Injection',
  blend_step_o2_note: 'Inject oxygen next',
  blend_step_air: '③ Air Top-up',
  blend_step_air_note: 'Fill with air last',
  blend_step_skip: 'Not needed',
  blend_result_mix_verify: 'Final Mix (Verification)',
  blend_setpoint_label: 'ppO₂ Setpoint',
  blend_diluent_fo2_basis: 'Based on Diluent fO₂',
  blend_warn_setpoint_exceeded: 'ppO₂ exceeds setpoint',
  blend_err_setpoint_high: 'Setpoint exceeds deco limit (1.6 bar).',
  blend_err_setpoint_low: 'Setpoint is below minimum ppO₂ (0.16 bar).',
  blend_err_diluent_hypoxic: 'Diluent surface ppO₂ ({val} bar) below minimum (0.16 bar) — hypoxia risk.',
  blend_err_setpoint_exceeded_at_depth: 'At {depth}m, Diluent ppO₂ ({ppo2} bar) exceeds setpoint ({sp} bar).',
  blend_err_depth_exceeds_mod: 'Target depth ({depth}m) exceeds Diluent MOD ({mod}m).',
  blend_oxygen_pct: 'O₂ %',
  blend_helium_pct: 'He %',

  // CCR blending additional results
  blend_diluent_mod: 'Diluent MOD (ppO₂ 1.4)',
  blend_diluent_mod_subtitle: 'Max operating depth at ppO₂ 1.4 bar',
  blend_hypoxic_limit: 'Hypoxic Limit Depth',
  blend_hypoxic_limit_subtitle: 'Depth where Diluent ppO₂ = 0.16 bar (negative = hypoxic at surface)',
  blend_pn2_at_depth: 'pN₂ at Max Depth',
  blend_pn2_at_depth_subtitle: 'Narcosis reference',
  blend_setpoint2_label: 'SP2 (Ascent)',
  blend_setpoint2_hint: 'Low setpoint for ascent (e.g. 0.70)',
  blend_sp2_switch_depth: 'SP1→SP2 Switch Depth',
  blend_sp2_switch_depth_subtitle: 'Switch to SP2 at or above this depth',
  blend_o2_consumption: 'O₂ Consumption Estimate',
  blend_o2_consumption_subtitle: 'CCR VO₂ = 0.5 L/min',
  blend_dive_time: 'Planned Dive Time',
  blend_o2_tank_size: 'O₂ Cylinder Water Volume',
  blend_o2_consumed: 'Est. O₂ Consumed',
  blend_o2_consumed_subtitle: '0.5 L/min × dive time',
  blend_o2_pressure_drop: 'Est. Pressure Drop',
  blend_o2_pressure_drop_subtitle: 'Consumed ÷ cylinder volume',

  // Deco Planning
  deco_profile: 'Dive Profile',
  deco_target_depth: 'Target Depth',
  deco_bottom_time: 'Bottom Time',
  deco_bottom_mix: 'Bottom Mix',
  deco_deco_gases: 'Deco Gases',
  deco_deco_gases_subtitle: 'Used below switch depth',
  deco_switch_depth: 'Switch Depth',
  deco_add_gas: '+ Add Deco Gas',
  deco_gf: 'Gradient Factor',
  deco_gf_subtitle: 'Override Settings default',
  deco_gf_low: 'GF Low',
  deco_gf_high: 'GF High',
  deco_calc: 'Plan Decompression',
  deco_result: 'Deco Plan Result',
  deco_table: 'Deco Stop Table',
  deco_no_deco: 'No Decompression (within NDL)',
  deco_no_deco_sub: 'Direct ascent is safe.',
  deco_col_depth: 'Depth',
  deco_col_stop: 'Stop (min)',
  deco_col_gas: 'Gas',
  deco_col_runtime: 'Runtime',
  deco_tts: 'TTS',
  deco_tts_sub: 'min (Time to Surface)',
  deco_total_deco: 'Total Deco',
  deco_otu_units: 'units',
  deco_disclaimer: '⚠️ For reference only. Always plan dives with a qualified professional.',
  deco_err_depth: 'Enter a valid depth.',
  deco_err_bottom_time: 'Enter a valid bottom time.',
  deco_err_gf: 'GF Low must be lower than GF High.',
  deco_err_input: 'Check input values.',
  deco_warn_cns_suffix: '— oxygen toxicity risk',
  deco_warn_otu_suffix: '— daily limit (300 OTU) exceeded',
  deco_ascent_label: 'Asc',
  deco_last_stop: 'Last Stop Depth',
  deco_rmv: 'RMV Settings',
  deco_rmv_subtitle: 'Auto-calculates gas consumption (skip if not set)',
  deco_rmv_bottom: 'Bottom RMV',
  deco_rmv_deco: 'Deco RMV',
  deco_gas_consumption: 'Estimated Gas Consumption',
  deco_icd_warning: '⚠ ICD Warning',
  deco_icd_detail: '{depth}m switch: N₂ {prev}% → {next}% (reverse increase)',
  deco_icd_note: 'Reverse gas switch may cause Inert Composition Discrepancy (ICD).',
  deco_hypoxic_warning: '⚠ Hypoxic Gas Warning',
  deco_hypoxic_detail: '{gas} at {depth}m — ppO₂ {ppo2} bar (below 0.16 bar min)',
  deco_hypoxic_note: 'Hypoxia risk at this depth. Adjust gas mix or switch depth.',
  deco_bailout_mode: 'Bailout Mode',
  deco_bailout_active: 'Bailout GF {lo}/{hi} active',

  // Settings
  settings_ppo2: 'ppO₂ Limits',
  settings_ppo2_subtitle: 'Oxygen toxicity thresholds',
  settings_ppo2_work: 'Working Limit',
  settings_ppo2_work_hint: 'Recommended: 1.4 bar (working dive)',
  settings_ppo2_deco: 'Deco Limit',
  settings_ppo2_deco_hint: 'Recommended: 1.6 bar (deco stop)',
  settings_gf: 'Gradient Factor',
  settings_gf_subtitle: 'Decompression conservatism',
  settings_gf_bailout: 'Bailout GF',
  settings_gf_bailout_subtitle: 'Gradient Factor for CCR bailout',
  settings_gf_bailout_hint: 'GUE standard: GF 30/90',
  settings_units: 'Units',
  settings_depth: 'Depth',
  settings_pressure: 'Pressure',
  settings_rates: 'Ascent / Descent Rate',
  settings_ascent: 'Ascent Rate',
  settings_ascent_hint: 'Recommended: 9 m/min',
  settings_descent: 'Descent Rate',
  settings_descent_hint: 'Recommended: 20 m/min',
  settings_air_composition: 'Air Composition',
  settings_air_composition_subtitle: 'Applied to blending, EAD & deco calculations',
  settings_air_precise: 'Precise\n(O₂ 20.9% / N₂ 78.1%)',
  settings_air_approx: 'Approximate\n(O₂ 21% / N₂ 79%)',
  settings_appearance: 'Appearance',
  settings_language: 'Language',
  settings_theme: 'Theme',
  settings_theme_system: 'System',
  settings_theme_light: 'Light',
  settings_theme_dark: 'Dark',
  settings_disclaimer: '⚠️ Calculations are for reference only. Always plan with a qualified instructor.',
  settings_feedback: '🐛 Bug Report & Suggestions',
  settings_err_ppo2_work_range: 'ppO₂ working limit must be between 0.16 and 2.0.',
  settings_err_ppo2_deco_range: 'ppO₂ deco limit must be between 0.16 and 2.0.',
  settings_err_ppo2_order: 'Working ppO₂ must be lower than deco limit.',
  settings_err_ascent_rate: 'Ascent rate must be positive.',
  settings_err_descent_rate: 'Descent rate must be positive.',
  settings_save_done: 'Saved',
  settings_reset_confirm: 'Reset all settings to defaults?',
  settings_warn_ppo2_work: '⚠ Working limit exceeds 1.4 bar',
  settings_warn_ppo2_deco: '⚠ Deco limit exceeds 1.6 bar',
  settings_gf_conservative: 'Conservative',
  settings_gf_aggressive: 'Aggressive',
  settings_gf_moderate: 'Moderate',
  settings_depth_m: 'Meters (m)',
  settings_depth_ft: 'Feet (ft)',

  // Gas Plan
  gplan_avg_depth_suffix: 'avg depth basis',
  gplan_cylinders: 'Cylinder Plan',
  gplan_cylinders_subtitle: 'Usable gas & duration per cylinder',
  gplan_depth: 'Plan Depth',
  gplan_add_cylinder: '+ Add Cylinder',
  gplan_cylinder_label: 'Cylinder',
  gplan_volume: 'Volume (L)',
  gplan_start_pressure: 'Start Pressure',
  gplan_reserve: 'Reserve',
  gplan_usable_gas: 'Usable Gas',
  gplan_time: 'Est. Duration',

  // Info modal
  info_close: 'Close',

  info_blending_title: 'Blending Formulas',
  info_blending_content:
    '[ OC Partial Pressure Blending ]\n\n' +
    '▸ He fill pressure\n' +
    '  ΔP_He = P_target×fHe_target − P_cur×fHe_cur\n\n' +
    '▸ O₂ fill pressure\n' +
    '  ΔP_O₂ = P_target×fO₂_target − P_cur×fO₂_cur\n\n' +
    '▸ Air top-up (with O₂ correction)\n' +
    '  ΔP_air = P_target − P_cur − ΔP_He − ΔP_O₂\n' +
    '  ※ Corrects for O₂ fraction in air top-up\n\n' +
    '▸ Fill order: He → O₂ → Air\n\n' +
    '─────────────────────────\n' +
    '[ CCR Diluent Basics ]\n\n' +
    '▸ Diluent ppO₂ at depth\n' +
    '  ppO₂ = fO₂_dil × ATA\n' +
    '  ATA = 1 + depth / 10\n\n' +
    '▸ Max setpoint depth\n' +
    '  D_sp = (SP / fO₂_dil − 1) × 10  [m]\n\n' +
    '─────────────────────────\n' +
    '[ CCR-1: Diluent MOD ]\n\n' +
    '  D_mod = (1.4 / fO₂_dil − 1) × 10  [m]\n' +
    '  Max operating depth at ppO₂ = 1.4 bar\n\n' +
    '─────────────────────────\n' +
    '[ CCR-2: Hypoxic Limit Depth ]\n\n' +
    '  D_hyp = (0.16 / fO₂_dil − 1) × 10  [m]\n' +
    '  Depth where Diluent ppO₂ = 0.16 bar\n' +
    '  O₂ flush required above this depth\n\n' +
    '─────────────────────────\n' +
    '[ CCR-3: pN₂ at Max Depth ]\n\n' +
    '  pN₂ = fN₂_dil × ATA(maxDepth)  [bar]\n' +
    '  Narcosis ref: pN₂ > 3.2 bar ≈ air at 40m\n\n' +
    '─────────────────────────\n' +
    '[ CCR-4: Dual Setpoint Switch Depth ]\n\n' +
    '  SP1 = high setpoint (bottom, e.g. 1.3 bar)\n' +
    '  SP2 = low setpoint (ascent, e.g. 0.7 bar)\n' +
    '  SP1→SP2 switch depth:\n' +
    '  D_sw = (SP2 / fO₂_dil − 1) × 10  [m]\n' +
    '  Switch to SP2 at or above this depth\n\n' +
    '─────────────────────────\n' +
    '[ CCR-5: O₂ Consumption Estimate ]\n\n' +
    '  VO₂ = 0.5 L/min (metabolic standard)\n' +
    '  O₂_consumed = VO₂ × T  [L]\n' +
    '  Pressure drop = O₂_consumed / tank_vol  [bar]',

  info_calculator_title: 'Gas Info Formulas',
  info_calculator_content:
    '[ MOD (Maximum Operating Depth) ]\n\n' +
    '  D_mod = (ppO₂_limit / fO₂ − 1) × 10  [m]\n\n' +
    '─────────────────────────\n' +
    '[ Best Mix ]\n\n' +
    '  fO₂_best = ppO₂_work / ATA(depth)\n' +
    '  ATA = 1 + depth / 10\n\n' +
    '─────────────────────────\n' +
    '[ EAD (Equivalent Air Depth) ]\n\n' +
    '  D_ead = (fN₂ / fN₂_air × (D+10)) − 10  [m]\n' +
    '  ※ fN₂_air = 0.79 or 0.781 (settings)\n\n' +
    '─────────────────────────\n' +
    '[ END (Equivalent Narcotic Depth) ]\n\n' +
    '  D_end = (1 − fHe) × (D+10) − 10  [m]\n' +
    '  ※ He assumed non-narcotic',

  info_gasplan_title: 'Gas Plan Formulas',
  info_gasplan_content:
    '[ SAC Rate (Surface Air Consumption) ]\n\n' +
    '  SAC = (P_used × V) / (ATA × T)  [L/min]\n' +
    '  ATA = 1 + depth / 10\n\n' +
    '─────────────────────────\n' +
    '[ RMV (Respiratory Minute Volume) ]\n\n' +
    '  RMV = SAC × ATA  [L/min]\n\n' +
    '─────────────────────────\n' +
    '[ Total Gas Consumed ]\n\n' +
    '  gas_L = P × V  [L]\n\n' +
    '─────────────────────────\n' +
    '[ Gas Endurance ]\n\n' +
    '  T = usable_gas / RMV  [min]\n' +
    '  usable_gas = (P_cur − P_reserve) × V  [L]',

  info_deco_title: 'Deco Algorithm',
  info_deco_content:
    '[ Bühlmann ZHL-16C ]\n\n' +
    '  16 tissue compartments, t½ 4–635 min\n\n' +
    '─────────────────────────\n' +
    '[ Schreiner Equation (tissue loading) ]\n\n' +
    '  P_t = P_alv + (P₀ − P_alv) × e^(−λ×t)\n' +
    '  λ = ln2 / t½\n' +
    '  P_alv = (P_amb − 0.0627) × fGas\n\n' +
    '─────────────────────────\n' +
    '[ GF Ceiling ]\n\n' +
    '  M-value: P_limit = a + P_t / b\n' +
    '  GF interpolation: gf = GFlow + (GFhigh−GFlow)\n' +
    '                    × (depth−firstStop) / firstStop\n' +
    '  Ceiling = (P_t − a×GF) / (GF/b − 1)\n\n' +
    '─────────────────────────\n' +
    '[ ICD (Isobaric Counter-Diffusion) ]\n\n' +
    '  ΔfN₂ > 0.5% on gas switch → warning\n\n' +
    '─────────────────────────\n' +
    '[ CNS% (CNS O₂ Toxicity) ]\n\n' +
    '  NOAA table limits per ppO₂\n' +
    '  CNS% = Σ (Δt / limit(ppO₂)) × 100\n\n' +
    '─────────────────────────\n' +
    '[ OTU (Pulmonary O₂ Toxicity) ]\n\n' +
    '  OTU/min = ((ppO₂ − 0.5) / 0.5)^0.83\n' +
    '  (Repex formula, ppO₂ > 0.5 bar)',

  // Disclaimer
  disclaimer_title: '⚠️ Important Safety Notice',
  disclaimer_body:
    'Gas Blender is a reference tool to assist technical diving calculations.\n\n' +
    '• Do not use this app as the sole basis for dive planning.\n' +
    '• All dive plans must be reviewed with a qualified instructor or divemaster.\n' +
    '• Gas blending must be performed by trained professionals only.\n' +
    '• The developer accepts no liability for any consequences of using this app.',
  disclaimer_agree: 'I Understand, Continue',
};
