import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

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
  accent,
  warning,
}: ResultCardProps) {
  const theme = useAppTheme();
  const cardAccent = accent ?? theme.accent;
  const displayValue =
    typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={[styles.accentBar, { backgroundColor: cardAccent }]} />
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: cardAccent }]}>{displayValue}</Text>
          <Text style={[styles.unit, { color: theme.textMuted }]}> {unit}</Text>
        </View>
        {!!subtitle && <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
        {!!warning && (
          <View style={[styles.warningBanner, { backgroundColor: theme.warningBg }]}>
            <Text style={[styles.warningText, { color: theme.warningText }]}>⚠ {warning}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  value: { fontSize: 28, fontWeight: '700' },
  unit: { fontSize: 14, fontWeight: '500' },
  subtitle: { fontSize: 12, marginTop: 2 },
  warningBanner: { borderRadius: 6, padding: 8, marginTop: 8 },
  warningText: { fontSize: 12 },
});
