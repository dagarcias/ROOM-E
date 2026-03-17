import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { RecurringExpense } from '../types';
import { formatCurrency } from '../utils/formatters';

interface Props {
  item: RecurringExpense;
  payerName?: string;
  onLongPress: () => void;
  onToggle: () => void;
}

const getDueStatus = (dueDay: number): { label: string; urgent: boolean } => {
  const today   = new Date().getDate();
  const daysLeft = dueDay >= today ? dueDay - today : 31 - today + dueDay;
  if (daysLeft === 0) return { label: 'Vence hoy', urgent: true };
  if (daysLeft <= 5)  return { label: `Vence en ${daysLeft}d`, urgent: true };
  return { label: `Día ${dueDay}`, urgent: false };
};

export const RecurringExpenseCard: React.FC<Props> = ({ item, payerName, onLongPress, onToggle }) => {
  const perPerson   = item.participantIds?.length > 0 ? item.amount / item.participantIds.length : item.amount;
  const dueStatus   = getDueStatus(item.dueDay);
  const recurLabel  = item.recurrence === 'monthly' ? 'mensual' : 'anual';

  return (
    <Pressable
      style={[styles.card, !item.isActive && styles.cardInactive]}
      onLongPress={onLongPress}
      android_ripple={{ color: colors.border }}
    >
      {/* Icon + Info */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.title, !item.isActive && styles.textInactive]}>{item.title}</Text>
          <Text style={styles.sub}>
            {formatCurrency(perPerson)} / persona · {recurLabel}
          </Text>
          {payerName && (
            <Text style={[styles.sub, { marginTop: 0 }]}>
              Pagado por {payerName}
            </Text>
          )}
        </View>

        <View style={styles.right}>
          <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
          <View style={[styles.dueBadge, dueStatus.urgent && styles.dueBadgeUrgent]}>
            <Text style={[styles.dueText, dueStatus.urgent && styles.dueTextUrgent]}>
              {dueStatus.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.splitInfo}>
          <MaterialCommunityIcons name="account-group-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.splitText}>{item.participantIds?.length || 0} personas</Text>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, item.isActive ? styles.toggleBtnActive : styles.toggleBtnPaused]}
          onPress={onToggle}
        >
          <Text style={[styles.toggleText, item.isActive ? styles.toggleTextActive : styles.toggleTextPaused]}>
            {item.isActive ? 'Activo' : 'Pausado'}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardInactive: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  title: {
    fontSize: typography.sizes.h3,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textInactive: { color: colors.textSecondary },
  sub: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: {
    fontSize: typography.sizes.h3,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dueBadge: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dueBadgeUrgent: { backgroundColor: `${colors.accent}20` },
  dueText: { fontSize: 10, fontWeight: '600', color: colors.primary },
  dueTextUrgent: { color: colors.accent },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  splitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  splitText: { fontSize: 12, color: colors.textSecondary },
  toggleBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  toggleBtnActive: {
    borderColor: `${colors.success}50`,
    backgroundColor: `${colors.success}15`,
  },
  toggleBtnPaused: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  toggleText: { fontSize: 11, fontWeight: '600' },
  toggleTextActive: { color: colors.success },
  toggleTextPaused: { color: colors.textSecondary },
});
