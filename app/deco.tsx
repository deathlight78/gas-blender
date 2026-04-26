import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../src/components/ui/InfoModal';
import StepInput from '../src/components/ui/StepInput';
import GasSlider from '../src/components/ui/GasSlider';
import SectionHeader from '../src/components/ui/SectionHeader';
import DecoTable from '../src/components/deco/DecoTable';
import DecoSummary from '../src/components/deco/DecoSummary';
import { planDeco } from '../src/lib/deco/deco-planner';
import { DecoResult, DecoInput } from '../src/types/deco.types';
import { GasMix } from '../src/types/gas.types';
import { useSettingsStore } from '../src/store/settings.store';
import { useSessionStore } from '../src/store/session.store';
import { calcSessionCarryover } from '../src/lib/deco/cns-recovery';
import SessionPanel from '../src/components/deco/SessionPanel';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';

interface DecoGasRow { id: number; fO2: number; fHe: number }
let nextId = 1;

export default function DecoScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { gfLow, gfHigh, gfBailoutLow, gfBailoutHigh, ascentRate, descentRate, depthUnit, airO2, airN2, ppO2Deco, ppO2Work } = useSettingsStore();
  const theme = useAppTheme();
  const navigation = useNavigation();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const [infoVisible, setInfoVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={{ marginRight: 14 }}>
          <Ionicons name="information-circle-outline" size={22} color={theme.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  const [targetDepth, setTargetDepth] = useState(45);
  const [bottomTime, setBottomTime]   = useState(25);
  const [bottomFO2, setBottomFO2]     = useState(0.21);
  const [bottomFHe, setBottomFHe]     = useState(0.35);
  const [gfLo, setGfLo] = useState(Math.round(gfLow  * 100));
  const [gfHi, setGfHi] = useState(Math.round(gfHigh * 100));
  const [bailoutMode, setBailoutMode] = useState(false);
  const [lastStop, setLastStop] = useState(6);   // m — GUE 기본값
  const [decoGases, setDecoGases] = useState<DecoGasRow[]>([
    { id: nextId++, fO2: 0.5, fHe: 0 },
    { id: nextId++, fO2: 1.0, fHe: 0 },
  ]);

  // RMV 상태 (0 = 미입력 → 소비량 계산 안 함)
  const [rmvBottom, setRmvBottom] = useState(0);
  const [rmvDeco,   setRmvDeco]   = useState(0);

  const [result, setResult] = useState<DecoResult | null>(null);
  const [bottomRunTime, setBottomRunTime] = useState(0);
  const [descentTimeVal, setDescentTimeVal] = useState(0);
  const [computedBottomGas, setComputedBottomGas] = useState<GasMix>({ fO2: 0.21, fHe: 0, fN2: 0.79 });

  const { entries, addEntry } = useSessionStore();
  const carryover = calcSessionCarryover(entries);

  function toM(v: number) { return depthUnit === 'ft' ? v * 0.3048 : v; }

  const depthMax        = depthUnit === 'ft' ? 330 : 100;
  const depthStep       = depthUnit === 'ft' ? 3   : 1;
  const depthUnit_label = depthUnit === 'ft' ? 'ft' : 'm';

  function calculate() {
    const depthM  = toM(targetDepth);
    const gfLoVal = bailoutMode ? gfBailoutLow  : gfLo / 100;
    const gfHiVal = bailoutMode ? gfBailoutHigh : gfHi / 100;

    if (depthM <= 0)      { Alert.alert(t('error'), t('deco_err_depth'));       return; }
    if (bottomTime <= 0)  { Alert.alert(t('error'), t('deco_err_bottom_time')); return; }
    if (gfLoVal > gfHiVal){ Alert.alert(t('error'), t('deco_err_gf'));           return; }

    const bottomMix: GasMix = {
      fO2: bottomFO2, fHe: bottomFHe,
      fN2: Math.max(0, 1 - bottomFO2 - bottomFHe),
    };
    const descMin = depthM / descentRate;
    const atDepthTime = bottomTime - descMin;    // 바닥 시간(런타임) − 하강 시간 = 실제 수심 체류
    if (atDepthTime <= 0) {
      Alert.alert(t('error'), t('deco_err_bottom_time_short', { desc: String(Math.ceil(descMin)) }));
      return;
    }

    const input: DecoInput = {
      segments: [
        { type: 'descent', startDepth: 0,     endDepth: depthM, time: descMin,      gas: bottomMix },
        { type: 'bottom',  startDepth: depthM, endDepth: depthM, time: atDepthTime,  gas: bottomMix },
      ],
      decoGases: decoGases.map(dg => ({
        mix: { fO2: dg.fO2, fHe: dg.fHe, fN2: Math.max(0, 1 - dg.fO2 - dg.fHe) },
      })),
      ppO2DecoCeiling: ppO2Deco,
      gfLow: gfLoVal, gfHigh: gfHiVal,
      ascentRate, descentRate, airO2, airN2,
      lastStopDepth: lastStop,
      rmvBottom: rmvBottom > 0 ? rmvBottom : undefined,
      rmvDeco:   rmvDeco   > 0 ? rmvDeco   : undefined,
    };

    try {
      setResult(planDeco(input));
      setBottomRunTime(Math.ceil(bottomTime));   // 런타임 = 입력값 그대로
      setDescentTimeVal(descMin);
      setComputedBottomGas(bottomMix);
    } catch {
      Alert.alert(t('error'), t('deco_err_input'));
    }
  }

  const bottomN2 = Math.max(0, 1 - bottomFO2 - bottomFHe);
  const mixLabel = bottomFHe > 0
    ? `Trimix ${(bottomFO2 * 100).toFixed(0)}/${(bottomFHe * 100).toFixed(0)}`
    : `EAN ${(bottomFO2 * 100).toFixed(0)}`;
  const bottomModM    = Math.floor((ppO2Work / bottomFO2 - 1) * 10);
  const bottomModDisp = depthUnit === 'ft' ? Math.floor(bottomModM / 0.3048) : bottomModM;

  return (
    <ScrollView ref={scrollRef} style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <InfoModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
        title={t('info_deco_title')}
        content={t('info_deco_content')}
      />

      {/* ── 다이브 프로파일 ── */}
      <SectionHeader title={t('deco_profile')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_target_depth')} value={targetDepth} onChange={setTargetDepth}
          min={depthUnit === 'ft' ? 16 : 5} max={depthMax} step={depthStep} unit={depthUnit_label} />
        <StepInput label={t('deco_bottom_time')} value={bottomTime} onChange={setBottomTime}
          min={1} max={180} step={1} unit="min" />
        {(() => {
          const descMinDisplay = Math.ceil(toM(targetDepth) / descentRate);
          const atDepth = bottomTime - descMinDisplay;
          return (
            <Text style={[styles.hintText, { color: theme.textMuted }]}>
              {t('deco_bottom_time_hint', { desc: String(descMinDisplay) })}
              {atDepth > 0 ? `  (${t('deco_at_depth_val', { min: String(atDepth) })})` : ''}
            </Text>
          );
        })()}
      </View>

      {/* ── 바닥 기체 ── */}
      <SectionHeader title={t('deco_bottom_mix')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <GasSlider label="O₂ %" value={bottomFO2} onChange={setBottomFO2} min={0.04} max={Math.max(0.04, 1 - bottomFHe)} step={0.01} />
        <GasSlider label="He %" value={bottomFHe} onChange={setBottomFHe} min={0}    max={Math.max(0, 1 - bottomFO2)}     step={0.01} />
        <View style={[styles.mixInfo, { borderTopColor: theme.surfaceAlt }]}>
          <Text style={[styles.mixLabel, { color: theme.accent }]}>{mixLabel}</Text>
          <Text style={[styles.n2Text,  { color: theme.textMuted }]}>
            N₂ {(bottomN2 * 100).toFixed(0)}%{'  '}MOD {bottomModDisp}{depthUnit_label}
          </Text>
        </View>
      </View>

      {/* ── 감압 기체 ── */}
      <SectionHeader title={t('deco_deco_gases')} subtitle={t('deco_deco_gases_subtitle', { limit: ppO2Deco.toFixed(1) })} />
      {decoGases.length === 0 && (
        <View style={[styles.emptyGasBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.emptyGasText, { color: theme.textMuted }]}>{t('deco_add_gas')}</Text>
        </View>
      )}
      {decoGases.map((dg, index) => {
        const gasLabel = dg.fHe > 0
          ? `Trimix ${(dg.fO2 * 100).toFixed(0)}/${(dg.fHe * 100).toFixed(0)}`
          : `EAN ${(dg.fO2 * 100).toFixed(0)}`;
        const fN2    = Math.max(0, 1 - dg.fO2 - dg.fHe);
        // ppO₂ 한계 기반 MOD 계산 (m)
        const modM   = Math.floor((ppO2Deco / dg.fO2 - 1) * 10);
        const modDisp = depthUnit === 'ft' ? Math.floor(modM / 0.3048) : modM;
        return (
          <View key={dg.id} style={[styles.decoGasCard, { backgroundColor: theme.surface }]}>
            {/* 카드 헤더 */}
            <View style={[styles.decoGasHeader, { borderBottomColor: theme.surfaceAlt }]}>
              <View style={[styles.cylinderBadge, { backgroundColor: theme.accent }]}>
                <Text style={styles.cylinderBadgeText}>{index + 1}</Text>
              </View>
              <View style={styles.decoGasTitleWrap}>
                <Text style={[styles.cylinderLabel, { color: theme.text }]}>
                  {t('deco_cylinder')} {index + 1}
                </Text>
                <Text style={[styles.decoGasSubtitle, { color: theme.textMuted }]}>
                  {gasLabel} · MOD {modDisp}{depthUnit_label}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.removeBtnWrap, { backgroundColor: theme.warningBg }]}
                onPress={() => setDecoGases(p => p.filter(g => g.id !== dg.id))}
              >
                <Text style={[styles.removeBtnText, { color: theme.errorText }]}>
                  {t('deco_remove_gas')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 카드 바디 */}
            <View style={styles.decoGasBody}>
              <GasSlider label="O₂ %"
                value={dg.fO2}
                onChange={v => setDecoGases(p => p.map(g => g.id === dg.id ? { ...g, fO2: v } : g))}
                min={0.04} max={1} step={0.01} />
            </View>

            {/* 카드 푸터 — MOD 및 ppO₂ 정보 */}
            <View style={[styles.decoGasFooter, { borderTopColor: theme.surfaceAlt }]}>
              <Text style={[styles.decoGasInfo, { color: theme.textMuted }]}>
                N₂ {(fN2 * 100).toFixed(0)}%
              </Text>
              <Text style={[styles.decoGasInfo, { color: theme.accent }]}>
                MOD {modDisp}{depthUnit_label} · ppO₂ {ppO2Deco.toFixed(1)} bar
              </Text>
            </View>
          </View>
        );
      })}
      <TouchableOpacity style={[styles.addGasBtn, { borderColor: theme.accent }]}
        onPress={() => setDecoGases(p => [...p, { id: nextId++, fO2: 0.36, fHe: 0 }])}>
        <Text style={[styles.addGasBtnText, { color: theme.accent }]}>{t('deco_add_gas')}</Text>
      </TouchableOpacity>

      {/* ── Gradient Factor ── */}
      <SectionHeader title={t('deco_gf')} subtitle={t('deco_gf_subtitle')} />
      <View style={[styles.gfCard, { backgroundColor: theme.surface }]}>
        {/* 모드 탭 선택 */}
        <View style={[styles.gfModeRow, { borderBottomColor: theme.surfaceAlt }]}>
          <TouchableOpacity
            style={[styles.gfModeBtn, !bailoutMode && { backgroundColor: theme.accent }]}
            onPress={() => setBailoutMode(false)}
          >
            <Text style={[styles.gfModeBtnText, { color: !bailoutMode ? '#fff' : theme.textMuted }]}>
              {t('deco_gf_mode_normal')}
            </Text>
            <Text style={[styles.gfModeBtnSub, { color: !bailoutMode ? 'rgba(255,255,255,0.8)' : theme.textMuted }]}>
              GF {gfLo}/{gfHi}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gfModeBtn, bailoutMode && styles.gfModeBtnBailout]}
            onPress={() => setBailoutMode(true)}
          >
            <Text style={[styles.gfModeBtnText, { color: bailoutMode ? '#fff' : theme.textMuted }]}>
              ⚠ {t('deco_gf_mode_bailout')}
            </Text>
            <Text style={[styles.gfModeBtnSub, { color: bailoutMode ? 'rgba(255,255,255,0.8)' : theme.textMuted }]}>
              GF {Math.round(gfBailoutLow * 100)}/{Math.round(gfBailoutHigh * 100)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 일반 모드 — GF 슬라이더 */}
        {!bailoutMode && (
          <View style={styles.gfBody}>
            <StepInput label={t('deco_gf_low')}  value={gfLo} onChange={setGfLo} min={10} max={90}  step={5} unit="%" />
            <StepInput label={t('deco_gf_high')} value={gfHi} onChange={setGfHi} min={20} max={100} step={5} unit="%" />
            <Text style={[styles.gfBodyHint, { color: theme.textMuted }]}>{t('deco_gf_normal_hint')}</Text>
          </View>
        )}

        {/* Bailout 모드 — 설정값 표시 */}
        {bailoutMode && (
          <View style={[styles.gfBailoutBody, { backgroundColor: '#7C1D0015' }]}>
            <View style={styles.gfBailoutValueRow}>
              <View style={styles.gfBailoutBadge}>
                <Text style={styles.gfBailoutBadgeText}>BAILOUT GF</Text>
              </View>
              <Text style={[styles.gfBailoutValue, { color: '#CC4400' }]}>
                {Math.round(gfBailoutLow * 100)} / {Math.round(gfBailoutHigh * 100)}
              </Text>
            </View>
            <Text style={[styles.gfBailoutDesc, { color: theme.textMuted }]}>
              {t('deco_gf_bailout_from_settings')}
            </Text>
          </View>
        )}
      </View>

      {/* ── 마지막 정지 수심 ── */}
      <SectionHeader title={t('deco_last_stop')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_last_stop')} value={lastStop} onChange={setLastStop}
          min={3} max={9} step={3} unit="m" />
      </View>

      {/* ── RMV 설정 ── */}
      <SectionHeader title={t('deco_rmv')} subtitle={t('deco_rmv_subtitle')} />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <StepInput label={t('deco_rmv_bottom')} value={rmvBottom} onChange={setRmvBottom}
          min={0} max={40} step={1} unit="L/min" />
        <StepInput label={t('deco_rmv_deco')} value={rmvDeco} onChange={setRmvDeco}
          min={0} max={30} step={1} unit="L/min" />
        {rmvBottom === 0 && (
          <Text style={[styles.hintText, { color: theme.textMuted }]}>
            0 = {t('deco_rmv_subtitle').split('(')[1]?.replace(')', '') ?? '미입력'}
          </Text>
        )}
      </View>

      {/* ── 세션 누적 상태 배너 (세션에 다이빙이 있을 때만) ── */}
      {entries.length > 0 && (
        <View style={[styles.sessionBanner, { backgroundColor: theme.surface, borderColor: theme.accent }]}>
          <Text style={[styles.sessionBannerText, { color: theme.accent }]}>
            {t('session_status_banner', {
              otu:   carryover.otu.toFixed(0),
              cns:   carryover.cns.toFixed(1),
              count: String(entries.length),
            })}
          </Text>
        </View>
      )}

      {/* ── 계산 버튼 ── */}
      <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.buttonPrimary }]} onPress={calculate}>
        <Text style={[styles.calcBtnText, { color: theme.buttonPrimaryText }]}>{t('deco_calc')}</Text>
      </TouchableOpacity>

      {/* ── 결과 ── */}
      {result && (
        <>
          <SectionHeader
            title={t('deco_result')}
            subtitle={`GF ${gfLo}/${gfHi} · ${t('deco_ascent_label')} ${ascentRate}m/min · Last ${lastStop}m`}
          />
          <DecoSummary result={result} />

          {/* 저산소 기체 경고 */}
          {result.hypoxicWarnings && result.hypoxicWarnings.length > 0 && (
            <View style={[styles.icdBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.icdTitle, { color: theme.warningText }]}>{t('deco_hypoxic_warning')}</Text>
              {result.hypoxicWarnings.map((w, i) => (
                <Text key={i} style={[styles.icdItem, { color: theme.warningText }]}>
                  {t('deco_hypoxic_detail', {
                    gas:  w.gasLabel,
                    depth: String(w.depth),
                    ppo2: w.ppO2.toFixed(3),
                  })}
                </Text>
              ))}
              <Text style={[styles.icdNote, { color: theme.warningText }]}>{t('deco_hypoxic_note')}</Text>
            </View>
          )}

          {/* ICD 경고 */}
          {result.icdWarnings && result.icdWarnings.length > 0 && (
            <View style={[styles.icdBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.icdTitle, { color: theme.warningText }]}>{t('deco_icd_warning')}</Text>
              {result.icdWarnings.map((w, i) => (
                <Text key={i} style={[styles.icdItem, { color: theme.warningText }]}>
                  {t('deco_icd_detail', {
                    depth: String(w.depth),
                    prev:  (w.prevFN2 * 100).toFixed(0),
                    next:  (w.newFN2  * 100).toFixed(0),
                  })}
                </Text>
              ))}
              <Text style={[styles.icdNote, { color: theme.warningText }]}>{t('deco_icd_note')}</Text>
            </View>
          )}

          <SectionHeader title={t('deco_table')} />
          <DecoTable
              stops={result.stops}
              bottomRunTime={bottomRunTime}
              ascentRate={ascentRate}
              targetDepth={toM(targetDepth)}
              descentTime={descentTimeVal}
              bottomGas={computedBottomGas}
            />

          {/* 기체별 소비량 */}
          {result.gasConsumptions && result.gasConsumptions.length > 0 && (
            <>
              <SectionHeader title={t('deco_gas_consumption')} />
              <View style={[styles.consumptionCard, { backgroundColor: theme.surface }]}>
                {result.gasConsumptions.map((gc, i) => (
                  <View key={i} style={[
                    styles.consumptionRow,
                    i < result.gasConsumptions!.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.surfaceAlt },
                  ]}>
                    <Text style={[styles.consumptionLabel, { color: theme.text }]}>{gc.label}</Text>
                    <Text style={[styles.consumptionValue, { color: theme.accent }]}>{gc.totalL} L</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {result.maxCns > 80 && (
            <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.warningText, { color: theme.warningText }]}>
                ⚠ CNS% {result.maxCns.toFixed(1)}% {t('deco_warn_cns_suffix')}
              </Text>
            </View>
          )}
          {result.maxOtu > 300 && (
            <View style={[styles.warningBox, { backgroundColor: theme.warningBg }]}>
              <Text style={[styles.warningText, { color: theme.warningText }]}>
                ⚠ OTU {result.maxOtu.toFixed(0)} {t('deco_warn_otu_suffix')}
              </Text>
            </View>
          )}

          {/* ── 세션 누적 카드 ── */}
          {(() => {
            const totalOtu = carryover.otu + result.maxOtu;
            const totalCns = carryover.cns + result.maxCns;
            const otuPct   = Math.min(100, (totalOtu / 300) * 100);
            const barColor = totalOtu > 270 ? '#CC2200' : totalOtu > 200 ? '#CC8800' : '#22AA55';
            return (
              <View style={[styles.cumulativeCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.cumulativeTitle, { color: theme.text }]}>{t('session_cumulative')}</Text>
                {/* OTU 행 */}
                <View style={styles.cumRow}>
                  <View style={styles.cumCell}>
                    <Text style={[styles.cumCellLabel, { color: theme.textMuted }]}>{t('session_prev')}</Text>
                    <Text style={[styles.cumCellVal, { color: theme.textSecondary }]}>{carryover.otu.toFixed(0)}</Text>
                  </View>
                  <Text style={[styles.cumOp, { color: theme.textMuted }]}>+</Text>
                  <View style={styles.cumCell}>
                    <Text style={[styles.cumCellLabel, { color: theme.textMuted }]}>{t('session_this_dive')}</Text>
                    <Text style={[styles.cumCellVal, { color: theme.text }]}>{result.maxOtu.toFixed(0)}</Text>
                  </View>
                  <Text style={[styles.cumOp, { color: theme.textMuted }]}>=</Text>
                  <View style={styles.cumCell}>
                    <Text style={[styles.cumCellLabel, { color: theme.textMuted }]}>{t('session_total')} OTU</Text>
                    <Text style={[styles.cumCellVal, { color: barColor, fontWeight: '700' }]}>{totalOtu.toFixed(0)}</Text>
                  </View>
                </View>
                {/* OTU 바 */}
                <View style={[styles.cumOtuBarBg, { backgroundColor: theme.surfaceAlt }]}>
                  <View style={[styles.cumOtuBarFill, { width: `${otuPct}%`, backgroundColor: barColor }]} />
                </View>
                <Text style={[styles.cumOtuCaption, { color: theme.textMuted }]}>
                  {t('session_otu_pct', { pct: String(Math.round(otuPct)), limit: '300' })}
                </Text>
                {/* CNS 행 */}
                <View style={[styles.cumRow, { marginTop: 4 }]}>
                  <View style={styles.cumCell}>
                    <Text style={[styles.cumCellLabel, { color: theme.textMuted }]}>{t('session_prev')}</Text>
                    <Text style={[styles.cumCellVal, { color: theme.textSecondary }]}>{carryover.cns.toFixed(1)}%</Text>
                  </View>
                  <Text style={[styles.cumOp, { color: theme.textMuted }]}>+</Text>
                  <View style={styles.cumCell}>
                    <Text style={[styles.cumCellLabel, { color: theme.textMuted }]}>{t('session_this_dive')}</Text>
                    <Text style={[styles.cumCellVal, { color: theme.text }]}>{result.maxCns.toFixed(1)}%</Text>
                  </View>
                  <Text style={[styles.cumOp, { color: theme.textMuted }]}>=</Text>
                  <View style={styles.cumCell}>
                    <Text style={[styles.cumCellLabel, { color: theme.textMuted }]}>{t('session_total')} CNS%</Text>
                    <Text style={[styles.cumCellVal, { color: totalCns > 80 ? '#CC2200' : theme.accent, fontWeight: '700' }]}>{totalCns.toFixed(1)}%</Text>
                  </View>
                </View>
              </View>
            );
          })()}

          {/* ── 세션에 추가 버튼 ── */}
          <TouchableOpacity
            style={[styles.addSessionBtn, { backgroundColor: theme.accent }]}
            onPress={() => {
              addEntry({
                depth:              toM(targetDepth),
                bottomTime,
                tts:                result.tts,
                totalDecoTime:      result.totalDecoTime,
                diveOtu:            result.maxOtu,
                diveCns:            result.maxCns,
                surfaceIntervalMin: 60,
              });
            }}
          >
            <Text style={[styles.addSessionBtnText, { color: '#fff' }]}>{t('session_add')}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── 다이빙 세션 ── */}
      <SectionHeader title={t('session_title')} subtitle={t('session_subtitle')} />
      <SessionPanel />

      <View style={[styles.disclaimer, { backgroundColor: theme.warningBg }]}>
        <Text style={[styles.disclaimerText, { color: theme.warningText }]}>{t('deco_disclaimer')}</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    borderRadius: 12, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 8,
    marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  mixInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, marginTop: 4 },
  mixLabel: { fontSize: 13, fontWeight: '600' },
  n2Text:   { fontSize: 13 },
  decoGasCard: {
    borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    overflow: 'hidden',
  },
  decoGasHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cylinderBadge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  cylinderBadgeText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  decoGasTitleWrap: { flex: 1 },
  cylinderLabel: { fontSize: 14, fontWeight: '700' },
  decoGasSubtitle: { fontSize: 12, marginTop: 1 },
  removeBtnWrap: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 6, marginLeft: 8,
  },
  removeBtnText: { fontSize: 12, fontWeight: '600' },
  decoGasBody: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  decoGasFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 8,
    borderTopWidth: 1,
  },
  decoGasInfo: { fontSize: 12 },
  emptyGasBox: {
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10,
    paddingVertical: 20, alignItems: 'center', marginBottom: 8,
  },
  emptyGasText: { fontSize: 13 },
  addGasBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 4 },
  addGasBtnText: { fontWeight: '600', fontSize: 14 },
  hintText: { fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 4 },
  calcBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 4 },
  calcBtnText: { fontSize: 17, fontWeight: '700' },
  gfCard: {
    borderRadius: 12, marginBottom: 4, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  gfModeRow: {
    flexDirection: 'row', borderBottomWidth: 1,
  },
  gfModeBtn: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 12,
    alignItems: 'center', gap: 2,
  },
  gfModeBtnBailout: { backgroundColor: '#CC4400' },
  gfModeBtnText: { fontSize: 13, fontWeight: '700' },
  gfModeBtnSub: { fontSize: 11 },
  gfBody: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  gfBodyHint: { fontSize: 11, textAlign: 'center', marginTop: 8 },
  gfBailoutBody: { padding: 16, gap: 10 },
  gfBailoutValueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gfBailoutBadge: {
    backgroundColor: '#CC4400', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  gfBailoutBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  gfBailoutValue: { fontSize: 26, fontWeight: '700' },
  gfBailoutDesc: { fontSize: 12, lineHeight: 18 },
  icdBox: { borderRadius: 8, padding: 12, marginTop: 8, gap: 4 },
  icdTitle: { fontSize: 13, fontWeight: '700' },
  icdItem:  { fontSize: 12 },
  icdNote:  { fontSize: 11, marginTop: 4, fontStyle: 'italic' },
  consumptionCard: {
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4,
    marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  consumptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  consumptionLabel: { fontSize: 14, fontWeight: '600' },
  consumptionValue: { fontSize: 16, fontWeight: '700' },
  warningBox:  { borderRadius: 8, padding: 12, marginTop: 8 },
  warningText: { fontSize: 13 },
  disclaimer:  { borderRadius: 8, padding: 12, marginTop: 16 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },

  // 세션 배너
  sessionBanner: {
    borderWidth: 1.5, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 8,
  },
  sessionBannerText: { fontSize: 13, fontWeight: '600' },

  // 세션 누적 카드
  cumulativeCard: {
    borderRadius: 12, padding: 14, marginTop: 8,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    gap: 8,
  },
  cumulativeTitle: { fontSize: 14, fontWeight: '700' },
  cumRow: { flexDirection: 'row', alignItems: 'center' },
  cumCell: { flex: 1, alignItems: 'center' },
  cumCellLabel: { fontSize: 10, marginBottom: 2 },
  cumCellVal: { fontSize: 16, fontWeight: '600' },
  cumOp: { fontSize: 16, paddingHorizontal: 4 },
  cumOtuBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  cumOtuBarFill: { height: '100%', borderRadius: 4 },
  cumOtuCaption: { fontSize: 11, textAlign: 'right' },

  // 세션에 추가 버튼
  addSessionBtn: {
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 10,
  },
  addSessionBtnText: { fontSize: 15, fontWeight: '700' },
});
