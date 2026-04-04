import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const FEATURES = [
  {
    title: 'OC Blending',
    subtitle: 'Nitrox / Trimix partial pressure',
    route: '/blending',
    color: '#0077CC',
  },
  {
    title: 'CCR Blending',
    subtitle: 'Diluent + O₂ setpoint',
    route: '/blending',
    color: '#005599',
  },
  {
    title: 'MOD / EAD / END',
    subtitle: 'Quick gas calculators',
    route: '/calculator',
    color: '#008844',
  },
  {
    title: 'Deco Planning',
    subtitle: 'Bühlmann ZHL-16C + GF',
    route: '/deco',
    color: '#CC5500',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Gas Blender</Text>
        <Text style={styles.subtitle}>Technical Diving Calculator</Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ For reference only. Always verify calculations with a qualified instructor.
        </Text>
      </View>

      <View style={styles.grid}>
        {FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature.title}
            style={[styles.card, { borderLeftColor: feature.color }]}
            onPress={() => router.push(feature.route as any)}
          >
            <Text style={[styles.cardTitle, { color: feature.color }]}>{feature.title}</Text>
            <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#003366' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  disclaimer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  disclaimerText: { fontSize: 12, color: '#856404' },
  grid: { gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
});
