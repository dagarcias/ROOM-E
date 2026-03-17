import React from 'react';
import {
  View, Text, StyleSheet, Modal,
  TouchableOpacity, TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { Expense } from '../types';
import { formatRelativeDate, formatCurrency } from '../utils/formatters';

interface Props {
  expense: Expense | null;
  visible: boolean;
  memberNames: Record<string, string>; // userId → display name
  onClose: () => void;
  onDelete: () => void;
}

export const ExpenseDetailSheet: React.FC<Props> = ({
  expense, visible, memberNames, onClose, onDelete,
}) => {
  if (!expense) return null;

  const payerName       = memberNames[expense.payerId] ?? 'Alguien';
  const perPerson       = expense.participantIds.length > 0
    ? expense.amount / expense.participantIds.length
    : expense.amount;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Icon + Title */}
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="receipt" size={26} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>{expense.title}</Text>
            <Text style={styles.date}>{formatRelativeDate(expense.date)}</Text>
          </View>
        </View>

        {/* Amount Hero */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Monto total</Text>
          <Text style={styles.amountValue}>{formatCurrency(expense.amount)}</Text>
          <Text style={styles.perPerson}>
            {formatCurrency(perPerson)} por persona · {expense.participantIds.length} participante{expense.participantIds.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Details */}
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account-cash" size={18} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Pagado por</Text>
            <Text style={styles.detailValue}>{payerName}</Text>
          </View>

          <View style={styles.splitSection}>
            <Text style={styles.splitTitle}>División entre roommates</Text>
            {expense.participantIds.map(uid => (
              <View key={uid} style={styles.splitRow}>
                <View style={styles.splitAvatar}>
                  <Text style={styles.splitAvatarText}>
                    {(memberNames[uid] ?? '?')[0].toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.splitName}>{memberNames[uid] ?? uid}</Text>
                <Text style={styles.splitAmount}>
                  {uid === expense.payerId ? '✓ Pagó' : `debe ${formatCurrency(perPerson)}`}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Delete action */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => { onDelete(); onClose(); }}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.accent} />
          <Text style={styles.deleteBtnText}>Eliminar gasto</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingBottom: 36,
    paddingTop: spacing.md,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  date: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },
  amountBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  perPerson: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  scroll: { maxHeight: 260 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  detailLabel: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.sizes.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  splitSection: { marginTop: spacing.lg },
  splitTitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  splitAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  splitName: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  splitAmount: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${colors.accent}40`,
    backgroundColor: `${colors.accent}10`,
    borderRadius: 12,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  deleteBtnText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: typography.sizes.body,
  },
});
