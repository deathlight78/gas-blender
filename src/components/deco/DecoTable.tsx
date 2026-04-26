import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DecoStop } from '../../types/deco.types';
import { GasMix } from '../../types/gas.types';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface DecoTableProps {
  stops: DecoStop[];
  bottomRunTime: number;
  ascentRate: number;
  targetDepth: number;    // meters
  descentTime: number;    // minutes
  bottomGas: GasMix;
}

type Phase = 'descent' | 'bottom' | 'ascent' | 'stop';

interface Row {
  phase: Phase;
  depth: number;
  stopMin: number | null;
  runtime: number;
  gas: GasMix;
  ppO2: number | null;
  ead: number | null;
}

function calcPpO2(gas: GasMix, depth: number): number {
  return Math.round(gas.fO2 * (depth / 10 + 1) * 100) / 100;
}

function calcEAD(gas: GasMix, depth: number): number {
  const fN2 = Math.max(0, 1 - gas.fO2 - gas.fHe);
  const ata = depth / 10 + 1;
  return Math.max(0, Math.round((fN2 * ata / 0.79 - 1) * 10));
}

function sameGas(a: GasMix, b: GasMix): boolean {
  return Math.abs(a.fO2 - b.fO2) < 0.01 && Math.abs(a.fHe - b.fHe) < 0.01;
}

function gasShortLabel(mix: GasMix): string {
  if (mix.fHe > 0.001) {
    return `Tx${Math.round(mix.fO2 * 100)}/${Math.round(mix.fHe * 100)}`;
  }
  if (Math.abs(mix.fO2 - 0.21) < 0.005) return 'Air';
  return `EAN${Math.round(mix.fO2 * 100)}`;
}

const PHASE_CONFIG: Record<Phase, { icon: string; color: string }> = {
  descent: { icon: 'arrow-down-circle',  color: '#22AA55' },
  bottom:  { icon: 'swap-horizontal',    color: '#4488CC' },
  ascent:  { icon: 'trending-up',        color: '#9944CC' },
  stop:    { icon: 'pause-circle',       color: '#CC8800' },
};

