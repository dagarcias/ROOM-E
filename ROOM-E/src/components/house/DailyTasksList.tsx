import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/colors';
import { TaskCard } from '../TaskCard';
import { Task } from '../../types';

interface Props {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const DailyTasksList = ({ tasks, onToggleTask, onDeleteTask }: Props) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Today's Chores</Text>
      </View>

      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>No chores today! 🎉</Text>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={() => onToggleTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: spacing.xxxl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    padding: spacing.md,
  },
});
