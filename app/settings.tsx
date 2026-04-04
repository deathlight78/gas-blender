import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import NumericInput from '../src/components/ui/NumericInput';
import GasSlider from '../src/components/ui/GasSlider';
import SectionHeader from '../src/components/ui/SectionHeader';
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

export default function SettingsScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const theme = useAppTheme();
  const { t } = useTranslation();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const store = useSettingsStore();
  const { language, setLanguage, themeOverride, setThemeOverride } = useAppStore();

  const [ppO2Work, setPpO2Work] = useState(String(store.ppO2Work));
  const [ppO2Deco, setPpO2Deco] = useState(String(store.ppO2Deco));
  const [ascentRate, setAscentRate] = useState(String(store.ascentRate));
  const [descentRate, setDescentRate] = useState(String(store.descentRate));
  const [gfLow, setGfLow] = useState(store.gfLow);
  const [gfHigh, setGfHigh] = useState(store.gfHigh);

  function save() {
    const w = parseFloat(ppO2Work);
    const d = parseFloat(ppO2Deco);
    const asc = parseFloat(ascentRate);
    const desc = parseFloat(descentRate);

    if (isNaN(w) || w < 0.16 || w > 2.0) { Alert.alert(t('error'), 'ppO₂ 작업 한계는 0.16~2.0 범위여야 합니다.'); return; }
    if (isNaN(d) || d < 0.16 || d > 2.0) { Alert.alert(t('error'), 'ppO₂ 감압 한계는 0.16~2.0 범위여야 합니다.'); return; }
    if (w > d) { Alert.alert(t('error'), 'ppO₂ 작업 한계는 감압 한계보다 낮아야 합니다.'); return; }
    if (isNaN(asc) || asc <= 0) { Alert.alert(t('error'), '상승 속도는 양수여야 합니다.'); return; }
    if (isNaN(desc) || desc <= 0) { Alert.alert(t('error'), '하강 속도는 양수여야 합니다.'); return; }

    store.setPpO2Work(w);
    store.setPpO2Deco(d);
    store.setGf(gfLow, gfHigh);
    store.setAscentRate(asc);
    store.setDescentRate(desc);
    Alert.alert(t('confirm'), t('save') + ' 완료');
  }

  function reset() {
    Alert.alert(t('reset'), '모든 설정을 기본값으로 되돌리겠습니까?', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('reset'),
        style: 'destructive',
        onPress: () => {
          store.resetToDefaults();
          setPpO2Work('1.4');
          setPpO2Deco('1.6');
          setAscentRate('9');
          setDescentRate('20');
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
        <NumericInput label={t('settings_ppo2_work')} value={ppO2Work} onChangeText={setPpO2Work} unit="bar" hint={t('settings_ppo2_work_hint')} />
        <NumericInput label={t('settings_ppo2_deco')} value={ppO2Deco} onChangeText={setPpO2Deco} unit="bar" hint={t('settings_ppo2_deco_hint')} />
        {parseFloat(ppO2Work) > 1.4 && <Text style={[styles.cautionText, { color: theme.warningText }]}>⚠ 작업 한계 1.4 bar 초과</Text>}
        {parseFloat(ppO2Deco) > 1.6 && <Text style={[styles.cautionText, { color: theme.warningText }]}>⚠ 감압 한계 1.6 bar 초과</Text>}
      </View>

      <SectionHeader title={t('settings_gf')} subtitle={t('settings_gf_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <GasSlider label={`GF Low: ${(gfLow * 100).toFixed(0)}%`} value={gfLow} onChange={(v) => setGfLow(Math.min(v, gfHigh))} min={0.1} max={gfHigh} step={0.05} />
        <GasSlider label={`GF High: ${(gfHigh * 100).toFixed(0)}%`} value={gfHigh} onChange={(v) => setGfHigh(Math.max(v, gfLow))} min={gfLow} max={1.0} step={0.05} />
        <Text style={[styles.gfHint, { color: theme.textMuted }]}>
          GF {(gfLow * 100).toFixed(0)}/{(gfHigh * 100).toFixed(0)} — {gfLow <= 0.3 && gfHigh >= 0.8 ? '보수적' : gfLow >= 0.7 ? '공격적' : '중간'}
        </Text>
      </View>

      <SectionHeader title={t('settings_units')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.toggleLabel, { color: theme.textSecondary }]}>{t('settings_depth')}</Text>
        <ToggleGroup<DepthUnit>
          options={['m', 'ft']}
          value={store.depthUnit}
          onChange={store.setDepthUnit}
          labels={{ m: '미터 (m)', ft: '피트 (ft)' }}
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
        <NumericInput label={t('settings_ascent')} value={ascentRate} onChangeText={setAscentRate} unit="m/min" hint={t('settings_ascent_hint')} />
        <NumericInput label={t('settings_descent')} value={descentRate} onChangeText={setDescentRate} unit="m/min" hint={t('settings_descent_hint')} />
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
  card: { borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, marginBottom: 4 },
  cautionText: { fontSize: 12, marginTop: 4 },
  gfHint: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  toggleLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  toggleText: { fontSize: 13, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  saveBtn: { flex: 2, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700' },
  resetBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
  resetBtnText: { fontSize: 15, fontWeight: '600' },
  disclaimer: { borderRadius: 8, padding: 12, marginTop: 20 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
});
