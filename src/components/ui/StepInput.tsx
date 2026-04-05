import { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, PanResponder, ViewStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

const THUMB_SIZE = 22;
const TRACK_HEIGHT = 8;

interface StepInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  formatValue?: (v: number) => string;
  containerStyle?: ViewStyle;
}

export default function StepInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit,
  formatValue,
  containerStyle,
}: StepInputProps) {
  const theme = useAppTheme();

  const trackWRef    = useRef(0);
  const trackPageXRef = useRef(0);
  const minRef       = useRef(min);
  const maxRef       = useRef(max);
  const stepRef      = useRef(step);
  const onChangeRef  = useRef(onChange);

  minRef.current      = min;
  maxRef.current      = max;
  stepRef.current     = step;
  onChangeRef.current = onChange;

  function snap(v: number) {
    const stepped = Math.round(v / stepRef.current) * stepRef.current;
    // round to avoid floating point drift
    const precision = stepRef.current < 1 ? String(stepRef.current).split('.')[1]?.length ?? 2 : 0;
    const rounded = parseFloat(stepped.toFixed(precision));
    return Math.min(maxRef.current, Math.max(minRef.current, rounded));
  }

  function handleTextChange(text: string) {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) onChange(snap(parsed));
  }

  function applyX(x: number) {
    if (trackWRef.current <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / trackWRef.current));
    const raw = minRef.current + ratio * (maxRef.current - minRef.current);
    onChangeRef.current(snap(raw));
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (e) => {
        trackPageXRef.current = e.nativeEvent.pageX - e.nativeEvent.locationX;
        applyX(e.nativeEvent.locationX);
      },
      onPanResponderMove: (_, gs) => {
        applyX(gs.moveX - trackPageXRef.current);
      },
    })
  ).current;

  const fillPct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const thumbLeft = trackWRef.current > 0
    ? (fillPct / 100) * trackWRef.current - THUMB_SIZE / 2
    : undefined;

  const displayText = formatValue ? formatValue(value) : String(value);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.infoBg }]}
          onPress={() => onChange(snap(value - step))}
        >
          <Text style={[styles.stepBtnText, { color: theme.accent }]}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={displayText}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          selectTextOnFocus
        />

        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.infoBg }]}
          onPress={() => onChange(snap(value + step))}
        >
          <Text style={[styles.stepBtnText, { color: theme.accent }]}>+</Text>
        </TouchableOpacity>

        {unit ? <Text style={[styles.unitLabel, { color: theme.textMuted }]}>{unit}</Text> : null}
      </View>

      <View
        style={styles.trackHitArea}
        onLayout={(e) => { trackWRef.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, { backgroundColor: theme.border }]}>
          <View style={[styles.fill, { backgroundColor: theme.accent, width: `${fillPct}%` as any }]} />
        </View>
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: theme.accent,
              borderColor: theme.surface,
              left: thumbLeft ?? (`${fillPct}%` as any),
            },
          ]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 20, lineHeight: 24 },
  input: {
    width: 80,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 6,
  },
  unitLabel: { fontSize: 14, fontWeight: '500' },
  trackHitArea: {
    marginTop: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  fill: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
    top: 8 - THUMB_SIZE / 2 + TRACK_HEIGHT / 2,
  },
});
