import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList, Text,
  TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { ShoppingSectionCard } from '../components/ShoppingSectionCard';
import { useShoppingRealtime } from '../hooks/useShoppingRealtime';

const EMOJI_OPTIONS = ['🛒', '🧹', '💊', '🐾', '🍷', '🎉', '🏠', '👕', '🔧', '🥦'];

export const ShoppingScreen = () => {
  const navigation = useNavigation<any>();
  const { shoppingSections, addSection, syncCount, isOnline, toggleNetwork } = useShoppingRealtime();

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName]           = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🛒');

  const handleCreate = () => {
    if (newName.trim()) {
      addSection(newName.trim(), selectedEmoji);
      setNewName('');
      setSelectedEmoji('🛒');
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping</Text>
          <Text style={styles.headerSubtitle}>Listas de tu hogar</Text>
        </View>
        <TouchableOpacity style={styles.networkBadge} onPress={toggleNetwork}>
          <Text style={{ color: isOnline ? colors.success : colors.accent, fontSize: 11 }}>
            {isOnline ? '🟢 Online' : `🔴 Offline (${syncCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Section List ── */}
      <FlatList
        data={shoppingSections}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ShoppingSectionCard
            section={item}
            onPress={() =>
              navigation.navigate('ShoppingSectionDetail', {
                sectionId: item.id,
                sectionName: `${item.emoji} ${item.name}`,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cart-variant" size={56} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Sin listas todavía</Text>
            <Text style={styles.emptySubtitle}>
              Crea una sección para empezar{'\n'}(ej: Supermercado, Limpieza…)
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyButtonText}>+ Crear primera lista</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ── FAB ── */}
      {shoppingSections.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
          <MaterialCommunityIcons name="plus" size={28} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* ── Create Section Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalWrapper}
          >
            <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Nueva lista</Text>

                {/* Emoji picker */}
                <View style={styles.emojiRow}>
                  {EMOJI_OPTIONS.map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[
                        styles.emojiOption,
                        selectedEmoji === e && styles.emojiOptionSelected,
                      ]}
                      onPress={() => setSelectedEmoji(e)}
                    >
                      <Text style={styles.emojiText}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Name input */}
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de la lista (ej: Supermercado)"
                  placeholderTextColor={colors.textSecondary}
                  value={newName}
                  onChangeText={setNewName}
                  onSubmitEditing={handleCreate}
                  returnKeyType="done"
                  autoFocus
                />

                <TouchableOpacity
                  style={[styles.createButton, !newName.trim() && styles.createButtonDisabled]}
                  onPress={handleCreate}
                  disabled={!newName.trim()}
                >
                  <Text style={styles.createButtonText}>Crear lista</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  networkBadge: {
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.sizes.body,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    width: '100%',
  },
  modalCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
  },
  modalTitle: {
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  emojiText: { fontSize: 22 },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    height: 50,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  createButtonDisabled: { opacity: 0.4 },
  createButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.body,
  },
});
