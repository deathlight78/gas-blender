import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface GasSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
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
  const theme = useAppTheme();
  const pct = Math.round(value * 100);

  function clamp(v: number) {
    return Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  }

  function handleTextChange(text: string) {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) onChange(clamp(parsed / 100));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.infoBg }, disabled && styles.btnDisabled]}
          onPress={() => onChange(clamp(value - step))}
          disabled={disabled}
        >
          <Text style={[styles.stepBtnText, { color: theme.accent }]}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.text,
            },
            disabled && { backgroundColor: theme.inputDisabledBg, color: theme.textMuted },
          ]}
          value={String(pct)}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          editable={!disabled}
          selectTextOnFocus
        />

        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.infoBg }, disabled && styles.btnDisabled]}
          onPress={() => onChange(clamp(value + step))}
          disabled={disabled}
        >
          <Text style={[styles.stepBtnText, { color: theme.accent }]}>+</Text>
        </TouchableOpacity>

        <Text style={[styles.pctLabel, { color: theme.textMuted }]}>%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.fill,
            { backgroundColor: theme.accent, width: `${((value - min) / (max - min)) * 100}%` as any },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.4 },
  stepBtnText: { fontSize: 20, lineHeight: 24 },
  input: {
    width: 64,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 6,
  },
  pctLabel: { fontSize: 14, fontWeight: '500' },
  track: { height: 4, borderRadius: 2, marginTop: 10, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2 },
});
