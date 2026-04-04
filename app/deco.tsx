import { View, Text, StyleSheet } from 'react-native';

export default function DecoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Deco Planning — Coming Soon</Text>
      <Text style={styles.sub}>Bühlmann ZHL-16C + Gradient Factor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' },
  text: { fontSize: 20, fontWeight: '600', color: '#003366' },
  sub: { fontSize: 13, color: '#666', marginTop: 8 },
});
