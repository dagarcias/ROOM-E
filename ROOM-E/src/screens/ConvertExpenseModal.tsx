import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import { useShoppingRealtime } from '../hooks/useShoppingRealtime';

type RouteParams = {
  sectionId: string;
};

export const ConvertExpenseModal = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { sectionId } = (route.params ?? {}) as RouteParams;

  const { shoppingSections, convertSectionToExpense } = useShoppingRealtime();
  const { user, houseMembers } = useAppStore();

  const section        = shoppingSections.find(s => s.id === sectionId);
  const purchasedItems = section?.items.filter(i => i.isPurchased) ?? [];

  // Pre-fill amount from estimated prices
  const estimatedTotal = purchasedItems
    .reduce((sum, item) => sum + (item.estimatedPrice ?? 0), 0);

  const [amount, setAmount] = useState(
    estimatedTotal > 0 ? estimatedTotal.toFixed(2) : '',
  );

  const handleConvert = () => {
    if (!sectionId || !user || purchasedItems.length === 0) {
      navigation.goBack();
      return;
    }
    const allMemberIds = houseMembers.map(m => (m as any).userId ?? m.id);
    const parsedAmount = parseFloat(amount);
    convertSectionToExpense(
      sectionId,
      allMemberIds,
      Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : undefined,
    );
    navigation.goBack();
  };

  // Guard: no purchased items
  if (!section || purchasedItems.length === 0) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} onPress={() => navigation.goBack()} activeOpacity={1} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Sin ítems comprados</Text>
          <Text style={styles.subtitle}>
            Marca al menos un ítem como comprado (✓) antes de convertirlo en un gasto.
          </Text>
          <TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack()}>
            <Text style={styles.submitText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backdrop} onPress={() => navigation.goBack()} activeOpacity={1} />
      <View style={styles.sheet}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Convertir a Gasto</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <MaterialCommunityIcons name="cart-check" size={18} color={colors.success} />
          <Text style={styles.summaryText}>
            <Text style={styles.bold}>{purchasedItems.length}</Text> ítem
            {purchasedItems.length > 1 ? 's' : ''} comprado
            {purchasedItems.length > 1 ? 's' : ''} de{' '}
            <Text style={styles.bold}>{section.emoji} {section.name}</Text>
            {' '}se moverán a Gastos.
          </Text>
        </View>

        {/* Item preview */}
        <View style={styles.itemPreview}>
          {purchasedItems.slice(0, 5).map(item => (
            <View key={item.id} style={styles.itemRow}>
              <MaterialCommunityIcons name="check-circle" size={14} color={colors.success} />
              <Text style={styles.itemText}>{item.name}</Text>
              {item.estimatedPrice != null && (
                <Text style={styles.itemPrice}>${item.estimatedPrice.toFixed(2)}</Text>
              )}
            </View>
          ))}
          {purchasedItems.length > 5 && (
            <Text style={styles.moreItems}>+{purchasedItems.length - 5} más...</Text>
          )}
        </View>

        {/* Amount input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monto total ($)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            autoFocus={estimatedTotal === 0}
          />
          {estimatedTotal > 0 && (
            <Text style={styles.hint}>
              Pre-calculado de los precios estimados. Puedes ajustarlo.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleConvert} activeOpacity={0.85}>
          <Text style={styles.submitText}>Confirmar conversión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: { flex: 1 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 44 : spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.success}15`,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  summaryText: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  itemPreview: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemText: {
    flex: 1,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: typography.sizes.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  moreItems: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  inputGroup: { marginBottom: spacing.xl },
  label: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    height: 56,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: colors.white,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold as '700',
  },
});
