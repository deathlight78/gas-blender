import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import NumericInput from '../src/components/ui/NumericInput';
import GasSlider from '../src/components/ui/GasSlider';
import SectionHeader from '../src/components/ui/SectionHeader';
import DecoTable from '../src/components/deco/DecoTable';
import DecoSummary from '../src/components/deco/DecoSummary';
import { planDeco } from '../src/lib/deco/deco-planner';
import { DecoResult, DecoInput } from '../src/types/deco.types';
import { GasMix } from '../src/types/gas.types';
import { useSettingsStore } from '../src/store/settings.store';

interface DecoGasRow {
  id: number;
  switchDepth: string;
  fO2: number;
  fHe: number;
}

let nextId = 1;

export default function DecoScreen() {
  const { gfLow, gfHigh, ascentRate, descentRate, depthUnit } = useSettingsStore();

  // 다이브 프로파일 입력
  const [targetDepth, setTargetDepth] = useState('40');
  const [bottomTime, setBottomTime] = useState('30');

  // 바닥 기체
  const [bottomFO2, setBottomFO2] = useState(0.21);
  const [bottomFHe, setBottomFHe] = useState(0.35);

  // GF 오버라이드
  const [gfLoStr, setGfLoStr] = useState(String(Math.round(gfLow * 100)));
  const [gfHiStr, setGfHiStr] = useState(String(Math.round(gfHigh * 100)));

  // 감압 기체 목록
  const [decoGases, setDecoGases] = useState<DecoGasRow[]>([
    { id: nextId++, switchDepth: '21', fO2: 0.5, fHe: 0 },
    { id: nextId++, switchDepth: '6', fO2: 1.0, fHe: 0 },
  ]);

  // 결과
  const [result, setResult] = useState<DecoResult | null>(null);
  const [bottomRunTime, setBottomRunTime] = useState(0);

  function toMeters(v: string) {
    const n = parseFloat(v) || 0;
    return depthUnit === 'ft' ? n * 0.3048 : n;
  }

  function addDecoGas() {
    setDecoGases((prev) => [
      ...prev,
      { id: nextId++, switchDepth: '9', fO2: 0.36, fHe: 0 },
    ]);
  }

  function removeDecoGas(id: number) {
    setDecoGases((prev) => prev.filter((g) => g.id !== id));
  }

  function updateDecoGas(id: number, patch: Partial<DecoGasRow>) {
    setDecoGases((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function calculate() {
    const depthM = toMeters(targetDepth);
    const btMin = parseFloat(bottomTime) || 0;
    const gfLo = (parseFloat(gfLoStr) || 30) / 100;
    const gfHi = (parseFloat(gfHiStr) || 85) / 100;

    if (depthM <= 0) {
      Alert.alert('입력 오류', '유효한 수심을 입력하세요.');
      return;
    }
    if (btMin <= 0) {
      Alert.alert('입력 오류', '유효한 바닥 시간을 입력하세요.');
      return;
    }
    if (gfLo > gfHi) {
      Alert.alert('입력 오류', 'GF Low는 GF High보다 낮아야 합니다.');
      return;
    }

    const bottomMix: GasMix = {
      fO2: bottomFO2,
      fHe: bottomFHe,
      fN2: Math.max(0, 1 - bottomFO2 - bottomFHe),
    };

    const descMin = depthM / descentRate;
    const input: DecoInput = {
      segments: [
        {
          type: 'descent',
          startDepth: 0,
          endDepth: depthM,
          time: descMin,
          gas: bottomMix,
        },
        {
          type: 'bottom',
          startDepth: depthM,
          endDepth: depthM,
          time: btMin,
          gas: bottomMix,
        },
      ],
      decoGases: decoGases
        .map((dg) => ({
          switchDepth: toMeters(dg.switchDepth),
          mix: {
            fO2: dg.fO2,
            fHe: dg.fHe,
            fN2: Math.max(0, 1 - dg.fO2 - dg.fHe),
          },
        }))
        .sort((a, b) => b.switchDepth - a.switchDepth),
      gfLow: gfLo,
      gfHigh: gfHi,
      ascentRate,
      descentRate,
    };

    try {
      const decoResult = planDeco(input);
      setResult(decoResult);
      setBottomRunTime(Math.ceil(descMin + btMin));
    } catch (e) {
      Alert.alert('계산 오류', '입력값을 확인하세요.');
    }
  }

  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';
  const bottomN2 = Math.max(0, 1 - bottomFO2 - bottomFHe);
  const mixLabel =
    bottomFHe > 0
      ? `Trimix ${(bottomFO2 * 100).toFixed(0)}/${(bottomFHe * 100).toFixed(0)}`
      : `EAN ${(bottomFO2 * 100).toFixed(0)}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 다이브 프로파일 */}
      <SectionHeader title="다이브 프로파일" />
      <View style={styles.card}>
        <View style={styles.row2}>
          <NumericInput
            label="목표 수심"
            value={targetDepth}
            onChangeText={setTargetDepth}
            unit={depthLabel}
            containerStyle={styles.half}
          />
          <NumericInput
            label="바닥 시간"
            value={bottomTime}
            onChangeText={setBottomTime}
            unit="min"
            containerStyle={styles.half}
          />
        </View>
      </View>

      {/* 바닥 기체 */}
      <SectionHeader title="바닥 기체 (Bottom Mix)" />
      <View style={styles.card}>
        <GasSlider
          label="O₂ %"
          value={bottomFO2}
          onChange={setBottomFO2}
          min={0.04}
          max={Math.max(0.04, 1 - bottomFHe)}
          step={0.01}
        />
        <GasSlider
          label="He %"
          value={bottomFHe}
          onChange={setBottomFHe}
          min={0}
          max={Math.max(0, 1 - bottomFO2)}
          step={0.01}
        />
        <View style={styles.mixInfo}>
          <Text style={styles.mixLabel}>{mixLabel}</Text>
          <Text style={styles.n2Text}>N₂ {(bottomN2 * 100).toFixed(0)}%</Text>
        </View>
      </View>

      {/* 감압 기체 */}
      <SectionHeader title="감압 기체 (Deco Gases)" subtitle="전환 수심 이하에서 사용" />
      {decoGases.map((dg) => (
        <View key={dg.id} style={[styles.card, styles.decoGasCard]}>
          <View style={styles.decoGasHeader}>
            <Text style={styles.decoGasTitle}>
              EAN {(dg.fO2 * 100).toFixed(0)}
              {dg.fHe > 0 ? `/ He ${(dg.fHe * 100).toFixed(0)}` : ''}
            </Text>
            <TouchableOpacity onPress={() => removeDecoGas(dg.id)}>
              <Text style={styles.removeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row2}>
            <NumericInput
              label="전환 수심"
              value={dg.switchDepth}
              onChangeText={(v) => updateDecoGas(dg.id, { switchDepth: v })}
              unit={depthLabel}
              containerStyle={styles.half}
            />
            <View style={styles.half}>
              <GasSlider
                label="O₂ %"
                value={dg.fO2}
                onChange={(v) => updateDecoGas(dg.id, { fO2: v })}
                min={0.04}
                max={1}
                step={0.01}
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addGasBtn} onPress={addDecoGas}>
        <Text style={styles.addGasBtnText}>+ 감압 기체 추가</Text>
      </TouchableOpacity>

      {/* GF 설정 */}
      <SectionHeader title="Gradient Factor" subtitle="Settings 화면 기본값 오버라이드" />
      <View style={styles.card}>
        <View style={styles.row2}>
          <NumericInput
            label="GF Low"
            value={gfLoStr}
            onChangeText={setGfLoStr}
            unit="%"
            containerStyle={styles.half}
          />
          <NumericInput
            label="GF High"
            value={gfHiStr}
            onChangeText={setGfHiStr}
            unit="%"
            containerStyle={styles.half}
          />
        </View>
      </View>

      {/* 계산 버튼 */}
      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Text style={styles.calcBtnText}>감압 계획 계산</Text>
      </TouchableOpacity>

      {/* 결과 */}
      {result && (
        <>
          <SectionHeader
            title="감압 계획 결과"
            subtitle={`GF ${gfLoStr}/${gfHiStr} · 상승 ${ascentRate}m/min`}
          />
          <DecoSummary result={result} />
          <SectionHeader title="감압 정지 테이블" />
          <DecoTable
            stops={result.stops}
            bottomRunTime={bottomRunTime}
            ascentRate={ascentRate}
          />

          {result.maxCns > 80 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠ CNS% {result.maxCns.toFixed(1)}% — 산소 독성 위험 수준. 프로파일 재검토 필요.
              </Text>
            </View>
          )}
          {result.maxOtu > 300 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠ OTU {result.maxOtu.toFixed(0)} — 일일 한계(300 OTU) 초과. 주의 필요.
              </Text>
            </View>
          )}
        </>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ 계산 결과는 참고용입니다. 실제 다이빙은 자격을 갖춘 전문가와 함께 계획하세요.
        </Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row2: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  mixInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  mixLabel: { fontSize: 13, fontWeight: '600', color: '#0077CC' },
  n2Text: { fontSize: 13, color: '#64748B' },
  decoGasCard: { marginBottom: 8 },
  decoGasHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  decoGasTitle: { fontSize: 14, fontWeight: '600', color: '#334155' },
  removeBtn: { fontSize: 16, color: '#94A3B8', paddingHorizontal: 4 },
  addGasBtn: {
    borderWidth: 1.5,
    borderColor: '#0077CC',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  addGasBtnText: { color: '#0077CC', fontWeight: '600', fontSize: 14 },
  calcBtn: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  calcBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  warningText: { fontSize: 13, color: '#856404' },
  disclaimer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  disclaimerText: { fontSize: 12, color: '#856404', lineHeight: 18 },
});
