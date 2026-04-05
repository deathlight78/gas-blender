import { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import DrumRollPicker, { DRUM_PICKER_H } from '../src/components/ui/DrumRollPicker';
import GasSlider from '../src/components/ui/GasSlider';
import SectionHeader from '../src/components/ui/SectionHeader';
import { buildRange } from '../src/lib/utils/ranges';
import { useSettingsStore } from '../src/store/settings.store';
import { useAppStore } from '../src/store/app.store';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';
import { DepthUnit, PressureUnit } from '../src/types/gas.types';

type ThemeOverride = 'light' | 'dark' | null;

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  labels: Record<string, string>;
}) {
  const theme = useAppTheme();
  return (
    <View style={styles.toggleRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.toggleBtn,
            { backgroundColor: value === opt ? theme.accent : theme.surfaceAlt },
          ]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.toggleText, { color: value === opt ? '#fff' : theme.textMuted }]}>
            {labels[opt]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ppO2 범위: 1.0 ~ 2.0, step 0.05
const PPO2_ITEMS = buildRange(1.0, 2.0, 0.05);
// 상승 속도: 1~30 m/min
const ASCENT_ITEMS = buildRange(1, 30, 1);
// 하강 속도: 1~50 m/min
const DESCENT_ITEMS = buildRange(1, 50, 1);

export default function SettingsScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const theme = useAppTheme();
  const { t } = useTranslation();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const store = useSettingsStore();
  const { language, setLanguage, themeOverride, setThemeOverride } = useAppStore();

  const [ppO2Work, setPpO2Work] = useState(store.ppO2Work);
  const [ppO2Deco, setPpO2Deco] = useState(store.ppO2Deco);
  const [ascentRate, setAscentRate] = useState(store.ascentRate);
  const [descentRate, setDescentRate] = useState(store.descentRate);
  const [gfLow, setGfLow] = useState(store.gfLow);
  const [gfHigh, setGfHigh] = useState(store.gfHigh);

  function save() {
    if (ppO2Work < 1.0 || ppO2Work > 2.0) { Alert.alert(t('error'), t('settings_err_ppo2_work_range')); return; }
    if (ppO2Deco < 1.0 || ppO2Deco > 2.0) { Alert.alert(t('error'), t('settings_err_ppo2_deco_range')); return; }
    if (ppO2Work > ppO2Deco) { Alert.alert(t('error'), t('settings_err_ppo2_order')); return; }
    if (ascentRate <= 0) { Alert.alert(t('error'), t('settings_err_ascent_rate')); return; }
    if (descentRate <= 0) { Alert.alert(t('error'), t('settings_err_descent_rate')); return; }

    store.setPpO2Work(ppO2Work);
    store.setPpO2Deco(ppO2Deco);
    store.setGf(gfLow, gfHigh);
    store.setAscentRate(ascentRate);
    store.setDescentRate(descentRate);
    Alert.alert(t('confirm'), t('settings_save_done'));
  }

  function reset() {
    Alert.alert(t('reset'), t('settings_reset_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('reset'),
        style: 'destructive',
        onPress: () => {
          store.resetToDefaults();
          setPpO2Work(1.4);
          setPpO2Deco(1.6);
          setAscentRate(9);
          setDescentRate(20);
          setGfLow(0.3);
          setGfHigh(0.8);
        },
      },
    ]);
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader title={t('settings_ppo2')} subtitle={t('settings_ppo2_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('settings_ppo2_work')}
            items={PPO2_ITEMS}
            value={ppO2Work}
            onChange={setPpO2Work}
            formatValue={(v) => v.toFixed(2)}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker
            label={t('settings_ppo2_deco')}
            items={PPO2_ITEMS}
            value={ppO2Deco}
            onChange={setPpO2Deco}
            formatValue={(v) => v.toFixed(2)}
          />
        </View>
        {ppO2Work > 1.4 && <Text style={[styles.cautionText, { color: theme.warningText }]}>{t('settings_warn_ppo2_work')}</Text>}
        {ppO2Deco > 1.6 && <Text style={[styles.cautionText, { color: theme.warningText }]}>{t('settings_warn_ppo2_deco')}</Text>}
        <Text style={[styles.hintText, { color: theme.textMuted }]}>{t('settings_ppo2_work_hint')}</Text>
      </View>

      <SectionHeader title={t('settings_gf')} subtitle={t('settings_gf_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <GasSlider label={`GF Low: ${(gfLow * 100).toFixed(0)}%`} value={gfLow} onChange={(v) => setGfLow(Math.min(v, gfHigh))} min={0.1} max={gfHigh} step={0.05} />
        <GasSlider label={`GF High: ${(gfHigh * 100).toFixed(0)}%`} value={gfHigh} onChange={(v) => setGfHigh(Math.max(v, gfLow))} min={gfLow} max={1.0} step={0.05} />
        <Text style={[styles.gfHint, { color: theme.textMuted }]}>
          GF {(gfLow * 100).toFixed(0)}/{(gfHigh * 100).toFixed(0)} — {gfLow <= 0.3 && gfHigh >= 0.8 ? t('settings_gf_conservative') : gfLow >= 0.7 ? t('settings_gf_aggressive') : t('settings_gf_moderate')}
        </Text>
      </View>

      <SectionHeader title={t('settings_units')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.toggleLabel, { color: theme.textSecondary }]}>{t('settings_depth')}</Text>
        <ToggleGroup<DepthUnit>
          options={['m', 'ft']}
          value={store.depthUnit}
          onChange={store.setDepthUnit}
          labels={{ m: t('settings_depth_m'), ft: t('settings_depth_ft') }}
        />
        <Text style={[styles.toggleLabel, { color: theme.textSecondary, marginTop: 16 }]}>{t('settings_pressure')}</Text>
        <ToggleGroup<PressureUnit>
          options={['bar', 'psi']}
          value={store.pressureUnit}
          onChange={store.setPressureUnit}
          labels={{ bar: 'bar', psi: 'psi' }}
        />
      </View>

      <SectionHeader title={t('settings_air_composition')} subtitle={t('settings_air_composition_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <ToggleGroup<'precise' | 'approximate'>
          options={['precise', 'approximate']}
          value={store.airComposition}
          onChange={store.setAirComposition}
          labels={{ precise: t('settings_air_precise'), approximate: t('settings_air_approx') }}
        />
      </View>

      <SectionHeader title={t('settings_rates')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker
            label={t('settings_ascent')}
            items={ASCENT_ITEMS}
            value={ascentRate}
            onChange={setAscentRate}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker
            label={t('settings_descent')}
            items={DESCENT_ITEMS}
            value={descentRate}
            onChange={setDescentRate}
          />
        </View>
        <Text style={[styles.hintText, { color: theme.textMuted }]}>{t('settings_ascent_hint')}</Text>
      </View>

      <SectionHeader title={t('settings_appearance')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.toggleLabel, { color: theme.textSecondary }]}>{t('settings_language')}</Text>
        <ToggleGroup
          options={['ko', 'en']}
          value={language}
          onChange={(v) => setLanguage(v as 'ko' | 'en')}
          labels={{ ko: '한국어', en: 'English' }}
        />
        <Text style={[styles.toggleLabel, { color: theme.textSecondary, marginTop: 16 }]}>{t('settings_theme')}</Text>
        <ToggleGroup<string>
          options={['system', 'light', 'dark']}
          value={themeOverride ?? 'system'}
          onChange={(v) => setThemeOverride(v === 'system' ? null : (v as ThemeOverride))}
          labels={{
            system: t('settings_theme_system'),
            light: t('settings_theme_light'),
            dark: t('settings_theme_dark'),
          }}
        />
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.buttonPrimary }]} onPress={save}>
          <Text style={[styles.saveBtnText, { color: theme.buttonPrimaryText }]}>{t('save')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetBtn, { backgroundColor: theme.warningBg, borderColor: theme.warningText }]} onPress={reset}>
          <Text style={[styles.resetBtnText, { color: theme.errorText }]}>{t('reset')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.disclaimer, { backgroundColor: theme.warningBg }]}>
        <Text style={[styles.disclaimerText, { color: theme.warningText }]}>{t('settings_disclaimer')}</Text>
      </View>
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
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
  cautionText: { fontSize: 12, marginTop: 4, paddingHorizontal: 8 },
  hintText: { fontSize: 11, marginTop: 6, paddingHorizontal: 8, textAlign: 'center' },
  gfHint: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  toggleLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, paddingHorizontal: 8 },
  toggleRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  toggleText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  saveBtn: { flex: 2, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700' },
  resetBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
  resetBtnText: { fontSize: 15, fontWeight: '600' },
  disclaimer: { borderRadius: 8, padding: 12, marginTop: 20 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
});
