import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import NumericInput from '../src/components/ui/NumericInput';
import GasSlider from '../src/components/ui/GasSlider';
import SectionHeader from '../src/components/ui/SectionHeader';
import { useSettingsStore } from '../src/store/settings.store';
import { DepthUnit, PressureUnit } from '../src/types/gas.types';

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <View style={styles.toggleRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.toggleBtn, value === opt && styles.toggleBtnActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.toggleText, value === opt && styles.toggleTextActive]}>
            {labels[opt]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const store = useSettingsStore();

  // 로컬 draft — 저장 버튼 누를 때 커밋
  const [ppO2Work, setPpO2Work] = useState(String(store.ppO2Work));
  const [ppO2Deco, setPpO2Deco] = useState(String(store.ppO2Deco));
  const [ascentRate, setAscentRate] = useState(String(store.ascentRate));
  const [descentRate, setDescentRate] = useState(String(store.descentRate));
  const [gfLow, setGfLow] = useState(store.gfLow);
  const [gfHigh, setGfHigh] = useState(store.gfHigh);

  function handleGfLow(v: number) {
    setGfLow(Math.min(v, gfHigh));
  }
  function handleGfHigh(v: number) {
    setGfHigh(Math.max(v, gfLow));
  }

  function save() {
    const w = parseFloat(ppO2Work);
    const d = parseFloat(ppO2Deco);
    const asc = parseFloat(ascentRate);
    const desc = parseFloat(descentRate);

    if (isNaN(w) || w < 0.16 || w > 2.0) {
      Alert.alert('오류', 'ppO₂ 작업 한계는 0.16~2.0 범위여야 합니다.');
      return;
    }
    if (isNaN(d) || d < 0.16 || d > 2.0) {
      Alert.alert('오류', 'ppO₂ 감압 한계는 0.16~2.0 범위여야 합니다.');
      return;
    }
    if (w > d) {
      Alert.alert('오류', 'ppO₂ 작업 한계는 감압 한계보다 낮아야 합니다.');
      return;
    }
    if (isNaN(asc) || asc <= 0) {
      Alert.alert('오류', '상승 속도는 양수여야 합니다.');
      return;
    }
    if (isNaN(desc) || desc <= 0) {
      Alert.alert('오류', '하강 속도는 양수여야 합니다.');
      return;
    }

    store.setPpO2Work(w);
    store.setPpO2Deco(d);
    store.setGf(gfLow, gfHigh);
    store.setAscentRate(asc);
    store.setDescentRate(desc);
    Alert.alert('저장 완료', '설정이 저장되었습니다.');
  }

  function reset() {
    Alert.alert('초기화', '모든 설정을 기본값으로 되돌리겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        style: 'destructive',
        onPress: () => {
          store.resetToDefaults();
          setPpO2Work('1.4');
          setPpO2Deco('1.6');
          setAscentRate('9');
          setDescentRate('20');
          setGfLow(0.3);
          setGfHigh(0.8);
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="ppO₂ 한계" subtitle="산소 독성 기준 압력" />
      <View style={styles.card}>
        <NumericInput
          label="작업 한계"
          value={ppO2Work}
          onChangeText={setPpO2Work}
          unit="bar"
          hint="권장: 1.4 bar (작업 다이빙 중)"
        />
        <NumericInput
          label="감압 한계"
          value={ppO2Deco}
          onChangeText={setPpO2Deco}
          unit="bar"
          hint="권장: 1.6 bar (감압 정지 중)"
        />
        {parseFloat(ppO2Work) > 1.4 && (
          <Text style={styles.cautionText}>⚠ 작업 한계 1.4 bar 초과 — 주의 필요</Text>
        )}
        {parseFloat(ppO2Deco) > 1.6 && (
          <Text style={styles.cautionText}>⚠ 감압 한계 1.6 bar 초과 — 주의 필요</Text>
        )}
      </View>

      <SectionHeader title="Gradient Factor" subtitle="감압 보수성 설정" />
      <View style={styles.card}>
        <GasSlider
          label={`GF Low: ${(gfLow * 100).toFixed(0)}%`}
          value={gfLow}
          onChange={handleGfLow}
          min={0.1}
          max={gfHigh}
          step={0.05}
        />
        <GasSlider
          label={`GF High: ${(gfHigh * 100).toFixed(0)}%`}
          value={gfHigh}
          onChange={handleGfHigh}
          min={gfLow}
          max={1.0}
          step={0.05}
        />
        <Text style={styles.gfHint}>
          GF {(gfLow * 100).toFixed(0)}/{(gfHigh * 100).toFixed(0)} —{' '}
          {gfLow <= 0.3 && gfHigh >= 0.8 ? '보수적' : gfLow >= 0.7 ? '공격적' : '중간'}
        </Text>
      </View>

      <SectionHeader title="단위" />
      <View style={styles.card}>
        <Text style={styles.toggleLabel}>수심</Text>
        <ToggleGroup<DepthUnit>
          options={['m', 'ft']}
          value={store.depthUnit}
          onChange={store.setDepthUnit}
          labels={{ m: '미터 (m)', ft: '피트 (ft)' }}
        />
        <Text style={[styles.toggleLabel, { marginTop: 16 }]}>압력</Text>
        <ToggleGroup<PressureUnit>
          options={['bar', 'psi']}
          value={store.pressureUnit}
          onChange={store.setPressureUnit}
          labels={{ bar: 'bar', psi: 'psi' }}
        />
      </View>

      <SectionHeader title="상승 / 하강 속도" />
      <View style={styles.card}>
        <NumericInput
          label="상승 속도"
          value={ascentRate}
          onChangeText={setAscentRate}
          unit="m/min"
          hint="권장: 9 m/min"
        />
        <NumericInput
          label="하강 속도"
          value={descentRate}
          onChangeText={setDescentRate}
          unit="m/min"
          hint="권장: 20 m/min"
        />
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetBtnText}>초기화</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ 이 앱의 계산 결과는 참고용입니다. 실제 다이빙 계획은 반드시 자격을 갖춘 강사와 함께 수립하세요.
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  cautionText: { fontSize: 12, color: '#856404', marginTop: 4 },
  gfHint: { fontSize: 12, color: '#64748B', marginTop: 8, textAlign: 'center' },
  toggleLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: '#0077CC' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  toggleTextActive: { color: '#fff' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  saveBtn: {
    flex: 2,
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resetBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetBtnText: { color: '#DC2626', fontSize: 15, fontWeight: '600' },
  disclaimer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  disclaimerText: { fontSize: 12, color: '#856404', lineHeight: 18 },
});
