import { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

const THUMB_SIZE = 22;
const TRACK_HEIGHT = 8;

interface GasSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export default function GasSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  disabled = false,
}: GasSliderProps) {
  const theme = useAppTheme();
  const pct = Math.round(value * 100);

  // Stable refs for PanResponder closure
  const trackWRef = useRef(0);
  const trackPageXRef = useRef(0);
  const disabledRef = useRef(disabled);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const stepRef = useRef(step);
  const onChangeRef = useRef(onChange);

  disabledRef.current = disabled;
  minRef.current = min;
  maxRef.current = max;
  stepRef.current = step;
  onChangeRef.current = onChange;

  function clamp(v: number) {
    return Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  }

  function handleTextChange(text: string) {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) onChange(clamp(parsed / 100));
  }

  function applyX(x: number) {
    if (disabledRef.current || trackWRef.current <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / trackWRef.current));
    const raw = minRef.current + ratio * (maxRef.current - minRef.current);
    const stepped = Math.round(raw / stepRef.current) * stepRef.current;
    const clamped = Math.min(maxRef.current, Math.max(minRef.current, Math.round(stepped * 100) / 100));
    onChangeRef.current(clamped);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderGrant: (e) => {
        // Grant 시점 locationX는 트랙 내 정확한 위치
        // pageX - locationX = 트랙 왼쪽 모서리의 절대 X 좌표 저장
        trackPageXRef.current = e.nativeEvent.pageX - e.nativeEvent.locationX;
        applyX(e.nativeEvent.locationX);
      },
      onPanResponderMove: (_, gestureState) => {
        // Move 중엔 gestureState.moveX (절대 좌표) - 트랙 왼쪽 = 트랙 내 위치
        applyX(gestureState.moveX - trackPageXRef.current);
      },
    })
  ).current;

  const fillPct = ((value - min) / (max - min)) * 100;
  const thumbLeft = trackWRef.current > 0
    ? (fillPct / 100) * trackWRef.current - THUMB_SIZE / 2
    : undefined;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.infoBg }, disabled && styles.btnDisabled]}
          onPress={() => onChange(clamp(value - step))}
          disabled={disabled}
        >
          <Text style={[styles.stepBtnText, { color: theme.accent }]}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
            disabled && { backgroundColor: theme.inputDisabledBg, color: theme.textMuted },
          ]}
          value={String(pct)}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          editable={!disabled}
          selectTextOnFocus
        />

        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.infoBg }, disabled && styles.btnDisabled]}
          onPress={() => onChange(clamp(value + step))}
          disabled={disabled}
        >
          <Text style={[styles.stepBtnText, { color: theme.accent }]}>+</Text>
        </TouchableOpacity>

        <Text style={[styles.pctLabel, { color: theme.textMuted }]}>%</Text>
      </View>

      <View
        style={styles.trackHitArea}
        onLayout={(e) => { trackWRef.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.fill,
              { backgroundColor: disabled ? theme.textMuted : theme.accent, width: `${fillPct}%` as any },
            ]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: disabled ? theme.textMuted : theme.accent,
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
  btnDisabled: { opacity: 0.4 },
  stepBtnText: { fontSize: 20, lineHeight: 24 },
  input: {
    width: 64,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 6,
  },
  pctLabel: { fontSize: 14, fontWeight: '500' },
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
