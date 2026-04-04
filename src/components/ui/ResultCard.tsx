import { View, Text, StyleSheet } from 'react-native';

interface ResultCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  accent?: string;
  warning?: string;
}

export default function ResultCard({
  title,
  value,
  unit,
  subtitle,
  accent = '#0077CC',
  warning,
}: ResultCardProps) {
  const displayValue =
    typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: accent }]}>{displayValue}</Text>
          <Text style={styles.unit}> {unit}</Text>
        </View>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {!!warning && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠ {warning}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  accentBar: { width: 4 },
  body: { flex: 1, padding: 14 },
  title: { fontSize: 12, fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  value: { fontSize: 28, fontWeight: '700' },
  unit: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  warningText: { fontSize: 12, color: '#856404' },
});
