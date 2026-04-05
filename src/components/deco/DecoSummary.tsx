import { View, Text, StyleSheet } from 'react-native';
import { DecoResult } from '../../types/deco.types';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface DecoSummaryProps {
  result: DecoResult;
}

export default function DecoSummary({ result }: DecoSummaryProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const metrics = [
    {
      label: t('deco_tts'),
      value: `${result.tts}`,
      sub: t('deco_tts_sub'),
      color: theme.primary,
      warn: false,
    },
    {
      label: t('deco_total_deco'),
      value: `${result.totalDecoTime}`,
      sub: 'min',
      color: theme.accent,
      warn: false,
    },
    {
      label: 'CNS%',
      value: result.maxCns.toFixed(1),
      sub: '%',
      color: result.maxCns > 80 ? theme.errorText : result.maxCns > 50 ? '#CC5500' : '#008844',
      warn: result.maxCns > 80,
    },
    {
      label: 'OTU',
      value: result.maxOtu.toFixed(0),
      sub: t('deco_otu_units'),
      color: result.maxOtu > 400 ? theme.errorText : result.maxOtu > 250 ? '#CC5500' : '#7C3AED',
      warn: result.maxOtu > 400,
    },
  ];

  return (
    <View style={styles.grid}>
      {metrics.map((m) => (
        <View
          key={m.label}
          style={[
            styles.card,
            { backgroundColor: m.warn ? theme.warningBg : theme.surface, borderLeftColor: m.color },
          ]}
        >
          <Text style={[styles.label, { color: theme.textMuted }]}>{m.label}</Text>
          <Text style={[styles.value, { color: m.color }]}>{m.value}</Text>
          <Text style={[styles.sub, { color: theme.textMuted }]}>{m.sub}</Text>
          {m.warn && <Text style={{ fontSize: 14, marginTop: 4 }}>⚠</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  card: {
    width: '47%',
    borderRadius: 12, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    alignItems: 'center', borderLeftWidth: 4,
  },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  sub: { fontSize: 11, marginTop: 2 },
});
