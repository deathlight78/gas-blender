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
  deco_bottom_time: 'Bottom Time (Runtime)',
  deco_bottom_mix: 'Bottom Mix',
  deco_deco_gases: 'Deco Gases',
  deco_deco_gases_subtitle: 'MOD auto-computed at ppO₂ ≤ {limit} bar (set in Settings)',
  deco_cylinder: 'Cylinder',
  deco_switch_depth: 'Switch Depth',
  deco_remove_gas: 'Remove',
  deco_add_gas: '+ Add Deco Gas',
  deco_gf: 'Gradient Factor (GF)',
  deco_gf_subtitle: 'Choose the GF profile for this dive',
  deco_gf_mode_normal: 'Normal Plan',
  deco_gf_mode_bailout: 'Bailout',
  deco_gf_low: 'GF Low',
  deco_gf_high: 'GF High',
  deco_gf_normal_hint: 'Adjusts this dive independently from Settings defaults',
  deco_gf_bailout_active_label: 'Bailout GF Active',
  deco_gf_bailout_from_settings: 'Uses the Bailout GF configured in Settings.\nFor emergency ascent scenarios, not normal deco planning.',
  deco_calc: 'Plan Decompression',
  deco_result: 'Deco Plan Result',
  deco_table: 'Deco Stop Table',
  deco_no_deco: 'No Decompression (within NDL)',
  deco_no_deco_sub: 'Direct ascent is safe.',
  deco_col_depth: 'Depth',
  deco_col_stop: 'Stop',
  deco_col_gas: 'Mix',
  deco_col_runtime: 'Run',
  deco_at_depth_val: 'At depth {min} min',
  deco_tts: 'TTS',
  deco_tts_sub: 'min (Time to Surface)',
  deco_total_deco: 'Total Deco',
  deco_otu_units: 'units',
  deco_disclaimer: '⚠️ For reference only. Always plan dives with a qualified professional.',
  deco_err_depth: 'Enter a valid depth.',
  deco_err_bottom_time: 'Enter a valid bottom time.',
  deco_err_bottom_time_short: 'Bottom time must be longer than descent time ({desc} min).',
  deco_bottom_time_hint: 'Total runtime incl. descent · At depth = bottom time − {desc} min descent',
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

  // Dive session
  session_title: 'Dive Session',
  session_subtitle: 'Cumulative OTU · CNS% tracking across dives',
  session_empty: 'Tap "Add to Session" to record this dive',
  session_add: 'Add This Dive to Session',
  session_clear: 'Clear Session',
  session_clear_confirm: 'Delete all dive records from this session?',
  session_surface_interval: 'Surface Interval',
  session_dive_n: 'Dive {n}',
  session_cumulative: 'Session Totals',
  session_this_dive: 'This dive',
  session_prev: 'Previous',
  session_total: 'Total',
  session_total_cns: 'CNS% (with recovery)',
  session_remove: 'Remove',
  session_status_banner: 'Session — OTU {otu} · CNS {cns}% ({count} dives)',
  session_otu_pct: '{pct}% of daily OTU limit ({limit})',
  session_otu_warning: '⚠ OTU {otu} — {pct}% of daily limit reached',

  // Info modal
  info_close: 'Close',

  info_blending_title: 'Blending Guide',
  info_blending_content:
    '◆ What This Tab Does\n\n' +
    'Enter your current cylinder pressure and target mix to calculate exactly how much helium, oxygen, and air to add. Supports both OC (open-circuit) and CCR (closed-circuit rebreather) modes.\n\n' +
    '──────────────────────\n\n' +
    '◆ OC Partial Pressure Blending\n\n' +
    'Gases are added in order: He → O₂ → Air. Each step fills the pressure difference needed to reach the target mix, with automatic correction for the O₂ fraction already in the air top-up.\n\n' +
    'Why fill order matters: Helium first disperses blending heat. Oxygen in the middle is diluted before air is added, keeping O₂ concentration safe at the fill whip.\n\n' +
    '──────────────────────\n\n' +
    '◆ CCR — Setpoint & Diluent\n\n' +
    'A CCR automatically blends Diluent gas with pure O₂ to maintain a constant target O₂ partial pressure (Setpoint). Enter your Diluent mix and Setpoint to get five safety metrics:\n\n' +
    '① Diluent MOD: The deepest depth where the Diluent\'s own O₂ stays below 1.4 bar. Your planned depth must be shallower.\n\n' +
    '② Hypoxic Limit: As you ascend, Diluent ppO₂ drops. Below 0.16 bar, blackout risk rises — O₂ flush is required above this depth.\n\n' +
    '③ pN₂ at Max Depth: Nitrogen partial pressure at your planned depth. Above 3.2 bar equals the narcotic effect of air at 40m — the key reason for using Trimix.\n\n' +
    '④ Dual Setpoint Switch Depth: Use a high SP1 (e.g. 1.3 bar) on the bottom for metabolic efficiency, then switch to a lower SP2 (e.g. 0.7 bar) on ascent to reduce O₂ toxicity risk. This shows the depth to make that switch.\n\n' +
    '⑤ O₂ Consumption Estimate: A CCR replenishes only the O₂ metabolically consumed. Using the standard rate of 0.5 L/min, this estimates total O₂ used and the resulting pressure drop in your O₂ cylinder.',

  info_calculator_title: 'Gas Analysis Guide',
  info_calculator_content:
    '◆ What This Tab Does\n\n' +
    'Enter a gas mix and depth to instantly check the key metrics needed for oxygen toxicity management and decompression planning.\n\n' +
    '──────────────────────\n\n' +
    '◆ MOD (Maximum Operating Depth)\n\n' +
    'The deepest depth where your gas is safe to breathe. Exceeding the ppO₂ limit risks oxygen convulsions.\n' +
    '• Work limit 1.4 bar — bottom phase\n' +
    '• Deco limit 1.6 bar — decompression stops\n\n' +
    'How to use: If your planned depth is deeper than MOD, that gas cannot be used at that depth.\n\n' +
    '──────────────────────\n\n' +
    '◆ Best Mix\n\n' +
    'Calculates the ideal O₂ percentage for a target depth — the highest fraction that keeps ppO₂ exactly at the work limit. Higher O₂ means faster off-gassing and less decompression obligation.\n\n' +
    'How to use: Decide your depth first, then find the best Nitrox blend for it.\n\n' +
    '──────────────────────\n\n' +
    '◆ EAD (Equivalent Air Depth)\n\n' +
    'Converts the decompression benefit of Nitrox into a depth equivalent. The shallower the EAD relative to your actual depth, the less nitrogen you absorb.\n\n' +
    'Example: EAN32 at 30m → EAD ≈ 26m. Plan your deco tables as if diving air to 26m.\n\n' +
    '──────────────────────\n\n' +
    '◆ END (Equivalent Narcotic Depth)\n\n' +
    'Measures narcosis exposure for Trimix dives. Helium is considered non-narcotic, so higher He content means lower END and a clearer head at depth.\n\n' +
    'How to use: Keeping END below 40m limits narcosis to the equivalent of an air dive at 40m.\n' +
    'Formula: END = (1 − fHe) × (depth + 10) − 10',

  info_gasplan_title: 'Gas Planning Guide',
  info_gasplan_content:
    '◆ What This Tab Does\n\n' +
    'Enter your SAC Rate and cylinder details to calculate available gas time per cylinder. Essential for multi-cylinder technical diving gas planning.\n\n' +
    '──────────────────────\n\n' +
    '◆ SAC Rate (Surface Air Consumption)\n\n' +
    'Your personal breathing rate referenced to the surface, independent of depth. Measure it from a previous dive using pressure used, cylinder volume, depth, and time.\n\n' +
    'Typical ranges: Beginner 15–20 · Average 12–15 · Experienced 10–12 L/min\n' +
    'Formula: SAC = (ΔP × cylinder volume) ÷ (ATA × time)\n\n' +
    '──────────────────────\n\n' +
    '◆ RMV (Respiratory Minute Volume)\n\n' +
    'Your actual gas consumption per minute at a given depth. Pressure increases with depth, so the same SAC consumes more gas the deeper you go.\n\n' +
    'RMV = SAC × ATA  (ATA = 1 + depth ÷ 10)\n' +
    'Example: SAC 12 L/min at 30m (4 ATA) → RMV = 48 L/min\n\n' +
    '──────────────────────\n\n' +
    '◆ Gas Endurance\n\n' +
    'How long a cylinder will last, based on usable gas (current pressure minus reserve) divided by RMV.\n\n' +
    'Usable gas = (current pressure − reserve pressure) × cylinder volume [L]\n' +
    'Endurance = usable gas ÷ RMV [min]\n\n' +
    'How to use: Each cylinder can have its own depth and reserve settings — useful for planning stage or deco cylinder usage separately from your back gas.',

  info_deco_title: 'Deco Planning Guide',
  info_deco_content:
    '◆ What This Tab Does\n\n' +
    'Enter your depth, bottom time, gas, and GF settings. The app uses the Bühlmann ZHL-16C algorithm to generate a decompression stop table and calculate cumulative oxygen toxicity (CNS% and OTU). Multiple deco gas switches and multi-dive session tracking are supported.\n\n' +
    '──────────────────────\n\n' +
    '◆ Bühlmann ZHL-16C Algorithm\n\n' +
    'Simulates nitrogen absorption and release across 16 body tissue compartments (blood, fat, bone, etc.), each with a different half-time (5–635 min). Ascending too fast causes dissolved nitrogen to form bubbles — decompression sickness. The algorithm calculates the slowest allowable ascent rate and required stops so no tissue exceeds its safe limit.\n\n' +
    'Compartment coefficients use standard ZHL-16C values, verified against MultiDeco 2.26 binary analysis.\n\n' +
    'Stop exit rule: the diver ascends to the next stop as soon as the GF-ceiling drops to or below the current stop depth. Accelerated helium off-gassing on gas switch is credited immediately — no unnecessary hold time (same method as MultiDeco and Shearwater).\n\n' +
    '──────────────────────\n\n' +
    '◆ Gradient Factor (GF)\n\n' +
    'Two numbers that control how conservative the decompression model is. Lower = more conservative (longer stops), higher = more aggressive (shorter stops).\n' +
    '• GF Low: Sets the first deco stop criterion. The actual stop depth is found dynamically by simulating the ascent with off-gassing credit — the shallowest depth where the ceiling first meets or exceeds current depth. Lower values start stops deeper.\n' +
    '• GF High: Sets the ceiling limit at the last stop before surfacing.\n' +
    '• Reference: GUE default 30/85 · Conservative 20/70 · Aggressive 80/100\n\n' +
    'Use the [Normal Plan] / [⚠ Bailout] tabs at the top of the GF section to switch modes. Bailout mode applies the Bailout GF from Settings — intended for CCR emergency OC switch scenarios.\n\n' +
    '──────────────────────\n\n' +
    '◆ Deco Gases (Numbered Cylinders)\n\n' +
    'Added gases are numbered Cylinder 1, 2, 3... Each card shows the ppO₂ and N₂% at the switch depth so you can verify safety at a glance.\n\n' +
    'Switch depths are calculated automatically from the deco ppO₂ limit in Settings:\n' +
    'MOD = (ppO₂ limit ÷ fO₂ − 1) × 10, rounded down to 3 m steps\n' +
    'Example: EAN50, limit 1.4 bar → MOD = (1.4 ÷ 0.5 − 1) × 10 = 18 m\n\n' +
    'Higher-O₂ gases accelerate nitrogen off-gassing and shorten total deco time.\n\n' +
    '──────────────────────\n\n' +
    '◆ ICD (Isobaric Counter-Diffusion) Warning\n\n' +
    'When switching from a helium-rich gas to a high-O₂ deco gas, the N₂ partial pressure can suddenly rise — potentially causing bubbles even without ascending. Flagged when ΔfN₂ exceeds 0.5%.\n\n' +
    '──────────────────────\n\n' +
    '◆ CNS% & OTU (Oxygen Toxicity)\n\n' +
    '• CNS% — Central nervous system toxicity. Risk of convulsions above 80%. Keep below 80% per dive.\n' +
    '• OTU — Pulmonary oxygen toxicity units. Risk of lung damage above 300. Keep below 300 per day.\n\n' +
    '──────────────────────\n\n' +
    '◆ Dive Session (Multi-Dive OTU Tracking)\n\n' +
    'After calculating, tap "Add This Dive to Session" to log the dive\'s OTU and CNS%. On the next dive calculation, cumulative OTU and recovered CNS% are shown automatically.\n\n' +
    '• Set the surface interval between dives: CNS% recovers exponentially (half-life 90 min).\n' +
    '• OTU accumulates all day with no recovery. Watch the 300-unit daily limit.\n' +
    '• Session data persists after closing the app. Reset it from the session panel.',

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
