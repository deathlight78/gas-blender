import { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import GasSlider from '../src/components/ui/GasSlider';
import DrumRollPicker, { DRUM_PICKER_H } from '../src/components/ui/DrumRollPicker';
import ResultCard from '../src/components/ui/ResultCard';
import SectionHeader from '../src/components/ui/SectionHeader';
import { mod, bestMix } from '../src/lib/gas/mod';
import { ead, end } from '../src/lib/gas/ead-end';
import { calcSAC, calcGasEndurance } from '../src/lib/gas/sac-rate';
import { buildRange } from '../src/lib/utils/ranges';
import { useSettingsStore } from '../src/store/settings.store';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';

function toMeters(value: number, unit: 'ft' | 'm') {
  return unit === 'ft' ? value * 0.3048 : value;
}
function fromMeters(value: number, unit: 'ft' | 'm') {
  return unit === 'ft' ? value / 0.3048 : value;
}

export default function CalculatorScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { ppO2Work, ppO2Deco, depthUnit, airN2, pressureUnit } = useSettingsStore();
  const theme = useAppTheme();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [fO2, setFO2] = useState(0.21);
  const [fHe, setFHe] = useState(0);
  const [depth, setDepth] = useState(40);

  // SAC Rate inputs
  const [sacPressureUsed, setSacPressureUsed] = useState(100);
  const [sacTankVolume, setSacTankVolume] = useState(12);
  const [sacAvgDepth, setSacAvgDepth] = useState(20);
  const [sacDiveTime, setSacDiveTime] = useState(45);

  // Gas Endurance inputs
  const [endCurrentPressure, setEndCurrentPressure] = useState(200);
  const [endReserve, setEndReserve] = useState(50);
  const [endTankVolume, setEndTankVolume] = useState(12);
  const [endDepth, setEndDepth] = useState(30);
  const [endSacRate, setEndSacRate] = useState(20);

  const fN2 = Math.max(0, 1 - fO2 - fHe);
  const depthM = toMeters(depth, depthUnit);
  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';

  // 범위 배열 — depthUnit/pressureUnit 변경 시에만 재생성
  const depthItems = useMemo(
    () => depthUnit === 'ft' ? buildRange(0, 330, 3) : buildRange(0, 100, 1),
    [depthUnit],
  );
  const pressureItems = useMemo(
    () => pressureUnit === 'psi' ? buildRange(50, 4500, 50) : buildRange(5, 300, 5),
    [pressureUnit],
  );
  const endPressureItems = useMemo(
    () => pressureUnit === 'psi' ? buildRange(0, 4500, 50) : buildRange(0, 300, 5),
    [pressureUnit],
  );
  const endReserveItems = useMemo(
    () => pressureUnit === 'psi' ? buildRange(0, 2900, 50) : buildRange(0, 200, 5),
    [pressureUnit],
  );
  const tankVolumeItems = useMemo(() => buildRange(1, 30, 1), []);
  const diveTimeItems   = useMemo(() => buildRange(1, 180, 1), []);
  const sacRateItems    = useMemo(() => buildRange(5, 60, 1), []);

  const pressureLabel = pressureUnit === 'psi' ? 'PSI' : 'bar';

  const results = useMemo(() => {
    if (fO2 <= 0) return null;
    return {
      modWork: mod(fO2, ppO2Work),
      modDeco: mod(fO2, ppO2Deco),
      bestMixVal: bestMix(depthM, ppO2Work),
      eadVal: ead(fN2, depthM, airN2),
      endVal: fHe > 0 ? end(fHe, depthM) : null,
    };
  }, [fO2, fHe, fN2, depthM, ppO2Work, ppO2Deco]);

  const sacPressureBar = useMemo(
    () => pressureUnit === 'psi' ? sacPressureUsed / 14.5038 : sacPressureUsed,
    [sacPressureUsed, pressureUnit],
  );
  const sacResult = useMemo(() => {
    if (sacPressureBar <= 0 || sacTankVolume <= 0 || sacAvgDepth < 0 || sacDiveTime <= 0) return null;
    const adM = toMeters(sacAvgDepth, depthUnit);
    return calcSAC({ pressureUsed: sacPressureBar, tankVolume: sacTankVolume, avgDepth: adM, diveTime: sacDiveTime });
  }, [sacPressureBar, sacTankVolume, sacAvgDepth, sacDiveTime, depthUnit]);

  const endCurrentBar = useMemo(
    () => pressureUnit === 'psi' ? endCurrentPressure / 14.5038 : endCurrentPressure,
    [endCurrentPressure, pressureUnit],
  );
  const endReserveBar = useMemo(
    () => pressureUnit === 'psi' ? endReserve / 14.5038 : endReserve,
    [endReserve, pressureUnit],
  );
  const enduranceResult = useMemo(() => {
    if (endCurrentBar <= 0 || endTankVolume <= 0 || endDepth < 0 || endSacRate <= 0) return null;
    const dpM = toMeters(endDepth, depthUnit);
    return calcGasEndurance({ currentPressure: endCurrentBar, reservePressure: endReserveBar, tankVolume: endTankVolume, depth: dpM, sacRate: endSacRate });
  }, [endCurrentBar, endReserveBar, endTankVolume, endDepth, endSacRate, depthUnit]);

  function displayDepth(m: number) {
    return fromMeters(m, depthUnit).toFixed(1);
  }

  const mixLabel =
    fHe > 0
      ? `Trimix ${(fO2 * 100).toFixed(0)}/${(fHe * 100).toFixed(0)}`
      : fO2 !== 0.21
      ? `Nitrox ${(fO2 * 100).toFixed(0)}`
      : null;

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* ── SAC Rate ── */}
      <SectionHeader title={t('calc_sac')} subtitle={t('calc_sac_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('calc_sac_pressure_used')}
            items={pressureItems}
            value={sacPressureUsed}
            onChange={setSacPressureUsed}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker
            label={t('calc_sac_tank_volume')}
            items={tankVolumeItems}
            value={sacTankVolume}
            onChange={setSacTankVolume}
          />
        </View>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('calc_sac_avg_depth')}
            items={depthItems}
            value={sacAvgDepth}
            onChange={setSacAvgDepth}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker
            label={t('calc_sac_dive_time')}
            items={diveTimeItems}
            value={sacDiveTime}
            onChange={setSacDiveTime}
          />
        </View>
      </View>
      {sacResult ? (
        <>
          <ResultCard title={t('calc_sac_result')} value={sacResult.sacRate.toFixed(1)} unit="L/min" subtitle={`${sacAvgDepth}${depthLabel} 평균 수심 기준`} accent={theme.accent} />
          <ResultCard title={t('calc_sac_gas_consumed')} value={sacResult.totalGasConsumed.toFixed(0)} unit="L" subtitle={`${sacPressureUsed} ${pressureLabel} × ${sacTankVolume} L`} accent={theme.accentSub} />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_check_input')}</Text>
      )}

      {/* ── Gas Endurance ── */}
      <SectionHeader title={t('calc_endurance')} subtitle={t('calc_endurance_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('calc_endurance_current_pressure')}
            items={endPressureItems}
            value={endCurrentPressure}
            onChange={setEndCurrentPressure}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker
            label={t('calc_endurance_reserve')}
            items={endReserveItems}
            value={endReserve}
            onChange={setEndReserve}
          />
        </View>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('calc_sac_tank_volume')}
            items={tankVolumeItems}
            value={endTankVolume}
            onChange={setEndTankVolume}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker
            label={t('calc_endurance_depth')}
            items={depthItems}
            value={endDepth}
            onChange={setEndDepth}
          />
        </View>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label="SAC Rate"
            items={sacRateItems}
            value={endSacRate}
            onChange={setEndSacRate}
          />
        </View>
      </View>
      {enduranceResult ? (
        <>
          <ResultCard
            title={t('calc_endurance_result')}
            value={enduranceResult.enduranceMin < 0 ? '0' : enduranceResult.enduranceMin.toFixed(1)}
            unit="min"
            subtitle={`${endDepth}${depthLabel} / SAC ${endSacRate} L/min`}
            accent="#008844"
            warning={enduranceResult.enduranceMin <= 0 ? t('calc_err_reserve') : undefined}
          />
          <ResultCard
            title={t('calc_endurance_usable_gas')}
            value={enduranceResult.usableGasL.toFixed(0)}
            unit="L"
            subtitle={`${endCurrentPressure} ${pressureLabel} - ${endReserve} ${pressureLabel} × ${endTankVolume} L`}
            accent={theme.accentSub}
          />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_check_input')}</Text>
      )}

      {/* ── Gas Settings ── */}
      <SectionHeader title={t('calc_gas_settings')} subtitle={t('calc_gas_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <GasSlider label="O₂ %" value={fO2} onChange={setFO2} min={0.04} max={Math.max(0.04, 1 - fHe)} step={0.01} />
        <GasSlider label="He %" value={fHe} onChange={setFHe} min={0} max={Math.max(0, 1 - fO2)} step={0.01} />
        <View style={[styles.n2Row, { borderTopColor: theme.surfaceAlt }]}>
          <Text style={[styles.n2Label, { color: theme.textMuted }]}>{t('calc_n2_auto')}</Text>
          <Text style={[styles.n2Value, { color: theme.text }]}>{(fN2 * 100).toFixed(0)} %</Text>
        </View>
        {mixLabel && (
          <Text style={[styles.mixTag, { backgroundColor: theme.infoBg, color: theme.accent }]}>
            {mixLabel}
          </Text>
        )}
      </View>

      {/* ── MOD ── */}
      <SectionHeader
        title={t('calc_mod')}
        subtitle={`ppO₂ ${ppO2Work} / ${ppO2Deco} bar`}
      />
      {results ? (
        <>
          <ResultCard title={t('calc_mod_work')} value={displayDepth(results.modWork)} unit={depthLabel} subtitle={`ppO₂ ${ppO2Work} bar`} accent={theme.accent} />
          <ResultCard title={t('calc_mod_deco')} value={displayDepth(results.modDeco)} unit={depthLabel} subtitle={`ppO₂ ${ppO2Deco} bar`} accent={theme.accentSub} />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_enter_o2')}</Text>
      )}

      {/* ── Best Mix ── */}
      <SectionHeader title={t('calc_best_mix')} subtitle={t('calc_best_mix_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('calc_target_depth')}
            items={depthItems}
            value={depth}
            onChange={setDepth}
          />
        </View>
      </View>
      {results && (
        <ResultCard title={`Best Mix O₂`} value={(results.bestMixVal * 100).toFixed(0)} unit="%" subtitle={`${depth}${depthLabel} / ppO₂ ${ppO2Work} bar`} accent="#008844" />
      )}

      {/* ── EAD ── */}
      <SectionHeader title={t('calc_ead')} />
      {results ? (
        <ResultCard
          title="EAD"
          value={results.eadVal < 0 ? '-' : displayDepth(results.eadVal)}
          unit={results.eadVal < 0 ? '' : depthLabel}
          subtitle={`Nitrox ${(fO2 * 100).toFixed(0)} / ${depth}${depthLabel}`}
          accent="#7C3AED"
          warning={results.eadVal < 0 ? t('calc_ead_negative') : undefined}
        />
      ) : <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_enter_gas')}</Text>}

      {/* ── END ── */}
      <SectionHeader title={t('calc_end')} />
      {results ? (
        results.endVal !== null ? (
          <ResultCard title="END" value={displayDepth(results.endVal)} unit={depthLabel} subtitle={`He ${(fHe * 100).toFixed(0)}% / ${depth}${depthLabel}`} accent="#CC5500" />
        ) : (
          <View style={[styles.infoBox, { backgroundColor: theme.successBg }]}>
            <Text style={[styles.infoText, { color: theme.successText }]}>{t('calc_end_none')}</Text>
          </View>
        )
      ) : <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_enter_gas')}</Text>}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    borderRadius: 12,
    paddingTop: 10,
    paddingHorizontal: 6,
    paddingBottom: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: 2,
    marginTop: 18,
    backgroundColor: 'transparent',
  },
  n2Row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, marginTop: 4 },
  n2Label: { fontSize: 13 },
  n2Value: { fontSize: 16, fontWeight: '700' },
  mixTag: { alignSelf: 'flex-start', marginTop: 8, fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  emptyHint: { fontSize: 13, textAlign: 'center', marginVertical: 8 },
  infoBox: { borderRadius: 8, padding: 12, marginBottom: 10 },
  infoText: { fontSize: 13 },
});
