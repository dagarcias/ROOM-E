import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/colors';
import { TaskCard } from '../components/TaskCard';
import { TaskDetailSheet } from '../components/TaskDetailSheet';
import { Fab } from '../components/Fab';
import { useAppStore } from '../store/useAppStore';
import { Task } from '../types';

export const TasksScreen = () => {
  const navigation = useNavigation<any>();
  const { tasks, toggleTaskCompletion, user, deleteTask, houseMembers } = useAppStore();

  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Build userId → name lookup once
  const memberNames: Record<string, string> = {};
  houseMembers.forEach(m => { memberNames[m.id] = m.name; })

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.assignee === user?.id);

  return (
    <View style={styles.container}>
      {/* Header Filters */}
      <View style={styles.header}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.chip, filter === 'all' && styles.activeChip]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.activeChipText]}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, filter === 'mine' && styles.activeChip]}
            onPress={() => setFilter('mine')}
          >
            <Text style={[styles.chipText, filter === 'mine' && styles.activeChipText]}>Mis Tareas</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Mantén presionado una tarea para ver el detalle</Text>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            assigneeName={memberNames[item.assignee] ?? item.assignee}
            onToggleComplete={() => toggleTaskCompletion(item.id)}
            onDelete={() => deleteTask(item.id)}
            onLongPress={() => setSelectedTask(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sin tareas en esta vista.</Text>
        }
      />

      <TaskDetailSheet
        task={selectedTask}
        visible={!!selectedTask}
        memberNames={memberNames}
        onClose={() => setSelectedTask(null)}
        onToggle={() => selectedTask && toggleTaskCompletion(selectedTask.id)}
        onDelete={() => selectedTask && deleteTask(selectedTask.id)}
      />

      <Fab onPress={() => navigation.navigate('AddTaskModal')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterRow: { flexDirection: 'row', marginBottom: spacing.sm },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  activeChip: { backgroundColor: colors.primary },
  chipText: { color: colors.textSecondary, fontWeight: '600' },
  activeChipText: { color: colors.white },
  hint: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  listContent: { padding: spacing.xl, paddingBottom: 100 },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
