import { View, Text, StyleSheet } from 'react-native';
import { OCBlendResult } from '../../types/blending.types';
import { PressureUnit } from '../../types/gas.types';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface BlendResultProps {
  result: OCBlendResult | null;
  pressureUnit: PressureUnit;
}

function toPressureDisplay(bar: number, unit: PressureUnit) {
  const val = unit === 'psi' ? bar * 14.5038 : bar;
  return `${val.toFixed(1)} ${unit}`;
}

export default function BlendResult({ result, pressureUnit }: BlendResultProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  if (!result) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.surfaceAlt }]}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          {t('blend_result_empty')}
        </Text>
      </View>
    );
  }

  const steps = [
    { key: 'addHePressure' as const, label: t('blend_step_he'), color: '#7C3AED', note: t('blend_step_he_note') },
    { key: 'addO2Pressure' as const, label: t('blend_step_o2'), color: theme.accent, note: t('blend_step_o2_note') },
    { key: 'addTopPressure' as const, label: t('blend_step_air'), color: '#008844', note: t('blend_step_air_note') },
  ];

  const vals = {
    addHePressure: result.addHePressure,
    addO2Pressure: result.addO2Pressure,
    addTopPressure: result.addTopPressure,
  };

  // 결과가 유효하지 않으면 경고만 표시
  if (!result.isValid) {
    return (
      <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
        {result.warnings.map((w, i) => (
          <Text key={i} style={[styles.warningText, { color: theme.warningText }]}>⚠ {t(w as any)}</Text>
        ))}
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.stepsCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.stepsTitle, { color: theme.textMuted }]}>{t('blend_step_order')}</Text>
        {steps.map((step) => {
          const val = vals[step.key];
          const isZero = val < 0.05;
          return (
            <View key={step.key} style={[styles.stepRow, { borderBottomColor: theme.surfaceAlt }, isZero && styles.stepRowDisabled]}>
              <View style={[styles.stepDot, { backgroundColor: isZero ? theme.border : step.color }]} />
              <View style={styles.stepBody}>
                <Text style={[styles.stepLabel, { color: isZero ? theme.textMuted : theme.text }]}>
                  {step.label}
                </Text>
                <Text style={[styles.stepNote, { color: theme.textMuted }]}>{step.note}</Text>
              </View>
              <Text style={[styles.stepValue, { color: isZero ? theme.textMuted : theme.accent }]}>
                {isZero ? t('blend_step_skip') : toPressureDisplay(val, pressureUnit)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.resultCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.resultTitle, { color: theme.textMuted }]}>{t('blend_result_mix_verify')}</Text>
        <View style={styles.gasRow}>
          {[
            { label: 'O₂', value: result.resultMix.fO2, color: theme.accent },
            { label: 'He', value: result.resultMix.fHe, color: '#7C3AED' },
            { label: 'N₂', value: result.resultMix.fN2, color: '#008844' },
          ].map((g) => (
            <View key={g.label} style={styles.gasItem}>
              <Text style={[styles.gasPct, { color: g.color }]}>
                {(g.value * 100).toFixed(1)}%
              </Text>
              <Text style={[styles.gasLabel, { color: theme.textMuted }]}>{g.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {result.warnings.length > 0 && (
        <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
          {result.warnings.map((w, i) => (
            <Text key={i} style={[styles.warningText, { color: theme.warningText }]}>⚠ {t(w as any)}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { borderRadius: 10, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14 },
  stepsCard: {
    borderRadius: 12, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  stepsTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, gap: 12,
  },
  stepRowDisabled: { opacity: 0.45 },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepBody: { flex: 1 },
  stepLabel: { fontSize: 14, fontWeight: '600' },
  stepNote: { fontSize: 11, marginTop: 1 },
  stepValue: { fontSize: 15, fontWeight: '700' },
  resultCard: {
    borderRadius: 12, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  resultTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  gasRow: { flexDirection: 'row', justifyContent: 'space-around' },
  gasItem: { alignItems: 'center', gap: 4 },
  gasPct: { fontSize: 22, fontWeight: '700' },
  gasLabel: { fontSize: 12, fontWeight: '600' },
  warningBox: { borderRadius: 8, padding: 12, gap: 4 },
  warningText: { fontSize: 13 },
});
