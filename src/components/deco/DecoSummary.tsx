import { View, Text, StyleSheet } from 'react-native';
import { DecoResult } from '../../types/deco.types';

interface DecoSummaryProps {
  result: DecoResult;
}

interface MetricItem {
  label: string;
  value: string;
  sub: string;
  color: string;
  warning?: boolean;
}

export default function DecoSummary({ result }: DecoSummaryProps) {
  const metrics: MetricItem[] = [
    {
      label: 'TTS',
      value: `${result.tts}`,
      sub: '분 (Time to Surface)',
      color: '#003366',
    },
    {
      label: '총 감압',
      value: `${result.totalDecoTime}`,
      sub: '분',
      color: '#0077CC',
    },
    {
      label: 'CNS%',
      value: `${result.maxCns.toFixed(1)}`,
      sub: '%',
      color: result.maxCns > 80 ? '#CC0000' : result.maxCns > 50 ? '#CC5500' : '#008844',
      warning: result.maxCns > 80,
    },
    {
      label: 'OTU',
      value: `${result.maxOtu.toFixed(0)}`,
      sub: '단위',
      color: result.maxOtu > 400 ? '#CC0000' : result.maxOtu > 250 ? '#CC5500' : '#7C3AED',
      warning: result.maxOtu > 400,
    },
  ];

  return (
    <View style={styles.grid}>
      {metrics.map((m) => (
        <View
          key={m.label}
          style={[styles.card, m.warning && styles.cardWarn]}
        >
          <Text style={styles.label}>{m.label}</Text>
          <Text style={[styles.value, { color: m.color }]}>{m.value}</Text>
          <Text style={styles.sub}>{m.sub}</Text>
          {m.warning && <Text style={styles.warnText}>⚠</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0077CC',
  },
  cardWarn: { borderLeftColor: '#CC0000', backgroundColor: '#FEF2F2' },
  label: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  sub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  warnText: { fontSize: 14, marginTop: 4 },
});
