import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useSessionStore } from '../../store/session.store';
import { calcSessionCarryover } from '../../lib/deco/cns-recovery';

const OTU_DAILY_LIMIT = 300;
const INTERVAL_STEP = 15;   // min
const INTERVAL_MIN  = 0;
const INTERVAL_MAX  = 480;  // 8h

function otuBarColor(otu: number): string {
  if (otu > 270) return '#CC2200';
  if (otu > 200) return '#CC8800';
  return '#22AA55';
}

export default function SessionPanel() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { entries, removeEntry, updateSurfaceInterval, clearSession } = useSessionStore();
  const { cns: cumCns, otu: cumOtu } = calcSessionCarryover(entries);
  const otuPct = Math.min(100, (cumOtu / OTU_DAILY_LIMIT) * 100);

  function handleClear() {
    Alert.alert(t('session_clear'), t('session_clear_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('session_clear'), style: 'destructive', onPress: clearSession },
    ]);
  }

  if (entries.length === 0) {
    return (
      <View style={[styles.emptyBox, { borderColor: theme.border }]}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>{t('session_empty')}</Text>
      </View>
    );
  }

  return (
    <View>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        return (
          <View key={entry.id} style={[styles.entryCard, { backgroundColor: theme.surface }]}>
            {/* 헤더 */}
            <View style={[styles.entryHeader, { borderBottomColor: theme.surfaceAlt }]}>
              <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                <Text style={styles.badgeText}>{index + 1}</Text>
              </View>
              <View style={styles.entryTitleWrap}>
                <Text style={[styles.entryTitle, { color: theme.text }]}>
                  {t('session_dive_n', { n: String(index + 1) })}
                </Text>
                <Text style={[styles.entrySubtitle, { color: theme.textMuted }]}>
                  {entry.depth}m · {entry.bottomTime}min · TTS {entry.tts}min
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.removeBtn, { backgroundColor: theme.warningBg }]}
                onPress={() => removeEntry(entry.id)}
              >
                <Text style={[styles.removeBtnText, { color: theme.errorText }]}>
                  {t('session_remove')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* OTU · CNS · 감압 */}
            <View style={[styles.metrics, { borderBottomColor: theme.surfaceAlt }]}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>OTU</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>
                  {entry.diveOtu.toFixed(0)}
                </Text>
              </View>
              <View style={[styles.metricDivider, { backgroundColor: theme.surfaceAlt }]} />
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>CNS%</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>
                  {entry.diveCns.toFixed(1)}%
                </Text>
              </View>
              <View style={[styles.metricDivider, { backgroundColor: theme.surfaceAlt }]} />
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>감압</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>
                  {entry.totalDecoTime}min
                </Text>
              </View>
            </View>

            {/* 수면 휴식 */}
            <View style={styles.intervalRow}>
              <Text style={[styles.intervalLabel, { color: theme.textMuted }]}>
                ↓ {t('session_surface_interval')}{isLast ? ` (${t('session_this_dive')} 전)` : ''}
              </Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[styles.stepBtn, { backgroundColor: theme.surfaceAlt }]}
                  onPress={() =>
                    updateSurfaceInterval(
                      entry.id,
                      Math.max(INTERVAL_MIN, entry.surfaceIntervalMin - INTERVAL_STEP)
                    )
                  }
                >
                  <Text style={[styles.stepBtnText, { color: theme.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.intervalVal, { color: theme.text }]}>
                  {entry.surfaceIntervalMin}min
                </Text>
                <TouchableOpacity
                  style={[styles.stepBtn, { backgroundColor: theme.surfaceAlt }]}
                  onPress={() =>
                    updateSurfaceInterval(
                      entry.id,
                      Math.min(INTERVAL_MAX, entry.surfaceIntervalMin + INTERVAL_STEP)
                    )
                  }
                >
                  <Text style={[styles.stepBtnText, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      {/* 누적 요약 카드 */}
      <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.summaryTitle, { color: theme.text }]}>{t('session_cumulative')}</Text>

        {/* OTU 프로그레스 바 */}
        <View style={styles.otuRow}>
          <Text style={[styles.otuRowLabel, { color: theme.textMuted }]}>OTU</Text>
          <View style={[styles.otuBarBg, { backgroundColor: theme.surfaceAlt }]}>
            <View
              style={[
                styles.otuBarFill,
                { width: `${otuPct}%`, backgroundColor: otuBarColor(cumOtu) },
              ]}
            />
          </View>
          <Text style={[styles.otuRowValue, { color: otuBarColor(cumOtu) }]}>
            {cumOtu.toFixed(0)} / {OTU_DAILY_LIMIT}
          </Text>
        </View>
        {cumOtu > 200 && (
          <Text style={[styles.otuWarning, { color: otuBarColor(cumOtu) }]}>
            {t('session_otu_warning', {
              otu: cumOtu.toFixed(0),
              pct: String(Math.round(otuPct)),
            })}
          </Text>
        )}

        {/* CNS% */}
        <View style={styles.cnsRow}>
          <Text style={[styles.otuRowLabel, { color: theme.textMuted }]}>
            {t('session_total_cns')}
          </Text>
          <Text
            style={[
              styles.cnsValue,
              { color: cumCns > 80 ? '#CC2200' : theme.accent },
            ]}
          >
            {cumCns.toFixed(1)}%
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.clearBtn, { borderColor: theme.warningText }]}
          onPress={handleClear}
        >
          <Text style={[styles.clearBtnText, { color: theme.warningText }]}>
            {t('session_clear')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyBox: {
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10,
    paddingVertical: 20, alignItems: 'center',
  },
  emptyText: { fontSize: 13 },

  entryCard: {
    borderRadius: 12, marginBottom: 8, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1,
  },
  badge: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  entryTitleWrap: { flex: 1 },
  entryTitle: { fontSize: 13, fontWeight: '700' },
  entrySubtitle: { fontSize: 11, marginTop: 1 },
  removeBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  removeBtnText: { fontSize: 11, fontWeight: '600' },

  metrics: {
    flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1,
  },
  metricItem: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  metricLabel: { fontSize: 10, marginBottom: 2 },
  metricValue: { fontSize: 14, fontWeight: '600' },
  metricDivider: { width: 1, marginVertical: 4 },

  intervalRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  intervalLabel: { fontSize: 12, flex: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 16, fontWeight: '600' },
  intervalVal: { fontSize: 14, fontWeight: '600', minWidth: 58, textAlign: 'center' },

  summaryCard: {
    borderRadius: 12, padding: 14, marginBottom: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    gap: 10,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700' },

  otuRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  otuRowLabel: { fontSize: 12, width: 44 },
  otuBarBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  otuBarFill: { height: '100%', borderRadius: 4 },
  otuRowValue: { fontSize: 12, fontWeight: '600', minWidth: 72, textAlign: 'right' },
  otuWarning: { fontSize: 12 },

  cnsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cnsValue: { fontSize: 16, fontWeight: '700' },

  clearBtn: {
    borderWidth: 1, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', marginTop: 2,
  },
  clearBtnText: { fontSize: 13, fontWeight: '600' },
});
