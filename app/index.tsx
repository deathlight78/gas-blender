import { useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppTheme } from '../src/context/ThemeContext';
import { useTranslation } from '../src/i18n';

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const theme = useAppTheme();

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const { t } = useTranslation();

  const FEATURES = [
    { title: t('home_card_oc_title'),       subtitle: t('home_card_oc_sub'),       route: '/blending',   color: theme.accent },
    { title: t('home_card_ccr_title'),      subtitle: t('home_card_ccr_sub'),      route: '/blending',   color: theme.accentSub },
    { title: t('home_card_gas_plan_title'), subtitle: t('home_card_gas_plan_sub'), route: '/gas-plan',   color: '#008844' },
    { title: t('home_card_deco_title'),     subtitle: t('home_card_deco_sub'),     route: '/deco',       color: '#CC5500' },
    { title: t('home_card_calc_title'),     subtitle: t('home_card_calc_sub'),     route: '/calculator', color: '#7C3AED' },
  ];

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>{t('home_title')}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>{t('home_subtitle')}</Text>
      </View>

      <View style={[styles.disclaimer, { backgroundColor: theme.warningBg }]}>
        <Text style={[styles.disclaimerText, { color: theme.warningText }]}>{t('home_disclaimer')}</Text>
      </View>

      <View style={styles.grid}>
        {FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature.title}
            style={[styles.card, { backgroundColor: theme.surface, borderLeftColor: feature.color }]}
            onPress={() => router.push(feature.route as any)}
          >
            <Text style={[styles.cardTitle, { color: feature.color }]}>{feature.title}</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>{feature.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  disclaimer: { borderRadius: 8, padding: 12, marginBottom: 20 },
  disclaimerText: { fontSize: 12 },
  grid: { gap: 12 },
  card: {
    borderRadius: 12, padding: 20, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, marginTop: 4 },
});
