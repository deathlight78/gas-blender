import { View, Text, StyleSheet } from 'react-native';
import { DecoStop } from '../../types/deco.types';

interface DecoTableProps {
  stops: DecoStop[];
  /** 각 정지까지 도달하는 누적 상승 시간(분) 포함 런타임 계산용 베이스 시간 */
  bottomRunTime: number;
  ascentRate: number;
}

export default function DecoTable({ stops, bottomRunTime, ascentRate }: DecoTableProps) {
  if (stops.length === 0) {
    return (
      <View style={styles.noDecoBox}>
        <Text style={styles.noDecoTitle}>감압 불필요 (NDL 이내)</Text>
        <Text style={styles.noDecoSub}>직접 상승 가능합니다.</Text>
      </View>
    );
  }

  // 각 정지 수심의 런타임 계산
  let runTime = bottomRunTime;
  // 바닥 → 첫 정지까지 상승 시간
  const firstStop = stops[0];
  const rowData: Array<{ stop: DecoStop; runTime: number }> = [];

  let prevDepth = firstStop.depth; // 첫 정지 도착 시점부터 계산
  for (const stop of stops) {
    const ascentMin = Math.ceil((prevDepth - stop.depth) / ascentRate);
    runTime += ascentMin + stop.time;
    rowData.push({ stop, runTime });
    prevDepth = stop.depth;
  }

  return (
    <View style={styles.card}>
      {/* 헤더 */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.depthCell, styles.headerText]}>수심</Text>
        <Text style={[styles.cell, styles.timeCell, styles.headerText]}>정지(분)</Text>
        <Text style={[styles.cell, styles.gasCell, styles.headerText]}>기체</Text>
        <Text style={[styles.cell, styles.rtCell, styles.headerText]}>런타임</Text>
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
            style={[styles.row, isShallow && styles.rowHighlight]}
          >
            <Text style={[styles.cell, styles.depthCell, styles.depthText]}>
              {stop.depth} m
            </Text>
            <Text style={[styles.cell, styles.timeCell, styles.timeText]}>
              {stop.time}
            </Text>
            <Text style={[styles.cell, styles.gasCell, styles.gasText]}>
              {gasMixLabel}
            </Text>
            <Text style={[styles.cell, styles.rtCell, styles.rtText]}>
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
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  noDecoTitle: { fontSize: 16, fontWeight: '700', color: '#166534' },
  noDecoSub: { fontSize: 13, color: '#4ADE80', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerRow: { backgroundColor: '#003366' },
  rowHighlight: { backgroundColor: '#EFF6FF' },
  cell: { paddingVertical: 12, paddingHorizontal: 10 },
  depthCell: { width: 72 },
  timeCell: { width: 72, alignItems: 'center' },
  gasCell: { flex: 1 },
  rtCell: { width: 72, alignItems: 'flex-end' },
  headerText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  depthText: { fontSize: 15, fontWeight: '700', color: '#003366' },
  timeText: { fontSize: 15, fontWeight: '700', color: '#0077CC', textAlign: 'center' },
  gasText: { fontSize: 13, color: '#334155' },
  rtText: { fontSize: 13, color: '#64748B', textAlign: 'right' },
});
