import { View, Text, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accent} />
      <View>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 12,
  },
  accent: { width: 4, height: 22, backgroundColor: '#0077CC', borderRadius: 2 },
  title: { fontSize: 15, fontWeight: '700', color: '#003366' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 1 },
});
