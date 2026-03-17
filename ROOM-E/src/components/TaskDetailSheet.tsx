import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { Task } from '../types';
import { formatRelativeDate } from '../utils/formatters';

interface Props {
  task: Task | null;
  visible: boolean;
  memberNames: Record<string, string>;
  onClose: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Cleaning: 'broom',
  General: 'check-circle-outline',
  Shopping: 'cart-outline',
  Cooking: 'silverware-fork-knife',
  Maintenance: 'wrench-outline',
};

export const TaskDetailSheet: React.FC<Props> = ({
  task, visible, memberNames, onClose, onToggle, onDelete,
}) => {
  if (!task) return null;

  const isCompleted  = task.status === 'completed';
  const isRecurring  = task.recurrence === 'weekly';
  const categoryIcon = CATEGORY_ICONS[task.category ?? ''] ?? 'clipboard-text-outline';

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

        {/* Status badge */}
        <View style={[styles.statusBadge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
          <MaterialCommunityIcons
            name={isCompleted ? 'check-circle' : 'clock-outline'}
            size={14}
            color={isCompleted ? colors.success : colors.accent}
          />
          <Text style={[styles.statusText, { color: isCompleted ? colors.success : colors.accent }]}>
            {isCompleted ? 'Completada' : 'Pendiente'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{task.title}</Text>

        {/* Details */}
        <ScrollView style={styles.detailsScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Asignado a</Text>
            <Text style={styles.detailValue}>{memberNames[task.assignee] ?? task.assignee}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Vence</Text>
            <Text style={styles.detailValue}>{formatRelativeDate(task.dueDate)}</Text>
          </View>

          {task.category && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name={categoryIcon as any} size={18} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Categoría</Text>
              <Text style={styles.detailValue}>{task.category}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="repeat" size={18} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Recurrencia</Text>
            <View style={[styles.chip, isRecurring ? styles.chipActive : styles.chipInactive]}>
              <Text style={[styles.chipText, isRecurring ? styles.chipTextActive : styles.chipTextInactive]}>
                {isRecurring ? '🔁 Semanal' : 'Sin recurrencia'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.toggleBtn]}
            onPress={() => { onToggle(); onClose(); }}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name={isCompleted ? 'refresh' : 'check-bold'}
              size={18}
              color={colors.white}
            />
            <Text style={styles.actionBtnText}>
              {isCompleted ? 'Marcar pendiente' : 'Marcar completada'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => { onDelete(); onClose(); }}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.accent} />
            <Text style={[styles.actionBtnText, { color: colors.accent }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
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
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: spacing.sm,
    gap: 5,
  },
  badgeCompleted: { backgroundColor: `${colors.success}20` },
  badgePending: { backgroundColor: `${colors.accent}20` },
  statusText: { fontSize: 12, fontWeight: '600' },
  title: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  detailsScroll: { maxHeight: 220 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  detailLabel: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: 12,
  },
  chipActive: { backgroundColor: `${colors.primary}20` },
  chipInactive: { backgroundColor: colors.background },
  chipText: { fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.primary },
  chipTextInactive: { color: colors.textSecondary },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  toggleBtn: { backgroundColor: colors.primary },
  deleteBtn: {
    backgroundColor: `${colors.accent}15`,
    borderWidth: 1,
    borderColor: `${colors.accent}40`,
  },
  actionBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.body,
  },
});
