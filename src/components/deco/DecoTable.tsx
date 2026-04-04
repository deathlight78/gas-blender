import { View, Text, StyleSheet } from 'react-native';
import { DecoStop } from '../../types/deco.types';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface DecoTableProps {
  stops: DecoStop[];
  bottomRunTime: number;
  ascentRate: number;
}

export default function DecoTable({ stops, bottomRunTime, ascentRate }: DecoTableProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  if (stops.length === 0) {
    return (
      <View style={[styles.noDecoBox, { backgroundColor: theme.successBg, borderColor: theme.border }]}>
        <Text style={[styles.noDecoTitle, { color: theme.successText }]}>{t('deco_no_deco')}</Text>
        <Text style={[styles.noDecoSub, { color: theme.successText }]}>{t('deco_no_deco_sub')}</Text>
      </View>
    );
  }

  let runTime = bottomRunTime;
  let prevDepth = stops[0].depth;
  const rowData: Array<{ stop: DecoStop; runTime: number }> = [];

  for (const stop of stops) {
    const ascentMin = Math.ceil((prevDepth - stop.depth) / ascentRate);
    runTime += ascentMin + stop.time;
    rowData.push({ stop, runTime });
    prevDepth = stop.depth;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={[styles.row, styles.headerRow, { backgroundColor: theme.primary }]}>
        <Text style={[styles.cell, styles.depthCell, styles.headerText]}>{t('deco_col_depth')}</Text>
        <Text style={[styles.cell, styles.timeCell, styles.headerText]}>{t('deco_col_stop')}</Text>
        <Text style={[styles.cell, styles.gasCell, styles.headerText]}>{t('deco_col_gas')}</Text>
        <Text style={[styles.cell, styles.rtCell, styles.headerText]}>{t('deco_col_runtime')}</Text>
      </View>

      {rowData.map(({ stop, runTime: rt }, idx) => {
        const gasMixLabel =
          stop.gas.fHe > 0
            ? `Tx ${(stop.gas.fO2 * 100).toFixed(0)}/${(stop.gas.fHe * 100).toFixed(0)}`
            : `EAN ${(stop.gas.fO2 * 100).toFixed(0)}`;
        const isShallow = stop.depth <= 6;

        return (
          <View
            key={idx}
            style={[
              styles.row,
              { borderBottomColor: theme.border },
              isShallow && { backgroundColor: theme.infoBg },
            ]}
          >
            <Text style={[styles.cell, styles.depthCell, { color: theme.primary, fontWeight: '700', fontSize: 15 }]}>
              {stop.depth} m
            </Text>
            <Text style={[styles.cell, styles.timeCell, { color: theme.accent, fontWeight: '700', fontSize: 15, textAlign: 'center' }]}>
              {stop.time}
            </Text>
            <Text style={[styles.cell, styles.gasCell, { color: theme.text, fontSize: 13 }]}>
              {gasMixLabel}
            </Text>
            <Text style={[styles.cell, styles.rtCell, { color: theme.textMuted, fontSize: 13, textAlign: 'right' }]}>
              {rt} min
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  noDecoBox: {
    borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1,
  },
  noDecoTitle: { fontSize: 16, fontWeight: '700' },
  noDecoSub: { fontSize: 13, marginTop: 4 },
  card: { borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  row: { flexDirection: 'row', borderBottomWidth: 1 },
  headerRow: {},
  cell: { paddingVertical: 12, paddingHorizontal: 10 },
  depthCell: { width: 72 },
  timeCell: { width: 72 },
  gasCell: { flex: 1 },
  rtCell: { width: 72 },
  headerText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
