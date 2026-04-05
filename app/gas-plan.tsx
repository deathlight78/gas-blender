import { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import DrumRollPicker from '../src/components/ui/DrumRollPicker';
import GasSlider from '../src/components/ui/GasSlider';
import ResultCard from '../src/components/ui/ResultCard';
import SectionHeader from '../src/components/ui/SectionHeader';
import { calcSAC, calcGasEndurance } from '../src/lib/gas/sac-rate';
import { buildRange } from '../src/lib/utils/ranges';
import { useSettingsStore } from '../src/store/settings.store';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';

interface TankRow {
  id: number;
  fO2: number;
  fHe: number;
  volume: number;
  pressure: number;
  reserve: number;
}

let nextTankId = 1;

function toMeters(v: number, unit: 'ft' | 'm') { return unit === 'ft' ? v * 0.3048 : v; }
function toBar(v: number, unit: 'bar' | 'psi') { return unit === 'psi' ? v / 14.5038 : v; }

export default function GasPlanScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { depthUnit, pressureUnit } = useSettingsStore();
  const theme = useAppTheme();
  const { t } = useTranslation();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));

  // SAC Rate 상태
  const [sacPressureUsed, setSacPressureUsed] = useState(100);
  const [sacTankVolume, setSacTankVolume]     = useState(12);
  const [sacAvgDepth, setSacAvgDepth]         = useState(20);
  const [sacDiveTime, setSacDiveTime]         = useState(45);

  // 가스 사용시간 상태
  const [endCurrentPressure, setEndCurrentPressure] = useState(200);
  const [endReserve, setEndReserve]                 = useState(50);
  const [endTankVolume, setEndTankVolume]           = useState(12);
  const [endDepth, setEndDepth]                     = useState(30);
  const [endSacRate, setEndSacRate]                 = useState(20);

  // 탱크 계획 상태
  const [planDepth, setPlanDepth]       = useState(40);
  const [planSacRate, setPlanSacRate]   = useState(20);
  const [tanks, setTanks] = useState<TankRow[]>([
    { id: nextTankId++, fO2: 0.21, fHe: 0,    volume: 12, pressure: 200, reserve: 50 },
    { id: nextTankId++, fO2: 0.50, fHe: 0,    volume: 11, pressure: 200, reserve: 50 },
    { id: nextTankId++, fO2: 1.00, fHe: 0,    volume: 7,  pressure: 200, reserve: 50 },
  ]);

  const depthLabel    = depthUnit    === 'ft'  ? 'ft'  : 'm';
  const pressureLabel = pressureUnit === 'psi' ? 'PSI' : 'bar';

  // 범위 배열
  const depthItems = useMemo(
    () => depthUnit === 'ft' ? buildRange(0, 330, 3) : buildRange(0, 100, 1), [depthUnit],
  );
  const pressureItems = useMemo(
    () => pressureUnit === 'psi' ? buildRange(50, 4500, 50) : buildRange(5, 300, 5), [pressureUnit],
  );
  const endPressureItems = useMemo(
    () => pressureUnit === 'psi' ? buildRange(0, 4500, 50) : buildRange(0, 300, 5), [pressureUnit],
  );
  const endReserveItems = useMemo(
    () => pressureUnit === 'psi' ? buildRange(0, 2900, 50) : buildRange(0, 200, 5), [pressureUnit],
  );
  const tankPressureItems = endPressureItems;
  const tankReserveItems  = endReserveItems;
  const tankVolumeItems   = useMemo(() => buildRange(1, 30, 1), []);
  const diveTimeItems     = useMemo(() => buildRange(1, 180, 1), []);
  const sacRateItems      = useMemo(() => buildRange(5, 60, 1), []);

  // SAC 계산
  const sacPressureBar = useMemo(
    () => toBar(sacPressureUsed, pressureUnit), [sacPressureUsed, pressureUnit],
  );
  const sacResult = useMemo(() => {
    if (sacPressureBar <= 0 || sacTankVolume <= 0 || sacAvgDepth < 0 || sacDiveTime <= 0) return null;
    return calcSAC({
      pressureUsed: sacPressureBar, tankVolume: sacTankVolume,
      avgDepth: toMeters(sacAvgDepth, depthUnit), diveTime: sacDiveTime,
    });
  }, [sacPressureBar, sacTankVolume, sacAvgDepth, sacDiveTime, depthUnit]);

  // 가스 사용시간 계산
  const endCurrentBar = useMemo(() => toBar(endCurrentPressure, pressureUnit), [endCurrentPressure, pressureUnit]);
  const endReserveBar = useMemo(() => toBar(endReserve, pressureUnit),         [endReserve, pressureUnit]);
  const enduranceResult = useMemo(() => {
    if (endCurrentBar <= 0 || endTankVolume <= 0 || endDepth < 0 || endSacRate <= 0) return null;
    return calcGasEndurance({
      currentPressure: endCurrentBar, reservePressure: endReserveBar,
      tankVolume: endTankVolume, depth: toMeters(endDepth, depthUnit), sacRate: endSacRate,
    });
  }, [endCurrentBar, endReserveBar, endTankVolume, endDepth, endSacRate, depthUnit]);

  // 탱크별 계산
  const planDepthM  = useMemo(() => toMeters(planDepth, depthUnit), [planDepth, depthUnit]);
  const tankResults = useMemo(() => tanks.map((tank) => {
    const startBar   = toBar(tank.pressure, pressureUnit);
    const reserveBar = toBar(tank.reserve,  pressureUnit);
    if (startBar <= 0 || tank.volume <= 0 || planSacRate <= 0) return null;
    return calcGasEndurance({
      currentPressure: startBar, reservePressure: reserveBar,
      tankVolume: tank.volume, depth: planDepthM, sacRate: planSacRate,
    });
  }), [tanks, pressureUnit, planDepthM, planSacRate]);

  function addTank() {
    setTanks(p => [...p, { id: nextTankId++, fO2: 0.21, fHe: 0, volume: 12, pressure: 200, reserve: 50 }]);
  }
  function removeTank(id: number) {
    setTanks(p => p.filter(t => t.id !== id));
  }
  function updateTank(id: number, patch: Partial<TankRow>) {
    setTanks(p => p.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* ── SAC Rate ── */}
      <SectionHeader title={t('calc_sac')} subtitle={t('calc_sac_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker label={t('calc_sac_pressure_used')} items={pressureItems}    value={sacPressureUsed} onChange={setSacPressureUsed} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker label={t('calc_sac_tank_volume')}   items={tankVolumeItems} value={sacTankVolume}   onChange={setSacTankVolume} />
        </View>
        <View style={styles.pickerRow}>
          <DrumRollPicker label={t('calc_sac_avg_depth')}  items={depthItems}    value={sacAvgDepth}  onChange={setSacAvgDepth} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker label={t('calc_sac_dive_time')}  items={diveTimeItems} value={sacDiveTime}  onChange={setSacDiveTime} />
        </View>
      </View>
      {sacResult ? (
        <>
          <ResultCard title={t('calc_sac_result')}       value={sacResult.sacRate.toFixed(1)}         unit="L/min" subtitle={`${sacAvgDepth}${depthLabel} ${t('gplan_avg_depth_suffix')}`} accent={theme.accent} />
          <ResultCard title={t('calc_sac_gas_consumed')} value={sacResult.totalGasConsumed.toFixed(0)} unit="L"     subtitle={`${sacPressureUsed} ${pressureLabel} × ${sacTankVolume} L`}   accent={theme.accentSub} />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_check_input')}</Text>
      )}

      {/* ── 가스 사용시간 ── */}
      <SectionHeader title={t('calc_endurance')} subtitle={t('calc_endurance_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          <DrumRollPicker label={t('calc_endurance_current_pressure')} items={endPressureItems} value={endCurrentPressure} onChange={setEndCurrentPressure} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker label={t('calc_endurance_reserve')}          items={endReserveItems}  value={endReserve}         onChange={setEndReserve} />
        </View>
        <View style={styles.pickerRow}>
          <DrumRollPicker label={t('calc_sac_tank_volume')}   items={tankVolumeItems} value={endTankVolume} onChange={setEndTankVolume} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker label={t('calc_endurance_depth')}   items={depthItems}      value={endDepth}      onChange={setEndDepth} />
        </View>
        <View style={styles.pickerRow}>
          <DrumRollPicker label="SAC Rate" items={sacRateItems} value={endSacRate} onChange={setEndSacRate} />
        </View>
      </View>
      {enduranceResult ? (
        <>
          <ResultCard
            title={t('calc_endurance_result')}
            value={enduranceResult.enduranceMin < 0 ? '0' : enduranceResult.enduranceMin.toFixed(1)}
            unit="min"
            subtitle={`${endDepth}${depthLabel} / SAC ${endSacRate} L/min`}
            accent="#008844"
            warning={enduranceResult.enduranceMin <= 0 ? t('calc_err_reserve') : undefined}
          />
          <ResultCard
            title={t('calc_endurance_usable_gas')}
            value={enduranceResult.usableGasL.toFixed(0)}
            unit="L"
            subtitle={`${endCurrentPressure} ${pressureLabel} - ${endReserve} ${pressureLabel} × ${endTankVolume} L`}
            accent={theme.accentSub}
          />
        </>
      ) : (
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>{t('calc_check_input')}</Text>
      )}

      {/* ── 탱크 계획 ── */}
      <SectionHeader title={t('gplan_tanks')} subtitle={t('gplan_tanks_subtitle')} />

      {/* 공통 조건 */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.condLabel, { color: theme.textSecondary }]}>{t('gplan_conditions')}</Text>
        <View style={styles.pickerRow}>
          <DrumRollPicker label={t('gplan_depth')} items={depthItems} value={planDepth} onChange={setPlanDepth} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <DrumRollPicker label="SAC Rate (L/min)" items={sacRateItems} value={planSacRate} onChange={setPlanSacRate} />
        </View>
      </View>

      {/* 탱크 목록 */}
      {tanks.map((tank, idx) => {
        const res  = tankResults[idx];
        const fN2  = Math.max(0, 1 - tank.fO2 - tank.fHe);
        const mixLabel =
          tank.fHe > 0           ? `Trimix ${(tank.fO2*100).toFixed(0)}/${(tank.fHe*100).toFixed(0)}`
          : tank.fO2 > 0.2101    ? `EAN ${(tank.fO2*100).toFixed(0)}`
          : tank.fO2 < 0.2099    ? `Hypoxic ${(tank.fO2*100).toFixed(0)}`
          : 'Air';

        return (
          <View key={tank.id} style={[styles.tankCard, { backgroundColor: theme.surface }]}>
            {/* 헤더 */}
            <View style={styles.tankHeader}>
              <View style={styles.tankTitleRow}>
                <Text style={[styles.tankTitle, { color: theme.text }]}>
                  {t('gplan_tank_label')} {idx + 1}
                </Text>
                <View style={[styles.mixBadge, { backgroundColor: theme.infoBg }]}>
                  <Text style={[styles.mixBadgeText, { color: theme.accent }]}>{mixLabel}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeTank(tank.id)}>
                <Text style={[styles.removeBtn, { color: theme.textMuted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 가스 조성 */}
            <GasSlider
              label="O₂ %"
              value={tank.fO2}
              onChange={(v) => updateTank(tank.id, { fO2: v })}
              min={0.04}
              max={Math.max(0.04, 1 - tank.fHe)}
              step={0.01}
            />
            <GasSlider
              label="He %"
              value={tank.fHe}
              onChange={(v) => updateTank(tank.id, { fHe: v })}
              min={0}
              max={Math.max(0, 1 - tank.fO2)}
              step={0.01}
            />
            <View style={[styles.n2Row, { borderTopColor: theme.surfaceAlt }]}>
              <Text style={[styles.n2Label, { color: theme.textMuted }]}>N₂ {(fN2*100).toFixed(0)}%</Text>
            </View>

            {/* 탱크 파라미터 */}
            <View style={styles.pickerRow}>
              <DrumRollPicker
                label={t('gplan_volume')}
                items={tankVolumeItems}
                value={tank.volume}
                onChange={(v) => updateTank(tank.id, { volume: v })}
              />
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <DrumRollPicker
                label={`${t('gplan_start_pressure')} (${pressureLabel})`}
                items={tankPressureItems}
                value={tank.pressure}
                onChange={(v) => updateTank(tank.id, { pressure: v })}
              />
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <DrumRollPicker
                label={`${t('gplan_reserve')} (${pressureLabel})`}
                items={tankReserveItems}
                value={tank.reserve}
                onChange={(v) => updateTank(tank.id, { reserve: v })}
              />
            </View>

            {/* 계산 결과 */}
            {res && (
              <View style={[styles.tankResult, { backgroundColor: theme.surfaceAlt }]}>
                <View style={styles.tankResultItem}>
                  <Text style={[styles.tankResultValue, { color: res.usableGasL > 0 ? theme.accent : theme.errorText }]}>
                    {res.usableGasL > 0 ? res.usableGasL.toFixed(0) : '0'} L
                  </Text>
                  <Text style={[styles.tankResultLabel, { color: theme.textMuted }]}>{t('gplan_usable_gas')}</Text>
                </View>
                <View style={[styles.tankResultDivider, { backgroundColor: theme.border }]} />
                <View style={styles.tankResultItem}>
                  <Text style={[styles.tankResultValue, { color: res.enduranceMin > 0 ? '#008844' : theme.errorText }]}>
                    {res.enduranceMin > 0 ? res.enduranceMin.toFixed(1) : '0'} min
                  </Text>
                  <Text style={[styles.tankResultLabel, { color: theme.textMuted }]}>
                    {t('gplan_time')} @ {planDepth}{depthLabel}
                  </Text>
                </View>
              </View>
            )}
            {res && res.usableGasL <= 0 && (
              <Text style={[styles.warnText, { color: theme.warningText }]}>{t('calc_err_reserve')}</Text>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={[styles.addBtn, { borderColor: theme.accent }]} onPress={addTank}>
        <Text style={[styles.addBtnText, { color: theme.accent }]}>{t('gplan_add_tank')}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    borderRadius: 12, paddingTop: 10, paddingHorizontal: 6, paddingBottom: 8,
    marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  pickerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 2 },
  divider: { width: 1, alignSelf: 'stretch', marginHorizontal: 2, marginTop: 18, backgroundColor: 'transparent' },
  emptyHint: { fontSize: 13, textAlign: 'center', marginVertical: 8 },
  condLabel: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, marginBottom: 2 },
  tankCard: {
    borderRadius: 12, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 12,
    marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  tankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tankTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tankTitle: { fontSize: 15, fontWeight: '700' },
  mixBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  mixBadgeText: { fontSize: 11, fontWeight: '600' },
  removeBtn: { fontSize: 16, paddingHorizontal: 4 },
  n2Row: { flexDirection: 'row', justifyContent: 'center', paddingTop: 6, borderTopWidth: 1, marginBottom: 10 },
  n2Label: { fontSize: 12 },
  tankResult: {
    flexDirection: 'row', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 8, marginTop: 10,
  },
  tankResultItem: { flex: 1, alignItems: 'center' },
  tankResultDivider: { width: 1, alignSelf: 'stretch', marginHorizontal: 8 },
  tankResultValue: { fontSize: 20, fontWeight: '700' },
  tankResultLabel: { fontSize: 11, marginTop: 2, textAlign: 'center' },
  warnText: { fontSize: 12, marginTop: 6, textAlign: 'center' },
  addBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  addBtnText: { fontWeight: '600', fontSize: 14 },
});
