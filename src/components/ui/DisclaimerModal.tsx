import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '../../store/app.store';
import { useTranslation } from '../../i18n';
import { useAppTheme } from '../../context/ThemeContext';

export default function DisclaimerModal() {
  const { hasSeenDisclaimer, markDisclaimerSeen } = useAppStore();
  const { t } = useTranslation();
  const theme = useAppTheme();

  if (hasSeenDisclaimer) return null;

  return (
    <Modal visible animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.iconRow}>
            <Text style={styles.icon}>⚠️</Text>
          </View>
          <Text style={[styles.title, { color: theme.primary }]}>{t('disclaimer_title')}</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.body, { color: theme.text }]}>{t('disclaimer_body')}</Text>
          </ScrollView>

          <TouchableOpacity
            style={[styles.agreeBtn, { backgroundColor: theme.buttonPrimary }]}
            onPress={markDisclaimerSeen}
          >
            <Text style={[styles.agreeBtnText, { color: theme.buttonPrimaryText }]}>
              {t('disclaimer_agree')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  iconRow: { alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 36 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  scroll: { maxHeight: 280, marginBottom: 20 },
  body: { fontSize: 14, lineHeight: 22 },
  agreeBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  agreeBtnText: { fontSize: 16, fontWeight: '700' },
});