export default function DecoTable({
  stops, bottomRunTime, ascentRate,
  targetDepth, descentTime, bottomGas,
}: DecoTableProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  if (stops.length === 0) {
    return (
      <View style={[styles.noDecoBox, { backgroundColor: theme.successBg, borderColor: theme.border }]}>
        <Text style={[styles.noDecoTitle, { color: theme.successText }]}>{t('deco_no_deco')}</Text>
        <Text style={[styles.noDecoSub,   { color: theme.successText }]}>{t('deco_no_deco_sub')}</Text>
      </View>
    );
  }

  // ── 전체 행 구성 ──────────────────────────────────────────
  const rows: Row[] = [];

  // 1. 하강
  rows.push({
    phase:   'descent',
    depth:   targetDepth,
    stopMin: null,
    runtime: Math.ceil(descentTime),
    gas:     bottomGas,
    ppO2:    null,
    ead:     null,
  });

  // 2. 바텀
  rows.push({
    phase:   'bottom',
    depth:   targetDepth,
    stopMin: null,
    runtime: bottomRunTime,
    gas:     bottomGas,
    ppO2:    calcPpO2(bottomGas, targetDepth),
    ead:     calcEAD(bottomGas, targetDepth),
  });

  // 3. 감압 정지 (기체 전환 시 ascent 행 삽입)
  let runTime  = bottomRunTime;
  let prevDepth = targetDepth;
  let prevGas   = bottomGas;

  for (const stop of stops) {
    const ascentMin = Math.ceil((prevDepth - stop.depth) / ascentRate);
    runTime += ascentMin;

    // 기체 전환 → ascent 행 (상승+전환 표시)
    if (!sameGas(prevGas, stop.gas)) {
      rows.push({
        phase:   'ascent',
        depth:   stop.depth,
        stopMin: null,
        runtime: runTime,
        gas:     stop.gas,
        ppO2:    null,
        ead:     null,
      });
    }

    runTime += stop.time;
    rows.push({
      phase:   'stop',
      depth:   stop.depth,
      stopMin: stop.time,
      runtime: runTime,
      gas:     stop.gas,
      ppO2:    calcPpO2(stop.gas, stop.depth),
      ead:     calcEAD(stop.gas, stop.depth),
    });

    prevDepth = stop.depth;
    prevGas   = stop.gas;
  }
  // ──────────────────────────────────────────────────────────

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      {/* 헤더 */}
      <View style={[styles.row, { backgroundColor: theme.primary }]}>
        <View style={styles.iconCell} />
        <Text style={[styles.depthCell, styles.hdr, styles.ctr]}>{t('deco_col_depth')}</Text>
        <Text style={[styles.stopCell,  styles.hdr, styles.ctr]}>{t('deco_col_stop')}</Text>
        <Text style={[styles.rtCell,    styles.hdr, styles.ctr]}>{t('deco_col_runtime')}</Text>
        <Text style={[styles.mixCell,   styles.hdr, styles.ctr]}>{t('deco_col_gas')}</Text>
        <Text style={[styles.ppo2Cell,  styles.hdr, styles.ctr]}>ppO₂</Text>
        <Text style={[styles.eadCell,   styles.hdr, styles.ctr]}>EAD</Text>
      </View>

      {rows.map((row, idx) => {
        const cfg      = PHASE_CONFIG[row.phase];
        const isShallow = row.phase === 'stop' && row.depth <= 6;
        const isLast   = idx === rows.length - 1;

        return (
          <View
            key={idx}
            style={[
              styles.row,
              !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
              isShallow && { backgroundColor: theme.infoBg },
            ]}
          >
            {/* 아이콘 */}
            <View style={styles.iconCell}>
              <Ionicons name={cfg.icon as any} size={15} color={cfg.color} />
            </View>

            {/* 수심 */}
            <Text style={[styles.depthCell, styles.dat, styles.ctr, { color: theme.primary, fontWeight: '700' }]}>
              {row.depth}m
            </Text>

            {/* 정지 시간 */}
            <Text style={[styles.stopCell, styles.dat, styles.ctr, { color: theme.accent, fontWeight: '700' }]}>
              {row.stopMin !== null ? String(row.stopMin) : '–'}
            </Text>

            {/* 런타임 */}
            <Text style={[styles.rtCell, styles.dat, styles.ctr, { color: theme.textMuted }]}>
              {row.runtime}
            </Text>

            {/* 믹스 */}
            <Text style={[styles.mixCell, styles.dat, styles.ctr, { color: theme.text }]}>
              {gasShortLabel(row.gas)}
            </Text>

            {/* ppO₂ */}
            <Text style={[styles.ppo2Cell, styles.dat, styles.ctr, { color: theme.textMuted }]}>
              {row.ppO2 !== null ? row.ppO2.toFixed(2) : '–'}
            </Text>

            {/* EAD */}
            <Text style={[styles.eadCell, styles.dat, styles.ctr, { color: theme.textMuted }]}>
              {row.ead !== null ? `${row.ead}m` : '–'}
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
  noDecoSub:   { fontSize: 13, marginTop: 4 },
  card: {
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 4 },

  // 아이콘 고정 + 데이터 6컬럼 flex 비율 분배
  // depth:stop:rt:mix:ppo2:ead = 2:2:2:3:2:2  (총 13 단위)
  // mix 컬럼은 "EAN50", "Tx21/35" 등 긴 텍스트를 수용하기 위해 1.5배
  iconCell:  { width: 22, alignItems: 'center' },
  depthCell: { flex: 2, paddingHorizontal: 3 },
  stopCell:  { flex: 2, paddingHorizontal: 3 },
  rtCell:    { flex: 2, paddingHorizontal: 3 },
  mixCell:   { flex: 3, paddingHorizontal: 3 },
  ppo2Cell:  { flex: 2, paddingHorizontal: 3 },
  eadCell:   { flex: 2, paddingHorizontal: 3 },

  hdr:   { fontSize: 11, fontWeight: '700', color: '#fff', paddingVertical: 10 },
  dat:   { fontSize: 12 },
  ctr:   { textAlign: 'center' },
});
