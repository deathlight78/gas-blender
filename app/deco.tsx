import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import StepInput from '../src/components/ui/StepInput';
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

interface DecoGasRow { id: number; switchDepth: number; fO2: number; fHe: number }
let nextId = 1;

export default function DecoScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { gfLow, gfHigh, ascentRate, descentRate, depthUnit, airO2, airN2 } = useSettingsStore();
  const theme = useAppTheme();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [targetDepth, setTargetDepth] = useState(40);
  const [bottomTime, setBottomTime]   = useState(30);
  const [bottomFO2, setBottomFO2]     = useState(0.21);
  const [bottomFHe, setBottomFHe]     = useState(0.35);
  const [gfLo, setGfLo] = useState(Math.round(gfLow  * 100));
  const [gfHi, setGfHi] = useState(Math.round(gfHigh * 100));
  const [lastStop, setLastStop] = useState(6);   // m — GUE 기본값
  const [decoGases, setDecoGases] = useState<DecoGasRow[]>([
    { id: nextId++, switchDepth: 21, fO2: 0.5, fHe: 0 },
    { id: nextId++, switchDepth: 6,  fO2: 1.0, fHe: 0 },
  ]);

  // RMV 상태 (0 = 미입력 → 소비량 계산 안 함)
  const [rmvBottom, setRmvBottom] = useState(0);
  const [rmvDeco,   setRmvDeco]   = useState(0);

  const [result, setResult] = useState<DecoResult | null>(null);
  const [bottomRunTime, setBottomRunTime] = useState(0);

  function toM(v: number) { return depthUnit === 'ft' ? v * 0.3048 : v; }

  const depthMax        = depthUnit === 'ft' ? 330 : 100;
  const depthStep       = depthUnit === 'ft' ? 3   : 1;
  const depthUnit_label = depthUnit === 'ft' ? 'ft' : 'm';
  const switchMax       = depthUnit === 'ft' ? 300 : 90;
  const switchStep      = depthUnit === 'ft' ? 10  : 3;

  function calculate() {
    const depthM  = toM(targetDepth);
    const gfLoVal = gfLo / 100;
    const gfHiVal = gfHi / 100;

    if (depthM <= 0)      { Alert.alert(t('error'), t('deco_err_depth'));       return; }
    if (bottomTime <= 0)  { Alert.alert(t('error'), t('deco_err_bottom_time')); return; }
    if (gfLoVal > gfHiVal){ Alert.alert(t('error'), t('deco_err_gf'));           return; }

    const bottomMix: GasMix = {
      fO2: bottomFO2, fHe: bottomFHe,
      fN2: Math.max(0, 1 - bottomFO2 - bottomFHe),
    };
    const descMin = depthM / descentRate;
    const input: DecoInput = {
      segments: [
        { type: 'descent', startDepth: 0,      endDepth: depthM, time: descMin,    gas: bottomMix },
        { type: 'bottom',  startDepth: depthM,  endDepth: depthM, time: bottomTime, gas: bottomMix },
      ],
      decoGases: decoGases
        .map(dg => ({
          switchDepth: toM(dg.switchDepth),
          mix: { fO2: dg.fO2, fHe: dg.fHe, fN2: Math.max(0, 1 - dg.fO2 - dg.fHe) },
        }))
        .sort((a, b) => b.switchDepth - a.switchDepth),
      gfLow: gfLoVal, gfHigh: gfHiVal,
      ascentRate, descentRate, airO2, airN2,
      lastStopDepth: lastStop,
      rmvBottom: rmvBottom > 0 ? rmvBottom : undefined,
      rmvDeco:   rmvDeco   > 0 ? rmvDeco   : undefined,
    };

    try {
      setResult(planDeco(input));
      setBottomRunTime(Math.ceil(descMin + bottomTime));
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

      {/* ── 다이브 프로파일 ── */}
      <SectionHeader title={t('deco_profile')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_target_depth')} value={targetDepth} onChange={setTargetDepth}
          min={depthUnit === 'ft' ? 16 : 5} max={depthMax} step={depthStep} unit={depthUnit_label} />
        <StepInput label={t('deco_bottom_time')} value={bottomTime} onChange={setBottomTime}
          min={1} max={180} step={1} unit="min" />
      </View>

      {/* ── 바닥 기체 ── */}
      <SectionHeader title={t('deco_bottom_mix')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <GasSlider label="O₂ %" value={bottomFO2} onChange={setBottomFO2} min={0.04} max={Math.max(0.04, 1 - bottomFHe)} step={0.01} />
        <GasSlider label="He %" value={bottomFHe} onChange={setBottomFHe} min={0}    max={Math.max(0, 1 - bottomFO2)}     step={0.01} />
        <View style={[styles.mixInfo, { borderTopColor: theme.surfaceAlt }]}>
          <Text style={[styles.mixLabel, { color: theme.accent }]}>{mixLabel}</Text>
          <Text style={[styles.n2Text,  { color: theme.textMuted }]}>N₂ {(bottomN2 * 100).toFixed(0)}%</Text>
        </View>
      </View>

      {/* ── 감압 기체 ── */}
      <SectionHeader title={t('deco_deco_gases')} subtitle={t('deco_deco_gases_subtitle')} />
      {decoGases.map((dg) => (
        <View key={dg.id} style={[styles.card, { backgroundColor: theme.surface }, styles.decoGasCard]}>
          <View style={styles.decoGasHeader}>
            <Text style={[styles.decoGasTitle, { color: theme.textSecondary }]}>
              EAN {(dg.fO2 * 100).toFixed(0)}{dg.fHe > 0 ? `/ He ${(dg.fHe * 100).toFixed(0)}` : ''}
            </Text>
            <TouchableOpacity onPress={() => setDecoGases(p => p.filter(g => g.id !== dg.id))}>
              <Text style={[styles.removeBtn, { color: theme.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <StepInput label={t('deco_switch_depth')}
            value={dg.switchDepth}
            onChange={v => setDecoGases(p => p.map(g => g.id === dg.id ? { ...g, switchDepth: v } : g))}
            min={depthUnit === 'ft' ? 10 : 3} max={switchMax} step={switchStep} unit={depthUnit_label} />
          <GasSlider label="O₂ %"
            value={dg.fO2}
            onChange={v => setDecoGases(p => p.map(g => g.id === dg.id ? { ...g, fO2: v } : g))}
            min={0.04} max={1} step={0.01} />
        </View>
      ))}
      <TouchableOpacity style={[styles.addGasBtn, { borderColor: theme.accent }]}
        onPress={() => setDecoGases(p => [...p, { id: nextId++, switchDepth: 9, fO2: 0.36, fHe: 0 }])}>
        <Text style={[styles.addGasBtnText, { color: theme.accent }]}>{t('deco_add_gas')}</Text>
      </TouchableOpacity>

      {/* ── Gradient Factor ── */}
      <SectionHeader title={t('deco_gf')} subtitle={t('deco_gf_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_gf_low')}  value={gfLo} onChange={setGfLo} min={10} max={90}  step={5} unit="%" />
        <StepInput label={t('deco_gf_high')} value={gfHi} onChange={setGfHi} min={20} max={100} step={5} unit="%" />
      </View>

      {/* ── 마지막 정지 수심 ── */}
      <SectionHeader title={t('deco_last_stop')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_last_stop')} value={lastStop} onChange={setLastStop}
          min={3} max={9} step={3} unit="m" />
      </View>

      {/* ── RMV 설정 ── */}
      <SectionHeader title={t('deco_rmv')} subtitle={t('deco_rmv_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_rmv_bottom')} value={rmvBottom} onChange={setRmvBottom}
          min={0} max={40} step={1} unit="L/min" />
        <StepInput label={t('deco_rmv_deco')} value={rmvDeco} onChange={setRmvDeco}
          min={0} max={30} step={1} unit="L/min" />
        {rmvBottom === 0 && (
          <Text style={[styles.hintText, { color: theme.textMuted }]}>
            0 = {t('deco_rmv_subtitle').split('(')[1]?.replace(')', '') ?? '미입력'}
          </Text>
        )}
      </View>

      {/* ── 계산 버튼 ── */}
      <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.buttonPrimary }]} onPress={calculate}>
        <Text style={[styles.calcBtnText, { color: theme.buttonPrimaryText }]}>{t('deco_calc')}</Text>
      </TouchableOpacity>

      {/* ── 결과 ── */}
      {result && (
        <>
          <SectionHeader
            title={t('deco_result')}
            subtitle={`GF ${gfLo}/${gfHi} · ${t('deco_ascent_label')} ${ascentRate}m/min · Last ${lastStop}m`}
          />
          <DecoSummary result={result} />

          {/* ICD 경고 */}
          {result.icdWarnings && result.icdWarnings.length > 0 && (
            <View style={[styles.icdBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.icdTitle, { color: theme.warningText }]}>{t('deco_icd_warning')}</Text>
              {result.icdWarnings.map((w, i) => (
                <Text key={i} style={[styles.icdItem, { color: theme.warningText }]}>
                  {t('deco_icd_detail', {
                    depth: String(w.depth),
                    prev:  (w.prevFN2 * 100).toFixed(0),
                    next:  (w.newFN2  * 100).toFixed(0),
                  })}
                </Text>
              ))}
              <Text style={[styles.icdNote, { color: theme.warningText }]}>{t('deco_icd_note')}</Text>
            </View>
          )}

          <SectionHeader title={t('deco_table')} />
          <DecoTable stops={result.stops} bottomRunTime={bottomRunTime} ascentRate={ascentRate} />

          {/* 기체별 소비량 */}
          {result.gasConsumptions && result.gasConsumptions.length > 0 && (
            <>
              <SectionHeader title={t('deco_gas_consumption')} />
              <View style={[styles.consumptionCard, { backgroundColor: theme.surface }]}>
                {result.gasConsumptions.map((gc, i) => (
                  <View key={i} style={[
                    styles.consumptionRow,
                    i < result.gasConsumptions!.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.surfaceAlt },
                  ]}>
                    <Text style={[styles.consumptionLabel, { color: theme.text }]}>{gc.label}</Text>
                    <Text style={[styles.consumptionValue, { color: theme.accent }]}>{gc.totalL} L</Text>
                  </View>
                ))}
              </View>
            </>
          )}

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
  card: {
    borderRadius: 12, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 8,
    marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  mixInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, marginTop: 4 },
  mixLabel: { fontSize: 13, fontWeight: '600' },
  n2Text:   { fontSize: 13 },
  decoGasCard: { marginBottom: 8 },
  decoGasHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  decoGasTitle: { fontSize: 14, fontWeight: '600' },
  removeBtn: { fontSize: 16, paddingHorizontal: 4 },
  addGasBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 4 },
  addGasBtnText: { fontWeight: '600', fontSize: 14 },
  hintText: { fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 4 },
  calcBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 4 },
  calcBtnText: { fontSize: 17, fontWeight: '700' },
  icdBox: { borderRadius: 8, padding: 12, marginTop: 8, gap: 4 },
  icdTitle: { fontSize: 13, fontWeight: '700' },
  icdItem:  { fontSize: 12 },
  icdNote:  { fontSize: 11, marginTop: 4, fontStyle: 'italic' },
  consumptionCard: {
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4,
    marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  consumptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  consumptionLabel: { fontSize: 14, fontWeight: '600' },
  consumptionValue: { fontSize: 16, fontWeight: '700' },
  warningBox:  { borderRadius: 8, padding: 12, marginTop: 8 },
  warningText: { fontSize: 13 },
  disclaimer:  { borderRadius: 8, padding: 12, marginTop: 16 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
});
