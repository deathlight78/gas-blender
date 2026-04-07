import { useState, useMemo, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../src/components/ui/InfoModal';
import GasSlider from '../src/components/ui/GasSlider';
import DrumRollPicker from '../src/components/ui/DrumRollPicker';
import ResultCard from '../src/components/ui/ResultCard';
import SectionHeader from '../src/components/ui/SectionHeader';
import { mod, bestMix } from '../src/lib/gas/mod';
import { ead, end } from '../src/lib/gas/ead-end';
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
  const { ppO2Work, ppO2Deco, depthUnit, airN2 } = useSettingsStore();
  const theme = useAppTheme();
  const navigation = useNavigation();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [infoVisible, setInfoVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={{ marginRight: 14 }}>
          <Ionicons name="information-circle-outline" size={22} color={theme.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  const [fO2, setFO2] = useState(0.21);
  const [fHe, setFHe] = useState(0);
  const [depth, setDepth] = useState(40);

  const fN2 = Math.max(0, 1 - fO2 - fHe);
  const depthM = toMeters(depth, depthUnit);
  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';

  const depthItems = useMemo(
    () => depthUnit === 'ft' ? buildRange(0, 330, 3) : buildRange(0, 100, 1),
    [depthUnit],
  );

  const results = useMemo(() => {
    if (fO2 <= 0) return null;
    return {
      modWork:    mod(fO2, ppO2Work),
      modDeco:    mod(fO2, ppO2Deco),
      bestMixVal: bestMix(depthM, ppO2Work),
      eadVal:     ead(fN2, depthM, airN2),
      endVal:     fHe > 0 ? end(fHe, depthM) : null,
    };
  }, [fO2, fHe, fN2, depthM, ppO2Work, ppO2Deco, airN2]);

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
      <InfoModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
        title={t('info_calculator_title')}
        content={t('info_calculator_content')}
      />
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

      <SectionHeader title={t('calc_mod')} subtitle={`ppO₂ ${ppO2Work} / ${ppO2Deco} bar`} />
      {results ? (
        <>
          <ResultCard title={t('calc_mod_work')} value={displayDepth(results.modWork)} unit={depthLabel} subtitle={`ppO₂ ${ppO2Work} bar`} accent={theme.accent} />
          <ResultCard title={t('calc_mod_deco')} value={displayDepth(results.modDeco)} unit={depthLabel} subtitle={`ppO₂ ${ppO2Deco} bar`} accent={theme.accentSub} />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_enter_o2')}</Text>
      )}

      <SectionHeader title={t('calc_best_mix')} subtitle={t('calc_best_mix_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker label={t('calc_target_depth')} items={depthItems} value={depth} onChange={setDepth} />
        </View>
      </View>
      {results && (
        <ResultCard title="Best Mix O₂" value={(results.bestMixVal * 100).toFixed(0)} unit="%" subtitle={`${depth}${depthLabel} / ppO₂ ${ppO2Work} bar`} accent="#008844" />
      )}

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
    borderRadius: 12, paddingTop: 10, paddingHorizontal: 6, paddingBottom: 8,
    marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  pickerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 2 },
  n2Row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, marginTop: 4 },
  n2Label: { fontSize: 13 },
  n2Value: { fontSize: 16, fontWeight: '700' },
  mixTag: { alignSelf: 'flex-start', marginTop: 8, fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  emptyHint: { fontSize: 13, textAlign: 'center', marginVertical: 8 },
  infoBox: { borderRadius: 8, padding: 12, marginBottom: 10 },
  infoText: { fontSize: 13 },
});
