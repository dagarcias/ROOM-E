import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { Task } from '../types';
import { formatRelativeDate } from '../utils/formatters';

interface TaskCardProps {
  task: Task;
  assigneeName: string;
  onToggleComplete: () => void;
  onDelete?: () => void;
  onLongPress?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, assigneeName, onToggleComplete, onDelete, onLongPress }) => {
  const isCompleted = task.status === 'completed';
  const isWeekly    = task.recurrence === 'weekly';

  return (
    <Pressable
      style={styles.card}
      onLongPress={onLongPress}
      android_ripple={{ color: colors.border }}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggleComplete}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isCompleted ? "check-circle" : "checkbox-blank-circle-outline"}
          size={24}
          color={isCompleted ? colors.success : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>
          {task.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.assignee}>{assigneeName}</Text>
          {task.category && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{task.category}</Text>
            </View>
          )}
          {isWeekly && (
            <View style={[styles.badge, styles.weeklyBadge]}>
              <Text style={[styles.badgeText, styles.weeklyText]}>🔁 Semanal</Text>
            </View>
          )}
          <View style={styles.dateBadge}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={12}
              color={isCompleted ? colors.textSecondary : colors.primary}
            />
            <Text style={[styles.dateText, isCompleted && styles.completedText]}>
              {formatRelativeDate(task.dueDate)}
            </Text>
          </View>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="trash-can-outline" size={22} color={'#FF5252'} />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignee: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold as '600',
    color: colors.primary,
    marginRight: spacing.sm,
  },
  badge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 10,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: typography.weights.semibold as '600',
  },
  deleteButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  weeklyBadge: {
    backgroundColor: `${colors.primary}15`,
    marginLeft: spacing.sm,
  },
  weeklyText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

