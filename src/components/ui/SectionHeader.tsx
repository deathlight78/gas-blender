import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: theme.accent }]} />
      <View>
        <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
        {!!subtitle && <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
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
  accent: { width: 4, height: 22, borderRadius: 2 },
  title: { fontSize: 15, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 1 },
});
