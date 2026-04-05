import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import NumericInput from '../src/components/ui/NumericInput';
import GasSlider from '../src/components/ui/GasSlider';
import SectionHeader from '../src/components/ui/SectionHeader';
import DecoTable from '../src/components/deco/DecoTable';
import DecoSummary from '../src/components/deco/DecoSummary';
import { planDeco } from '../src/lib/deco/deco-planner';
import { DecoResult, DecoInput } from '../src/types/deco.types';
import { GasMix } from '../src/types/gas.types';
import { useSettingsStore } from '../src/store/settings.store';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';

interface DecoGasRow { id: number; switchDepth: string; fO2: number; fHe: number }
let nextId = 1;

export default function DecoScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { gfLow, gfHigh, ascentRate, descentRate, depthUnit, airO2, airN2 } = useSettingsStore();
  const theme = useAppTheme();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [targetDepth, setTargetDepth] = useState('40');
  const [bottomTime, setBottomTime] = useState('30');
  const [bottomFO2, setBottomFO2] = useState(0.21);
  const [bottomFHe, setBottomFHe] = useState(0.35);
  const [gfLoStr, setGfLoStr] = useState(String(Math.round(gfLow * 100)));
  const [gfHiStr, setGfHiStr] = useState(String(Math.round(gfHigh * 100)));
  const [decoGases, setDecoGases] = useState<DecoGasRow[]>([
    { id: nextId++, switchDepth: '21', fO2: 0.5, fHe: 0 },
    { id: nextId++, switchDepth: '6', fO2: 1.0, fHe: 0 },
  ]);
  const [result, setResult] = useState<DecoResult | null>(null);
  const [bottomRunTime, setBottomRunTime] = useState(0);

  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';
  function toM(v: string) { const n = parseFloat(v) || 0; return depthUnit === 'ft' ? n * 0.3048 : n; }

  function calculate() {
    const depthM = toM(targetDepth);
    const btMin = parseFloat(bottomTime) || 0;
    const gfLo = (parseFloat(gfLoStr) || 30) / 100;
    const gfHi = (parseFloat(gfHiStr) || 85) / 100;

    if (depthM <= 0) { Alert.alert(t('error'), t('deco_err_depth')); return; }
    if (btMin <= 0) { Alert.alert(t('error'), t('deco_err_bottom_time')); return; }
    if (gfLo > gfHi) { Alert.alert(t('error'), t('deco_err_gf')); return; }

    const bottomMix: GasMix = { fO2: bottomFO2, fHe: bottomFHe, fN2: Math.max(0, 1 - bottomFO2 - bottomFHe) };
    const descMin = depthM / descentRate;
    const input: DecoInput = {
      segments: [
        { type: 'descent', startDepth: 0, endDepth: depthM, time: descMin, gas: bottomMix },
        { type: 'bottom', startDepth: depthM, endDepth: depthM, time: btMin, gas: bottomMix },
      ],
      decoGases: decoGases
        .map((dg) => ({ switchDepth: toM(dg.switchDepth), mix: { fO2: dg.fO2, fHe: dg.fHe, fN2: Math.max(0, 1 - dg.fO2 - dg.fHe) } }))
        .sort((a, b) => b.switchDepth - a.switchDepth),
      gfLow: gfLo, gfHigh: gfHi, ascentRate, descentRate, airO2, airN2,
    };

    try {
      setResult(planDeco(input));
      setBottomRunTime(Math.ceil(descMin + btMin));
    } catch {
      Alert.alert(t('error'), t('deco_err_input'));
    }
  }

  const bottomN2 = Math.max(0, 1 - bottomFO2 - bottomFHe);
  const mixLabel = bottomFHe > 0
    ? `Trimix ${(bottomFO2 * 100).toFixed(0)}/${(bottomFHe * 100).toFixed(0)}`
    : `EAN ${(bottomFO2 * 100).toFixed(0)}`;

  return (
    <ScrollView ref={scrollRef} style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <SectionHeader title={t('deco_profile')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row2}>
          <NumericInput label={t('deco_target_depth')} value={targetDepth} onChangeText={setTargetDepth} unit={depthLabel} containerStyle={styles.half} />
          <NumericInput label={t('deco_bottom_time')} value={bottomTime} onChangeText={setBottomTime} unit="min" containerStyle={styles.half} />
        </View>
      </View>

      <SectionHeader title={t('deco_bottom_mix')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <GasSlider label="O₂ %" value={bottomFO2} onChange={setBottomFO2} min={0.04} max={Math.max(0.04, 1 - bottomFHe)} step={0.01} />
        <GasSlider label="He %" value={bottomFHe} onChange={setBottomFHe} min={0} max={Math.max(0, 1 - bottomFO2)} step={0.01} />
        <View style={[styles.mixInfo, { borderTopColor: theme.surfaceAlt }]}>
          <Text style={[styles.mixLabel, { color: theme.accent }]}>{mixLabel}</Text>
          <Text style={[styles.n2Text, { color: theme.textMuted }]}>N₂ {(bottomN2 * 100).toFixed(0)}%</Text>
        </View>
      </View>

      <SectionHeader title={t('deco_deco_gases')} subtitle={t('deco_deco_gases_subtitle')} />
      {decoGases.map((dg) => (
        <View key={dg.id} style={[styles.card, { backgroundColor: theme.surface }, styles.decoGasCard]}>
          <View style={styles.decoGasHeader}>
            <Text style={[styles.decoGasTitle, { color: theme.textSecondary }]}>
              EAN {(dg.fO2 * 100).toFixed(0)}{dg.fHe > 0 ? `/ He ${(dg.fHe * 100).toFixed(0)}` : ''}
            </Text>
            <TouchableOpacity onPress={() => setDecoGases((p) => p.filter((g) => g.id !== dg.id))}>
              <Text style={[styles.removeBtn, { color: theme.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row2}>
            <NumericInput label={t('deco_switch_depth')} value={dg.switchDepth} onChangeText={(v) => setDecoGases((p) => p.map((g) => g.id === dg.id ? { ...g, switchDepth: v } : g))} unit={depthLabel} containerStyle={styles.half} />
            <View style={styles.half}>
              <GasSlider label="O₂ %" value={dg.fO2} onChange={(v) => setDecoGases((p) => p.map((g) => g.id === dg.id ? { ...g, fO2: v } : g))} min={0.04} max={1} step={0.01} />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={[styles.addGasBtn, { borderColor: theme.accent }]} onPress={() => setDecoGases((p) => [...p, { id: nextId++, switchDepth: '9', fO2: 0.36, fHe: 0 }])}>
        <Text style={[styles.addGasBtnText, { color: theme.accent }]}>{t('deco_add_gas')}</Text>
      </TouchableOpacity>

      <SectionHeader title={t('deco_gf')} subtitle={t('deco_gf_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row2}>
          <NumericInput label={t('deco_gf_low')} value={gfLoStr} onChangeText={setGfLoStr} unit="%" containerStyle={styles.half} />
          <NumericInput label={t('deco_gf_high')} value={gfHiStr} onChangeText={setGfHiStr} unit="%" containerStyle={styles.half} />
        </View>
      </View>

      <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.buttonPrimary }]} onPress={calculate}>
        <Text style={[styles.calcBtnText, { color: theme.buttonPrimaryText }]}>{t('deco_calc')}</Text>
      </TouchableOpacity>

      {result && (
        <>
          <SectionHeader title={t('deco_result')} subtitle={`GF ${gfLoStr}/${gfHiStr} · ${t('deco_ascent_label')} ${ascentRate}m/min`} />
          <DecoSummary result={result} />
          <SectionHeader title={t('deco_table')} />
          <DecoTable stops={result.stops} bottomRunTime={bottomRunTime} ascentRate={ascentRate} />
          {result.maxCns > 80 && (
            <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.warningText, { color: theme.warningText }]}>
                ⚠ CNS% {result.maxCns.toFixed(1)}% {t('deco_warn_cns_suffix')}
              </Text>
            </View>
          )}
          {result.maxOtu > 300 && (
            <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.warningText, { color: theme.warningText }]}>
                ⚠ OTU {result.maxOtu.toFixed(0)} {t('deco_warn_otu_suffix')}
              </Text>
            </View>
          )}
        </>
      )}

      <View style={[styles.disclaimer, { backgroundColor: theme.warningBg }]}>
        <Text style={[styles.disclaimerText, { color: theme.warningText }]}>{t('deco_disclaimer')}</Text>
      </View>
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
  mixInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, marginTop: 4 },
  mixLabel: { fontSize: 13, fontWeight: '600' },
  n2Text: { fontSize: 13 },
  decoGasCard: { marginBottom: 8 },
  decoGasHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  decoGasTitle: { fontSize: 14, fontWeight: '600' },
  removeBtn: { fontSize: 16, paddingHorizontal: 4 },
  addGasBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 4 },
  addGasBtnText: { fontWeight: '600', fontSize: 14 },
  calcBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 4 },
  calcBtnText: { fontSize: 17, fontWeight: '700' },
  warningBox: { borderRadius: 8, padding: 12, marginTop: 8 },
  warningText: { fontSize: 13 },
  disclaimer: { borderRadius: 8, padding: 12, marginTop: 16 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
});
