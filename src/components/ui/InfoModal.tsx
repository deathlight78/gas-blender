import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function InfoModal({ visible, onClose, title, content }: Props) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.body, { color: theme.text }]}>{content}</Text>
          </ScrollView>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: theme.buttonPrimary }]}
            onPress={onClose}
          >
            <Text style={[styles.closeBtnText, { color: theme.buttonPrimaryText }]}>
              {t('info_close')}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  scroll: { maxHeight: 380, marginBottom: 16 },
  body: { fontSize: 13, lineHeight: 21, fontFamily: 'System' },
  closeBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 15, fontWeight: '700' },
});
