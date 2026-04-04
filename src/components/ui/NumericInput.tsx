import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface NumericInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  unit?: string;
  hint?: string;
  error?: string;
  editable?: boolean;
  containerStyle?: ViewStyle;
}

export default function NumericInput({
  label,
  value,
  onChangeText,
  unit,
  hint,
  error,
  editable = true,
  containerStyle,
}: NumericInputProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        {unit && (
          <Text style={[styles.unitBadge, { color: theme.accent, backgroundColor: theme.infoBg }]}>
            {unit}
          </Text>
        )}
      </View>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
          !editable && { backgroundColor: theme.inputDisabledBg, color: theme.textMuted },
          !!error && { borderColor: theme.errorText },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        editable={editable}
        placeholderTextColor={theme.textMuted}
      />
      {!!error && <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>}
      {!error && !!hint && <Text style={[styles.hintText, { color: theme.textMuted }]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: { fontSize: 13, fontWeight: '600' },
  unitBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: { fontSize: 12, marginTop: 4 },
  hintText: { fontSize: 12, marginTop: 4 },
});
