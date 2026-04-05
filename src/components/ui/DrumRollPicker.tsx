import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, PanResponder, ViewStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

export const DRUM_ITEM_H = 34;
const VISIBLE     = 3;
const CENTER      = Math.floor(VISIBLE / 2);           // = 1
export const DRUM_PICKER_H = DRUM_ITEM_H * VISIBLE;    // = 102
const WINDOW      = 14;   // displayIndex 기준 렌더 범위 (±)
const MOMENTUM_MS = 320;  // 관성 투영 시간 (ms): 빠를수록 더 멀리 날아감

function findNearest(items: number[], value: number): number {
  let best = 0, bestDiff = Math.abs(items[0] - value);
  for (let i = 1; i < items.length; i++) {
    const d = Math.abs(items[i] - value);
    if (d < bestDiff) { bestDiff = d; best = i; }
  }
  return best;
}

interface Props {
  label: string;
  items: number[];
  value: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  style?: ViewStyle;
}

export default function DrumRollPicker({ label, items, value, onChange, formatValue, style }: Props) {
  const theme = useAppTheme();

  const onChangeRef = useRef(onChange);
  const itemsRef   = useRef(items);
  onChangeRef.current = onChange;
  itemsRef.current    = items;

  const initIdx = findNearest(items, value);
  const [displayIndex, setDisplayIndex] = useState(initIdx);
  const displayIdxRef = useRef(initIdx);

  const tyOf     = (idx: number) => (CENTER - idx) * DRUM_ITEM_H;
  const idxOfTY  = (ty: number)  =>
    Math.max(0, Math.min(itemsRef.current.length - 1, Math.round(CENTER - ty / DRUM_ITEM_H)));

  // useNativeDriver: false — addListener로 관성 중 displayIndex를 실시간 갱신하기 위해 필요
  const translateY = useRef(new Animated.Value(tyOf(initIdx))).current;
  const tySnap     = useRef(tyOf(initIdx));

  // translateY 변화 → displayIndex 실시간 동기화 (드래그·관성 모두 처리)
  useEffect(() => {
    const id = translateY.addListener(({ value: ty }) => {
      const idx = idxOfTY(ty);
      if (idx !== displayIdxRef.current) {
        displayIdxRef.current = idx;
        setDisplayIndex(idx);
      }
    });
    return () => translateY.removeListener(id);
  }, []);

  // 외부 value 변경 반영
  useEffect(() => {
    const idx = findNearest(itemsRef.current, value);
    if (idx === displayIdxRef.current) return;
    displayIdxRef.current = idx;
    setDisplayIndex(idx);
    const target = tyOf(idx);
    tySnap.current = target;
    Animated.spring(translateY, {
      toValue: target, useNativeDriver: false, tension: 120, friction: 14,
    }).start();
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:        () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder:         () => true,
      onMoveShouldSetPanResponderCapture:  () => true,
      onPanResponderTerminationRequest:    () => false,

      onPanResponderGrant: () => {
        // 진행 중인 관성 애니메이션을 중단하고 현재 위치 저장
        translateY.stopAnimation(v => { tySnap.current = v; });
      },

      onPanResponderMove: (_, gs) => {
        // addListener가 displayIndex를 갱신하므로 setValue만 호출
        translateY.setValue(tySnap.current + gs.dy);
      },

      onPanResponderRelease: (_, gs) => {
        const currentTY = tySnap.current + gs.dy;

        // ── 관성 투영 ──────────────────────────────────────────────────
        // gs.vy: pts/ms 단위 속도
        // MOMENTUM_MS ms 동안 흘러갈 거리를 더해 목표 인덱스 결정
        const projectedTY = currentTY + gs.vy * MOMENTUM_MS;
        const newIdx      = idxOfTY(projectedTY);
        const snapped     = tyOf(newIdx);
        // ──────────────────────────────────────────────────────────────

        tySnap.current = snapped;

        Animated.spring(translateY, {
          toValue:  snapped,
          velocity: gs.vy * 1000, // pts/ms → pts/s (Animated.spring 단위)
          tension:  38,           // 낮을수록 느리게 감속
          friction: 13,           // 낮을수록 탄성이 많아짐
          useNativeDriver: false,
        }).start();

        onChangeRef.current(itemsRef.current[newIdx]);
      },
    })
  ).current;

  const startIdx = Math.max(0, displayIndex - WINDOW);
  const endIdx   = Math.min(items.length - 1, displayIndex + WINDOW);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.wrap} {...panResponder.panHandlers} // @ts-ignore — web only
        onTouchStart={(e) => e.stopPropagation()}
      >
        <View style={[styles.line, { top: CENTER * DRUM_ITEM_H,       backgroundColor: theme.accent }]} />
        <View style={[styles.line, { top: (CENTER + 1) * DRUM_ITEM_H, backgroundColor: theme.accent }]} />

        <Animated.View style={[styles.layer, { transform: [{ translateY }] }]}>
          {Array.from({ length: endIdx - startIdx + 1 }, (_, off) => {
            const idx  = startIdx + off;
            const dist = Math.abs(idx - displayIndex);
            const sel  = dist === 0;
            return (
              <View key={idx} style={[styles.item, { top: idx * DRUM_ITEM_H }]}>
                <Text style={{
                  fontSize:   sel ? 20 : dist === 1 ? 15 : 12,
                  fontWeight: sel ? '700' : '400',
                  color:      sel ? theme.text : theme.textMuted,
                  opacity:    sel ? 1 : dist === 1 ? 0.5 : 0.15,
                }}>
                  {formatValue ? formatValue(items[idx]) : String(items[idx])}
                </Text>
              </View>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  label:     { fontSize: 10, fontWeight: '600', marginBottom: 4, letterSpacing: 0.5 },
  wrap:      { height: DRUM_PICKER_H, width: '100%', overflow: 'hidden', touchAction: 'none' } as any,
  line: {
    position: 'absolute', left: 4, right: 4, height: 1, zIndex: 2, opacity: 0.35,
  },
  layer: { position: 'absolute', left: 0, right: 0 },
  item: {
    position: 'absolute', left: 0, right: 0,
    height: DRUM_ITEM_H, justifyContent: 'center', alignItems: 'center',
  },
});
