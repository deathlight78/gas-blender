import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import TankForm from '../src/components/blending/TankForm';
import BlendResult from '../src/components/blending/BlendResult';
import SectionHeader from '../src/components/ui/SectionHeader';
import NumericInput from '../src/components/ui/NumericInput';
import ResultCard from '../src/components/ui/ResultCard';
import { calcOCBlend } from '../src/lib/blending/oc-blending';
import { calcCCRBlend } from '../src/lib/blending/ccr-blending';
import { OCBlendResult, CCRBlendResult } from '../src/types/blending.types';
import { useSettingsStore } from '../src/store/settings.store';

type Tab = 'oc' | 'ccr';

interface TankValues {
  pressure: string;
  fO2: number;
  fHe: number;
}

const DEFAULT_CURRENT: TankValues = { pressure: '50', fO2: 0.21, fHe: 0 };
const DEFAULT_TARGET: TankValues = { pressure: '200', fO2: 0.32, fHe: 0 };

// CCR 입력 상태
interface CCRValues {
  dilFO2: number;
  dilFHe: number;
  setpoint: string;
  maxDepth: string;
}

const DEFAULT_CCR: CCRValues = {
  dilFO2: 0.21,
  dilFHe: 0.35,
  setpoint: '1.3',
  maxDepth: '45',
};

export default function BlendingScreen() {
  const { pressureUnit } = useSettingsStore();
  const [tab, setTab] = useState<Tab>('oc');

  // OC 상태
  const [current, setCurrent] = useState<TankValues>(DEFAULT_CURRENT);
  const [target, setTarget] = useState<TankValues>(DEFAULT_TARGET);
  const [ocResult, setOcResult] = useState<OCBlendResult | null>(null);

  // CCR 상태
  const [ccr, setCcr] = useState<CCRValues>(DEFAULT_CCR);
  const [ccrResult, setCcrResult] = useState<CCRBlendResult | null>(null);

  function toPressureBar(str: string): number {
    const v = parseFloat(str) || 0;
    return pressureUnit === 'psi' ? v / 14.5038 : v;
  }

  function calcOC() {
    const cp = toPressureBar(current.pressure);
    const tp = toPressureBar(target.pressure);

    if (tp <= cp) {
      Alert.alert('입력 오류', '목표 압력은 현재 압력보다 높아야 합니다.');
      return;
    }
    if (current.fO2 + current.fHe > 1 || target.fO2 + target.fHe > 1) {
      Alert.alert('입력 오류', 'O₂ + He 합이 100%를 초과할 수 없습니다.');
      return;
    }

    const result = calcOCBlend({
      currentPressure: cp,
      currentMix: {
        fO2: current.fO2,
        fHe: current.fHe,
        fN2: 1 - current.fO2 - current.fHe,
      },
      targetPressure: tp,
      targetMix: {
        fO2: target.fO2,
        fHe: target.fHe,
        fN2: 1 - target.fO2 - target.fHe,
      },
    });
    setOcResult(result);
  }

  function calcCCR() {
    const dilFN2 = 1 - ccr.dilFO2 - ccr.dilFHe;
    const sp = parseFloat(ccr.setpoint) || 0;
    const depth = parseFloat(ccr.maxDepth) || 0;

    const result = calcCCRBlend({
      diluentMix: { fO2: ccr.dilFO2, fHe: ccr.dilFHe, fN2: dilFN2 },
      diluentPressure: 200,
      o2Pressure: 200,
      setpoint: sp,
      maxDepth: depth,
    });
    setCcrResult(result);
  }

  return (
    <View style={styles.wrapper}>
      {/* 탭 전환 */}
      <View style={styles.tabBar}>
        {(['oc', 'ccr'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'oc' ? 'OC (개방회로)' : 'CCR (폐쇄회로)'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {tab === 'oc' ? (
          <>
            <TankForm
              title="현재 탱크"
              values={current}
              onChange={setCurrent}
              pressureUnit={pressureUnit}
            />
            <TankForm
              title="목표 혼합기체"
              values={target}
              onChange={setTarget}
              pressureUnit={pressureUnit}
            />

            <TouchableOpacity style={styles.calcBtn} onPress={calcOC}>
              <Text style={styles.calcBtnText}>블렌딩 계산</Text>
            </TouchableOpacity>

            <SectionHeader title="계산 결과" />
            <BlendResult result={ocResult} pressureUnit={pressureUnit} />
          </>
        ) : (
          <>
            <SectionHeader title="Diluent 기체" subtitle="CCR 희석 기체 설정" />
            <View style={styles.card}>
              <TankForm
                title=""
                values={{ pressure: '200', fO2: ccr.dilFO2, fHe: ccr.dilFHe }}
                onChange={(v) => setCcr((c) => ({ ...c, dilFO2: v.fO2, dilFHe: v.fHe }))}
                pressureUnit={pressureUnit}
              />
            </View>

            <SectionHeader title="Setpoint 설정" />
            <View style={styles.card}>
              <NumericInput
                label="ppO₂ Setpoint"
                value={ccr.setpoint}
                onChangeText={(v) => setCcr((c) => ({ ...c, setpoint: v }))}
                unit="bar"
                hint="일반적으로 1.0~1.3 bar"
              />
              <NumericInput
                label="계획 최대 수심"
                value={ccr.maxDepth}
                onChangeText={(v) => setCcr((c) => ({ ...c, maxDepth: v }))}
                unit="m"
              />
            </View>

            <TouchableOpacity style={styles.calcBtn} onPress={calcCCR}>
              <Text style={styles.calcBtnText}>CCR 계산</Text>
            </TouchableOpacity>

            {ccrResult && (
              <>
                <SectionHeader title="계산 결과" />
                <ResultCard
                  title="Setpoint 유지 최대 수심"
                  value={ccrResult.maxSetpointDepth.toFixed(1)}
                  unit="m"
                  subtitle="Diluent fO₂ 기준"
                  accent="#CC5500"
                />
                <ResultCard
                  title="목표 수심 ppO₂"
                  value={ccrResult.actualPpO2AtDepth.toFixed(3)}
                  unit="bar"
                  subtitle={`${ccr.maxDepth}m에서 Diluent ppO₂`}
                  accent="#0077CC"
                  warning={
                    ccrResult.actualPpO2AtDepth > parseFloat(ccr.setpoint) * 1.05
                      ? 'ppO₂ setpoint 초과 — Diluent 기체 재검토 필요'
                      : undefined
                  }
                />
                {ccrResult.warnings.length > 0 && (
                  <View style={styles.warningBox}>
                    {ccrResult.warnings.map((w, i) => (
                      <Text key={i} style={styles.warningText}>⚠ {w}</Text>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f7fa' },
  tabBar: {
    flexDirection: 'row',
    padding: 8,
    gap: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#0077CC' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#fff' },
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  calcBtn: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  calcBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    gap: 6,
    marginTop: 4,
  },
  warningText: { fontSize: 13, color: '#856404' },
});
