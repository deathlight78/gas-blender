import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import GasSlider from '../src/components/ui/GasSlider';
import NumericInput from '../src/components/ui/NumericInput';
import ResultCard from '../src/components/ui/ResultCard';
import SectionHeader from '../src/components/ui/SectionHeader';
import { mod, bestMix } from '../src/lib/gas/mod';
import { ead, end } from '../src/lib/gas/ead-end';
import { useSettingsStore } from '../src/store/settings.store';

function toMeters(value: number, unit: 'ft' | 'm') {
  return unit === 'ft' ? value * 0.3048 : value;
}

function fromMeters(value: number, unit: 'ft' | 'm') {
  return unit === 'ft' ? value / 0.3048 : value;
}

export default function CalculatorScreen() {
  const { ppO2Work, ppO2Deco, depthUnit } = useSettingsStore();

  const [fO2, setFO2] = useState(0.21);
  const [fHe, setFHe] = useState(0);
  const [depthStr, setDepthStr] = useState('40');

  const fN2 = Math.max(0, 1 - fO2 - fHe);
  const depthInput = parseFloat(depthStr) || 0;
  const depthM = toMeters(depthInput, depthUnit);

  // fHe 슬라이더의 최대값을 fO2를 뺀 나머지로 제한
  const maxHe = Math.max(0, 1 - fO2);
  const maxO2 = Math.max(0, 1 - fHe);

  const results = useMemo(() => {
    if (fO2 <= 0) return null;
    return {
      modWork: mod(fO2, ppO2Work),
      modDeco: mod(fO2, ppO2Deco),
      bestMixVal: bestMix(depthM, ppO2Work),
      eadVal: ead(fN2, depthM),
      endVal: fHe > 0 ? end(fHe, depthM) : null,
    };
  }, [fO2, fHe, fN2, depthM, ppO2Work, ppO2Deco]);

  const depthLabel = depthUnit === 'ft' ? 'ft' : 'm';

  function displayDepth(m: number) {
    return fromMeters(m, depthUnit).toFixed(1);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="기체 설정" subtitle="O₂, He 비율 입력" />

      <View style={styles.card}>
        <GasSlider
          label="O₂ %"
          value={fO2}
          onChange={setFO2}
          min={0.04}
          max={maxO2}
          step={0.01}
        />
        <GasSlider
          label="He %"
          value={fHe}
          onChange={setFHe}
          min={0}
          max={maxHe}
          step={0.01}
        />
        <View style={styles.n2Row}>
          <Text style={styles.n2Label}>N₂ (자동)</Text>
          <Text style={styles.n2Value}>{(fN2 * 100).toFixed(0)} %</Text>
        </View>
        {fHe > 0 && (
          <Text style={styles.mixTag}>
            Trimix {(fO2 * 100).toFixed(0)}/{(fHe * 100).toFixed(0)}
          </Text>
        )}
        {fHe === 0 && fO2 !== 0.21 && (
          <Text style={styles.mixTag}>
            Nitrox {(fO2 * 100).toFixed(0)}
          </Text>
        )}
      </View>

      <SectionHeader
        title="MOD (최대 운용 수심)"
        subtitle={`ppO₂ 작업 ${ppO2Work} / 감압 ${ppO2Deco} bar`}
      />
      {results ? (
        <>
          <ResultCard
            title="MOD (작업)"
            value={displayDepth(results.modWork)}
            unit={depthLabel}
            subtitle={`ppO₂ ${ppO2Work} bar 기준`}
            accent="#0077CC"
          />
          <ResultCard
            title="MOD (감압)"
            value={displayDepth(results.modDeco)}
            unit={depthLabel}
            subtitle={`ppO₂ ${ppO2Deco} bar 기준`}
            accent="#005599"
          />
        </>
      ) : (
        <Text style={styles.emptyHint}>O₂ 비율을 입력하세요</Text>
      )}

      <SectionHeader title="Best Mix" subtitle="목표 수심 기준 최적 O₂ 비율" />
      <View style={styles.card}>
        <NumericInput
          label="목표 수심"
          value={depthStr}
          onChangeText={setDepthStr}
          unit={depthLabel}
        />
      </View>
      {results && (
        <ResultCard
          title="Best Mix O₂"
          value={(results.bestMixVal * 100).toFixed(0)}
          unit="%"
          subtitle={`${depthStr}${depthLabel} / ppO₂ ${ppO2Work} bar 기준`}
          accent="#008844"
        />
      )}

      <SectionHeader title="EAD (등가 공기 수심)" />
      {results ? (
        <ResultCard
          title="EAD"
          value={
            results.eadVal < 0 ? '-' : displayDepth(results.eadVal)
          }
          unit={results.eadVal < 0 ? '' : depthLabel}
          subtitle={`Nitrox ${(fO2 * 100).toFixed(0)} / ${depthStr}${depthLabel}`}
          accent="#7C3AED"
          warning={results.eadVal < 0 ? '수심이 너무 얕아 EAD 계산 불가' : undefined}
        />
      ) : (
        <Text style={styles.emptyHint}>기체 설정을 입력하세요</Text>
      )}

      <SectionHeader title="END (등가 나르코틱 수심)" />
      {results ? (
        results.endVal !== null ? (
          <ResultCard
            title="END"
            value={displayDepth(results.endVal)}
            unit={depthLabel}
            subtitle={`He ${(fHe * 100).toFixed(0)}% / ${depthStr}${depthLabel}`}
            accent="#CC5500"
          />
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>He 0% — END = 실제 수심과 동일</Text>
          </View>
        )
      ) : (
        <Text style={styles.emptyHint}>기체 설정을 입력하세요</Text>
      )}

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
  n2Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  n2Label: { fontSize: 13, color: '#64748B' },
  n2Value: { fontSize: 16, fontWeight: '700', color: '#334155' },
  mixTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#EFF6FF',
    color: '#0077CC',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  emptyHint: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginVertical: 8 },
  infoBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  infoText: { fontSize: 13, color: '#166534' },
});
