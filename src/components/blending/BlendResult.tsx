import { View, Text, StyleSheet } from 'react-native';
import { OCBlendResult } from '../../types/blending.types';
import { PressureUnit } from '../../types/gas.types';

interface BlendResultProps {
  result: OCBlendResult | null;
  pressureUnit: PressureUnit;
}

function toPressureDisplay(bar: number, unit: PressureUnit) {
  const val = unit === 'psi' ? bar * 14.5038 : bar;
  return `${val.toFixed(1)} ${unit}`;
}

const STEPS = [
  { key: 'addHePressure' as const, label: '① He 주입', color: '#7C3AED', note: '헬륨 먼저 주입' },
  { key: 'addO2Pressure' as const, label: '② O₂ 주입', color: '#0077CC', note: '산소 다음 주입' },
  { key: 'addTopPressure' as const, label: '③ Air 탑업', color: '#008844', note: '마지막으로 공기 채우기' },
];

export default function BlendResult({ result, pressureUnit }: BlendResultProps) {
  if (!result) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>계산 결과가 여기에 표시됩니다</Text>
      </View>
    );
  }

  const values = {
    addHePressure: result.addHePressure,
    addO2Pressure: result.addO2Pressure,
    addTopPressure: result.addTopPressure,
  };

  return (
    <View>
      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>주입 순서</Text>
        {STEPS.map((step) => {
          const val = values[step.key];
          const isZero = val < 0.05;
          return (
            <View key={step.key} style={[styles.stepRow, isZero && styles.stepRowDisabled]}>
              <View style={[styles.stepDot, { backgroundColor: isZero ? '#CBD5E1' : step.color }]} />
              <View style={styles.stepBody}>
                <Text style={[styles.stepLabel, isZero && styles.stepLabelDisabled]}>
                  {step.label}
                </Text>
                <Text style={styles.stepNote}>{step.note}</Text>
              </View>
              <Text style={[styles.stepValue, isZero && styles.stepValueDisabled]}>
                {isZero ? '불필요' : toPressureDisplay(val, pressureUnit)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>최종 혼합비 (검증)</Text>
        <View style={styles.gasRow}>
          {[
            { label: 'O₂', value: result.resultMix.fO2, color: '#0077CC' },
            { label: 'He', value: result.resultMix.fHe, color: '#7C3AED' },
            { label: 'N₂', value: result.resultMix.fN2, color: '#008844' },
          ].map((g) => (
            <View key={g.label} style={styles.gasItem}>
              <Text style={[styles.gasPct, { color: g.color }]}>
                {(g.value * 100).toFixed(1)}%
              </Text>
              <Text style={styles.gasLabel}>{g.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {result.warnings.length > 0 && (
        <View style={styles.warningBox}>
          {result.warnings.map((w, i) => (
            <Text key={i} style={styles.warningText}>⚠ {w}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: { color: '#94A3B8', fontSize: 14 },
  stepsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  stepsTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 12 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  stepRowDisabled: { opacity: 0.45 },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepBody: { flex: 1 },
  stepLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  stepLabelDisabled: { color: '#94A3B8' },
  stepNote: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  stepValue: { fontSize: 15, fontWeight: '700', color: '#0077CC' },
  stepValueDisabled: { color: '#94A3B8' },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  resultTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 12 },
  gasRow: { flexDirection: 'row', justifyContent: 'space-around' },
  gasItem: { alignItems: 'center', gap: 4 },
  gasPct: { fontSize: 22, fontWeight: '700' },
  gasLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  warningText: { fontSize: 13, color: '#856404' },
});
