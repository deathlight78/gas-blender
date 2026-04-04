import { View, Text, StyleSheet } from 'react-native';

export default function BlendingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Blending — Coming Soon</Text>
      <Text style={styles.sub}>OC (Nitrox/Trimix) & CCR blending</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' },
  text: { fontSize: 20, fontWeight: '600', color: '#003366' },
  sub: { fontSize: 13, color: '#666', marginTop: 8 },
});
