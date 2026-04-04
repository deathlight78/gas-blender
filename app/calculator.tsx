import { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import GasSlider from '../src/components/ui/GasSlider';
import NumericInput from '../src/components/ui/NumericInput';
import ResultCard from '../src/components/ui/ResultCard';
import SectionHeader from '../src/components/ui/SectionHeader';
import { mod, bestMix } from '../src/lib/gas/mod';
import { ead, end } from '../src/lib/gas/ead-end';
import { calcSAC, calcGasEndurance } from '../src/lib/gas/sac-rate';
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
  const { ppO2Work, ppO2Deco, depthUnit, airN2 } = useSettingsStore();
  const theme = useAppTheme();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [fO2, setFO2] = useState(0.21);
  const [fHe, setFHe] = useState(0);
  const [depthStr, setDepthStr] = useState('40');

  // SAC Rate inputs
  const [sacPressureUsed, setSacPressureUsed] = useState('100');
  const [sacTankVolume, setSacTankVolume] = useState('12');
  const [sacAvgDepth, setSacAvgDepth] = useState('20');
  const [sacDiveTime, setSacDiveTime] = useState('45');

  // Gas Endurance inputs
  const [endCurrentPressure, setEndCurrentPressure] = useState('200');
  const [endReserve, setEndReserve] = useState('50');
  const [endTankVolume, setEndTankVolume] = useState('12');
  const [endDepth, setEndDepth] = useState('30');
  const [endSacRate, setEndSacRate] = useState('20');

  const fN2 = Math.max(0, 1 - fO2 - fHe);
  const depthInput = parseFloat(depthStr) || 0;
  const depthM = toMeters(depthInput, depthUnit);
  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';

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

  const sacResult = useMemo(() => {
    const pu = parseFloat(sacPressureUsed) || 0;
    const tv = parseFloat(sacTankVolume) || 0;
    const ad = parseFloat(sacAvgDepth) || 0;
    const dt = parseFloat(sacDiveTime) || 0;
    if (pu <= 0 || tv <= 0 || ad < 0 || dt <= 0) return null;
    const adM = toMeters(ad, depthUnit);
    return calcSAC({ pressureUsed: pu, tankVolume: tv, avgDepth: adM, diveTime: dt });
  }, [sacPressureUsed, sacTankVolume, sacAvgDepth, sacDiveTime, depthUnit]);

  const enduranceResult = useMemo(() => {
    const cp = parseFloat(endCurrentPressure) || 0;
    const rv = parseFloat(endReserve) || 0;
    const tv = parseFloat(endTankVolume) || 0;
    const dp = parseFloat(endDepth) || 0;
    const sr = parseFloat(endSacRate) || 0;
    if (cp <= 0 || tv <= 0 || dp < 0 || sr <= 0) return null;
    const dpM = toMeters(dp, depthUnit);
    return calcGasEndurance({ currentPressure: cp, reservePressure: rv, tankVolume: tv, depth: dpM, sacRate: sr });
  }, [endCurrentPressure, endReserve, endTankVolume, endDepth, endSacRate, depthUnit]);

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
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>O₂ 비율을 입력하세요</Text>
      )}

      <SectionHeader title={t('calc_best_mix')} subtitle={t('calc_best_mix_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <NumericInput label={t('calc_target_depth')} value={depthStr} onChangeText={setDepthStr} unit={depthLabel} />
      </View>
      {results && (
        <ResultCard title={`Best Mix O₂`} value={(results.bestMixVal * 100).toFixed(0)} unit="%" subtitle={`${depthStr}${depthLabel} / ppO₂ ${ppO2Work} bar`} accent="#008844" />
      )}

      <SectionHeader title={t('calc_ead')} />
      {results ? (
        <ResultCard
          title="EAD"
          value={results.eadVal < 0 ? '-' : displayDepth(results.eadVal)}
          unit={results.eadVal < 0 ? '' : depthLabel}
          subtitle={`Nitrox ${(fO2 * 100).toFixed(0)} / ${depthStr}${depthLabel}`}
          accent="#7C3AED"
          warning={results.eadVal < 0 ? t('calc_ead_negative') : undefined}
        />
      ) : <Text style={[styles.emptyHint, { color: theme.textMuted }]}>기체 설정을 입력하세요</Text>}

      <SectionHeader title={t('calc_end')} />
      {results ? (
        results.endVal !== null ? (
          <ResultCard title="END" value={displayDepth(results.endVal)} unit={depthLabel} subtitle={`He ${(fHe * 100).toFixed(0)}% / ${depthStr}${depthLabel}`} accent="#CC5500" />
        ) : (
          <View style={[styles.infoBox, { backgroundColor: theme.successBg }]}>
            <Text style={[styles.infoText, { color: theme.successText }]}>{t('calc_end_none')}</Text>
          </View>
        )
      ) : <Text style={[styles.emptyHint, { color: theme.textMuted }]}>기체 설정을 입력하세요</Text>}

      <SectionHeader title={t('calc_sac')} subtitle={t('calc_sac_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row2}>
          <NumericInput label={t('calc_sac_pressure_used')} value={sacPressureUsed} onChangeText={setSacPressureUsed} unit="bar" containerStyle={styles.half} />
          <NumericInput label={t('calc_sac_tank_volume')} value={sacTankVolume} onChangeText={setSacTankVolume} unit="L" containerStyle={styles.half} />
        </View>
        <View style={styles.row2}>
          <NumericInput label={t('calc_sac_avg_depth')} value={sacAvgDepth} onChangeText={setSacAvgDepth} unit={depthLabel} containerStyle={styles.half} />
          <NumericInput label={t('calc_sac_dive_time')} value={sacDiveTime} onChangeText={setSacDiveTime} unit="min" containerStyle={styles.half} />
        </View>
      </View>
      {sacResult ? (
        <>
          <ResultCard title={t('calc_sac_result')} value={sacResult.sacRate.toFixed(1)} unit="L/min" subtitle={`${sacAvgDepth}${depthLabel} 평균 수심 기준`} accent={theme.accent} />
          <ResultCard title={t('calc_sac_gas_consumed')} value={sacResult.totalGasConsumed.toFixed(0)} unit="L" subtitle={`${sacPressureUsed} bar × ${sacTankVolume} L`} accent={theme.accentSub} />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>입력값을 확인하세요</Text>
      )}

      <SectionHeader title={t('calc_endurance')} subtitle={t('calc_endurance_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row2}>
          <NumericInput label={t('calc_endurance_current_pressure')} value={endCurrentPressure} onChangeText={setEndCurrentPressure} unit="bar" containerStyle={styles.half} />
          <NumericInput label={t('calc_endurance_reserve')} value={endReserve} onChangeText={setEndReserve} unit="bar" containerStyle={styles.half} />
        </View>
        <View style={styles.row2}>
          <NumericInput label={t('calc_sac_tank_volume')} value={endTankVolume} onChangeText={setEndTankVolume} unit="L" containerStyle={styles.half} />
          <NumericInput label={t('calc_endurance_depth')} value={endDepth} onChangeText={setEndDepth} unit={depthLabel} containerStyle={styles.half} />
        </View>
        <NumericInput label={`SAC Rate`} value={endSacRate} onChangeText={setEndSacRate} unit="L/min" hint="위에서 계산한 SAC Rate 입력" />
      </View>
      {enduranceResult ? (
        <>
          <ResultCard
            title={t('calc_endurance_result')}
            value={enduranceResult.enduranceMin < 0 ? '0' : enduranceResult.enduranceMin.toFixed(1)}
            unit="min"
            subtitle={`${endDepth}${depthLabel} / SAC ${endSacRate} L/min`}
            accent="#008844"
            warning={enduranceResult.enduranceMin <= 0 ? '예비 압력 부족' : undefined}
          />
          <ResultCard
            title={t('calc_endurance_usable_gas')}
            value={enduranceResult.usableGasL.toFixed(0)}
            unit="L"
            subtitle={`${endCurrentPressure} bar - ${endReserve} bar × ${endTankVolume} L`}
            accent={theme.accentSub}
          />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>입력값을 확인하세요</Text>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  row2: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  n2Row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, marginTop: 4 },
  n2Label: { fontSize: 13 },
  n2Value: { fontSize: 16, fontWeight: '700' },
  mixTag: { alignSelf: 'flex-start', marginTop: 8, fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  emptyHint: { fontSize: 13, textAlign: 'center', marginVertical: 8 },
  infoBox: { borderRadius: 8, padding: 12, marginBottom: 10 },
  infoText: { fontSize: 13 },
});
