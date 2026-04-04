import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';

interface NumericInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  unit?: string;
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
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
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {unit && <Text style={styles.unitBadge}>{unit}</Text>}
      </View>
      <TextInput
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          !!error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        editable={editable}
        placeholderTextColor="#AAB4BF"
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!error && !!hint && <Text style={styles.hintText}>{hint}</Text>}
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
  label: { fontSize: 13, fontWeight: '600', color: '#334155' },
  unitBadge: {
    fontSize: 12,
    color: '#0077CC',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1E293B',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  inputError: { borderColor: '#CC0000' },
  errorText: { fontSize: 12, color: '#CC0000', marginTop: 4 },
  hintText: { fontSize: 12, color: '#64748B', marginTop: 4 },
});
