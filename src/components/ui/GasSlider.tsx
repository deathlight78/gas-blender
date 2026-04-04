import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface GasSliderProps {
  label: string;
  value: number;        // 0~1 분율
  onChange: (v: number) => void;
  min?: number;         // 분율 기준
  max?: number;         // 분율 기준
  step?: number;        // 분율 기준, 기본 0.01
  disabled?: boolean;
}

export default function GasSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  disabled = false,
}: GasSliderProps) {
  const pct = Math.round(value * 100);

  function clamp(v: number) {
    return Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  }

  function handleTextChange(text: string) {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) onChange(clamp(parsed / 100));
  }

  function handleDecrement() {
    onChange(clamp(value - step));
  }

  function handleIncrement() {
    onChange(clamp(value + step));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.stepBtn, disabled && styles.btnDisabled]}
          onPress={handleDecrement}
          disabled={disabled}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          value={String(pct)}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          editable={!disabled}
          selectTextOnFocus
        />

        <TouchableOpacity
          style={[styles.stepBtn, disabled && styles.btnDisabled]}
          onPress={handleIncrement}
          disabled={disabled}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>

        <Text style={styles.pctLabel}>%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${((value - min) / (max - min)) * 100}%` as any },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  stepBtnText: { fontSize: 20, color: '#0077CC', lineHeight: 24 },
  input: {
    width: 64,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    paddingVertical: 6,
  },
  inputDisabled: { backgroundColor: '#F1F5F9', color: '#94A3B8' },
  pctLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  track: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    backgroundColor: '#0077CC',
    borderRadius: 2,
  },
});
