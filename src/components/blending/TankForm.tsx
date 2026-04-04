import { View, Text, StyleSheet } from 'react-native';
import NumericInput from '../ui/NumericInput';
import GasSlider from '../ui/GasSlider';
import SectionHeader from '../ui/SectionHeader';
import { useAppTheme } from '../../context/ThemeContext';
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

export default function TankForm({
  title,
  values,
  onChange,
  pressureUnit,
  errors = {},
}: TankFormProps) {
  const theme = useAppTheme();
  const fN2 = Math.max(0, 1 - values.fO2 - values.fHe);
  const mixLabel =
    values.fHe > 0
      ? `Trimix ${(values.fO2 * 100).toFixed(0)}/${(values.fHe * 100).toFixed(0)}`
      : values.fO2 !== 0.21
      ? `Nitrox ${(values.fO2 * 100).toFixed(0)}`
      : 'Air';

  function set(patch: Partial<TankValues>) {
    onChange({ ...values, ...patch });
  }

  return (
    <View>
      {!!title && <SectionHeader title={title} />}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <NumericInput
          label="압력"
          value={values.pressure}
          onChangeText={(v) => set({ pressure: v })}
          unit={pressureUnit}
          error={errors.pressure}
        />
        <GasSlider
          label="O₂ %"
          value={values.fO2}
          onChange={(v) => set({ fO2: v })}
          min={0.04}
          max={Math.max(0.04, 1 - values.fHe)}
          step={0.01}
        />
        <GasSlider
          label="He %"
          value={values.fHe}
          onChange={(v) => set({ fHe: v })}
          min={0}
          max={Math.max(0, 1 - values.fO2)}
          step={0.01}
        />
        <View style={[styles.row, { borderTopColor: theme.surfaceAlt }]}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    marginTop: 4,
  },
  n2Box: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  n2Label: { fontSize: 13 },
  n2Value: { fontSize: 16, fontWeight: '700' },
  mixBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  mixBadgeText: { fontSize: 12, fontWeight: '600' },
});
