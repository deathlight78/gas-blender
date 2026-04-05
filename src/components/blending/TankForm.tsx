import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DrumRollPicker from '../ui/DrumRollPicker';
import SectionHeader from '../ui/SectionHeader';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { PressureUnit } from '../../types/gas.types';

interface TankValues {
  pressure: string;
  fO2: number;
  fHe: number;
}

interface TankFormProps {
  title: string;
  values: TankValues;
  onChange: (values: TankValues) => void;
  pressureUnit: PressureUnit;
  errors?: { pressure?: string };
}

function buildRange(min: number, max: number, step = 1): number[] {
  const arr: number[] = [];
  for (let v = min; v <= max; v = Math.round((v + step) * 1000) / 1000) {
    arr.push(v);
  }
  return arr;
}

const O2_ITEMS = buildRange(4, 100);
const HE_ITEMS = buildRange(0, 96);

export default function TankForm({ title, values, onChange, pressureUnit, errors = {} }: TankFormProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const fN2 = Math.max(0, 1 - values.fO2 - values.fHe);
  const mixLabel =
    values.fHe > 0
      ? `Trimix ${(values.fO2 * 100).toFixed(0)}/${(values.fHe * 100).toFixed(0)}`
      : values.fO2 !== 0.21
      ? `Nitrox ${(values.fO2 * 100).toFixed(0)}`
      : 'Air';

  const pressureItems = useMemo(() => {
    return pressureUnit === 'psi' ? buildRange(0, 4350, 10) : buildRange(0, 300, 1);
  }, [pressureUnit]);

  const pressureValue = useMemo(() => {
    const v = parseFloat(values.pressure) || 0;
    // PSI는 10 단위로 반올림
    return pressureUnit === 'psi' ? Math.round(v / 10) * 10 : Math.round(v);
  }, [values.pressure, pressureUnit]);

  const o2Pct = Math.round(values.fO2 * 100);
  const hePct = Math.round(values.fHe * 100);

  function onPressureChange(v: number) {
    onChange({ ...values, pressure: String(v) });
  }

  function onO2Change(v: number) {
    const newO2 = v / 100;
    // He가 너무 크면 자동으로 줄임
    const maxHe = Math.floor((1 - newO2) * 100);
    const newHe = Math.min(values.fHe, maxHe / 100);
    onChange({ ...values, fO2: newO2, fHe: newHe });
  }

  function onHeChange(v: number) {
    const newHe = v / 100;
    // O2가 너무 크면 자동으로 줄임
    const maxO2 = Math.floor((1 - newHe) * 100);
    const newO2 = Math.max(0.04, Math.min(values.fO2, maxO2 / 100));
    onChange({ ...values, fO2: newO2, fHe: newHe });
  }

  return (
    <View>
      {!!title && <SectionHeader title={title} compact />}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.pickerRow}>
          {/* 압력 컬럼 */}
          <DrumRollPicker
            label={pressureUnit.toUpperCase()}
            items={pressureItems}
            value={pressureValue}
            onChange={onPressureChange}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* O2 % 컬럼 */}
          <DrumRollPicker
            label={t('blend_oxygen_pct')}
            items={O2_ITEMS}
            value={o2Pct}
            onChange={onO2Change}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* He % 컬럼 */}
          <DrumRollPicker
            label={t('blend_helium_pct')}
            items={HE_ITEMS}
            value={hePct}
            onChange={onHeChange}
          />
        </View>

        {/* N2 / 믹스 배지 */}
        <View style={[styles.footer, { borderTopColor: theme.surfaceAlt }]}>
          <View style={styles.n2Box}>
            <Text style={[styles.n2Label, { color: theme.textMuted }]}>N₂</Text>
            <Text style={[styles.n2Value, { color: theme.text }]}>
              {(fN2 * 100).toFixed(0)} %
            </Text>
          </View>
          <View style={[styles.mixBadge, { backgroundColor: theme.infoBg }]}>
            <Text style={[styles.mixBadgeText, { color: theme.accent }]}>{mixLabel}</Text>
          </View>
        </View>

        {errors.pressure && (
          <Text style={[styles.errorText, { color: theme.errorText }]}>{errors.pressure}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingTop: 10,
    paddingHorizontal: 6,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: 2,
    marginTop: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    paddingHorizontal: 6,
  },
  n2Box: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  n2Label: { fontSize: 12 },
  n2Value: { fontSize: 14, fontWeight: '700' },
  mixBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  mixBadgeText: { fontSize: 11, fontWeight: '600' },
  errorText: { fontSize: 12, marginTop: 6, paddingHorizontal: 8 },
});
