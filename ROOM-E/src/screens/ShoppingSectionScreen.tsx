import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList, Text,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { ShoppingItemCard } from '../components/ShoppingItemCard';
import { useShoppingRealtime } from '../hooks/useShoppingRealtime';
import { useAppStore } from '../store/useAppStore';

type RouteParams = {
  sectionId: string;
  sectionName: string;
};

export const ShoppingSectionScreen = () => {
  const navigation = useNavigation<any>();
  const route      = useRoute();
  const { sectionId, sectionName } = route.params as RouteParams;

  const { shoppingSections, addItemToSection, toggleItemInSection, removeItemFromSection } =
    useShoppingRealtime();

  const user = useAppStore(state => state.user);

  const section = shoppingSections.find(s => s.id === sectionId);

  const [newItemName, setNewItemName] = useState('');

  if (!section) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lista no encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleQuickAdd = () => {
    if (newItemName.trim()) {
      addItemToSection(sectionId, newItemName.trim());
      setNewItemName('');
    }
  };

  const handleConvertToExpense = () => {
    navigation.navigate('ConvertExpenseModal', { sectionId });
  };

  const sortedItems = [...section.items].sort((a, b) => {
    if (a.isPurchased !== b.isPurchased) return a.isPurchased ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const purchasedCount = section.items.filter(i => i.isPurchased).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ── */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle} numberOfLines={1}>{sectionName}</Text>
            <Text style={styles.headerSubtitle}>
              {section.items.length === 0
                ? 'Sin ítems'
                : `${purchasedCount} / ${section.items.length} comprados`}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Items List ── */}
      <FlatList
        data={sortedItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ShoppingItemCard
            item={item}
            onTogglePurchase={() => toggleItemInSection(sectionId, item.id)}
            onDelete={() => removeItemFromSection(sectionId, item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cart-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Lista vacía</Text>
            <Text style={styles.emptySubText}>Agrega ítems usando el campo de abajo.</Text>
          </View>
        }
      />

      {/* ── Convert CTA — aparece cuando hay ítems comprados ── */}
      {purchasedCount > 0 && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleConvertToExpense} activeOpacity={0.85}>
            <Text style={styles.ctaText}>
              Convertir {purchasedCount} comprado{purchasedCount > 1 ? 's' : ''} a Gasto
            </Text>
            <MaterialCommunityIcons name="arrow-right-circle" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Quick Add Bar ── */}
      <SafeAreaView edges={['bottom']} style={styles.quickAddSafe}>
        <View style={styles.quickAddContainer}>
          <TextInput
            style={styles.input}
            placeholder="Agregar ítem… (ej: Leche, Jabón)"
            placeholderTextColor={colors.textSecondary}
            value={newItemName}
            onChangeText={setNewItemName}
            onSubmitEditing={handleQuickAdd}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleQuickAdd}>
            <MaterialCommunityIcons name="plus" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerSafe: { backgroundColor: colors.card },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerContent: { flex: 1 },
  headerTitle: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: { padding: spacing.xl, paddingBottom: 120 },
  emptyContainer: { alignItems: 'center', marginTop: spacing.xxxl },
  emptyText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.h3,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptySubText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 90,
    left: spacing.xl,
    right: spacing.xl,
  },
  ctaButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    elevation: 4,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  ctaText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: typography.sizes.body,
    marginRight: spacing.sm,
  },
  quickAddSafe: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickAddContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.textSecondary, fontSize: typography.sizes.body },
});
