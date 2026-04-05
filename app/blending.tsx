import { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import TankForm from '../src/components/blending/TankForm';
import BlendResult from '../src/components/blending/BlendResult';
import SectionHeader from '../src/components/ui/SectionHeader';
import DrumRollPicker, { DRUM_PICKER_H } from '../src/components/ui/DrumRollPicker';
import ResultCard from '../src/components/ui/ResultCard';
import { calcOCBlend } from '../src/lib/blending/oc-blending';
import { calcCCRBlend } from '../src/lib/blending/ccr-blending';
import { OCBlendResult, CCRBlendResult } from '../src/types/blending.types';
import { buildRange } from '../src/lib/utils/ranges';
import { useSettingsStore } from '../src/store/settings.store';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';

type Tab = 'oc' | 'ccr';

function translateCCRWarning(w: string, t: (k: any, p?: Record<string, string>) => string): string {
  const [key, ...params] = w.split('|');
  switch (key) {
    case 'blend_err_setpoint_high':
    case 'blend_err_setpoint_low':
      return t(key);
    case 'blend_err_diluent_hypoxic':
      return t(key, { val: params[0] });
    case 'blend_err_setpoint_exceeded_at_depth':
      return t(key, { depth: params[0], ppo2: params[1], sp: params[2] });
    case 'blend_err_depth_exceeds_mod':
      return t(key, { depth: params[0], mod: params[1] });
    default:
      return w;
  }
}

interface TankValues { pressure: string; fO2: number; fHe: number }
interface CCRValues { dilFO2: number; dilFHe: number; setpoint: number; maxDepth: number }

const DEFAULT_CURRENT: TankValues = { pressure: '50', fO2: 0.21, fHe: 0 };
const DEFAULT_TARGET: TankValues = { pressure: '200', fO2: 0.32, fHe: 0 };
const DEFAULT_CCR: CCRValues = { dilFO2: 0.21, dilFHe: 0.35, setpoint: 1.3, maxDepth: 45 };

// setpoint 범위: 0.5 ~ 1.6, step 0.05
const SETPOINT_ITEMS = buildRange(0.5, 1.6, 0.05);

export default function BlendingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { pressureUnit, airO2, depthUnit } = useSettingsStore();
  const theme = useAppTheme();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [tab, setTab] = useState<Tab>('oc');
  const [current, setCurrent] = useState<TankValues>(DEFAULT_CURRENT);
  const [target, setTarget] = useState<TankValues>(DEFAULT_TARGET);
  const [ocResult, setOcResult] = useState<OCBlendResult | null>(null);
  const [ccr, setCcr] = useState<CCRValues>(DEFAULT_CCR);
  const [ccrResult, setCcrResult] = useState<CCRBlendResult | null>(null);

  // CCR 수심 범위
  const ccrDepthItems = useMemo(
    () => depthUnit === 'ft' ? buildRange(16, 330, 3) : buildRange(5, 100, 1),
    [depthUnit],
  );
  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';

  function toPressureBar(str: string) {
    const v = parseFloat(str) || 0;
    return pressureUnit === 'psi' ? v / 14.5038 : v;
  }

  function calcOC() {
    const cp = toPressureBar(current.pressure);
    const tp = toPressureBar(target.pressure);
    if (tp <= cp) { Alert.alert(t('error'), t('blend_err_target_pressure')); return; }
    if (current.fO2 + current.fHe > 1 || target.fO2 + target.fHe > 1) { Alert.alert(t('error'), t('blend_err_gas_sum')); return; }
    setOcResult(calcOCBlend({
      currentPressure: cp,
      currentMix: { fO2: current.fO2, fHe: current.fHe, fN2: 1 - current.fO2 - current.fHe },
      targetPressure: tp,
      targetMix: { fO2: target.fO2, fHe: target.fHe, fN2: 1 - target.fO2 - target.fHe },
      airO2,
    }));
  }

  function calcCCR() {
    const maxDepthM = depthUnit === 'ft' ? ccr.maxDepth * 0.3048 : ccr.maxDepth;
    setCcrResult(calcCCRBlend({
      diluentMix: { fO2: ccr.dilFO2, fHe: ccr.dilFHe, fN2: Math.max(0, 1 - ccr.dilFO2 - ccr.dilFHe) },
      diluentPressure: 200,
      o2Pressure: 200,
      setpoint: ccr.setpoint,
      maxDepth: maxDepthM,
    }));
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.tabBarBorder }]}>
        {(['oc', 'ccr'] as Tab[]).map((t_) => (
          <TouchableOpacity
            key={t_}
            style={[styles.tabBtn, { backgroundColor: tab === t_ ? theme.accent : theme.surfaceAlt }]}
            onPress={() => setTab(t_)}
          >
            <Text style={[styles.tabText, { color: tab === t_ ? '#fff' : theme.textMuted }]}>
              {t_ === 'oc' ? t('blend_oc') : t('blend_ccr')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.content}>
        {tab === 'oc' ? (
          <>
            <TankForm title={t('blend_current_tank')} values={current} onChange={setCurrent} pressureUnit={pressureUnit} />
            <TankForm title={t('blend_target_mix')} values={target} onChange={setTarget} pressureUnit={pressureUnit} />
            <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.buttonPrimary }]} onPress={calcOC}>
              <Text style={[styles.calcBtnText, { color: theme.buttonPrimaryText }]}>{t('blend_calc')}</Text>
            </TouchableOpacity>
            <SectionHeader title={t('blend_result')} />
            <BlendResult result={ocResult} pressureUnit={pressureUnit} />
          </>
        ) : (
          <>
            <SectionHeader title={t('blend_diluent')} subtitle={t('blend_diluent_subtitle')} />
            <TankForm
              title=""
              values={{ pressure: '200', fO2: ccr.dilFO2, fHe: ccr.dilFHe }}
              onChange={(v) => setCcr((c) => ({ ...c, dilFO2: v.fO2, dilFHe: v.fHe }))}
              pressureUnit={pressureUnit}
            />
            <SectionHeader title={t('blend_setpoint')} />
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.pickerRow}>
                <DrumRollPicker
                  label={t('blend_setpoint_label')}
                  items={SETPOINT_ITEMS}
                  value={ccr.setpoint}
                  onChange={(v) => setCcr((c) => ({ ...c, setpoint: v }))}
                  formatValue={(v) => v.toFixed(2)}
                />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <DrumRollPicker
                  label={t('blend_max_depth')}
                  items={ccrDepthItems}
                  value={ccr.maxDepth}
                  onChange={(v) => setCcr((c) => ({ ...c, maxDepth: v }))}
                />
              </View>
              <Text style={[styles.hintText, { color: theme.textMuted }]}>{t('blend_setpoint_hint')}</Text>
            </View>
            <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.buttonPrimary }]} onPress={calcCCR}>
              <Text style={[styles.calcBtnText, { color: theme.buttonPrimaryText }]}>{t('blend_ccr_calc')}</Text>
            </TouchableOpacity>
            {ccrResult && (
              <>
                <SectionHeader title={t('blend_result')} />
                <ResultCard title={t('blend_max_setpoint_depth')} value={ccrResult.maxSetpointDepth.toFixed(1)} unit="m" subtitle={t('blend_diluent_fo2_basis')} accent="#CC5500" />
                <ResultCard
                  title={t('blend_actual_ppo2')}
                  value={ccrResult.actualPpO2AtDepth.toFixed(3)}
                  unit="bar"
                  subtitle={`${ccr.maxDepth}${depthLabel} Diluent ppO₂`}
                  accent={theme.accent}
                  warning={ccrResult.actualPpO2AtDepth > ccr.setpoint * 1.05 ? t('blend_warn_setpoint_exceeded') : undefined}
                />
                {ccrResult.warnings.length > 0 && (
                  <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
                    {ccrResult.warnings.map((w, i) => <Text key={i} style={[styles.warningText, { color: theme.warningText }]}>⚠ {translateCCRWarning(w, t)}</Text>)}
                  </View>
                )}
              </>
            )}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  tabBar: { flexDirection: 'row', padding: 8, gap: 6, borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '600' },
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    borderRadius: 12,
    paddingTop: 10,
    paddingHorizontal: 6,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
  hintText: { fontSize: 11, marginTop: 6, paddingHorizontal: 8, textAlign: 'center' },
  calcBtn: { borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 8, marginBottom: 2 },
  calcBtnText: { fontSize: 16, fontWeight: '700' },
  warningBox: { borderRadius: 8, padding: 12, gap: 6, marginTop: 4 },
  warningText: { fontSize: 13 },
});
