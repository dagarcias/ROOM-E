import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/colors';
import { Button } from '../components/Button';
import { HouseInviteCard } from '../components/house/HouseInviteCard';
import { PendingApprovalsBoard } from '../components/house/PendingApprovalsBoard';
import { DailyTasksList } from '../components/house/DailyTasksList';
import { useAppStore } from '../store/useAppStore';
import { useHouseApproval } from '../hooks/useHouseApproval';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { approveMember } = useHouseApproval();
  const { user, tasks, toggleTaskCompletion, deleteTask, logout, houses, currentHouseId, houseMembers } = useAppStore();

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const myMemberInfo = currentHouse?.members.find(m => m.userId === user?.id);
  const isAdmin = myMemberInfo?.role === 'admin';
  const pendingMembers = currentHouse?.members.filter(m => m.status === 'pending') || [];

  const todayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar Header */}
      <View style={styles.header}> 
        <View style={styles.headerTop}>
          <Text style={styles.title}>Hi, {user?.name}</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <MaterialCommunityIcons name="logout" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Hoy en {currentHouse?.name}</Text>
      </View>

      {/* House Info & Invite Code */}
      <HouseInviteCard inviteCode={currentHouse?.inviteCode} />

      {/* Admin Pending Approvals */}
      {isAdmin && (
        <PendingApprovalsBoard 
          pendingMembers={pendingMembers} 
          houseMembers={houseMembers} 
          onApprove={approveMember} 
        />
      )}

      {/* Quick Action Chips Block */}
      <View style={styles.quickActions}>
        <Button
          title="Add Task"
          onPress={() => navigation.navigate('AddTaskModal')}
          style={styles.chip}
          textStyle={styles.chipText}
        />
        <Button
          title="Add Expense"
          variant="secondary"
          onPress={() => navigation.navigate('AddExpenseModal')}
          style={styles.chip}
          textStyle={styles.chipText}
        />
      </View>

      {/* Balance Card Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Balance</Text>
        <Text style={styles.cardContent}>
          {useAppStore.getState().getBalances().length === 0
            ? "All settled up! No one owes anything."
            : "There are active debts in the house."}
        </Text>
        <Button
          title="View Ledger"
          variant="outline"
          onPress={() => navigation.navigate('Expenses')}
          style={styles.cardButton}
        />
      </View>

      {/* Today's Tasks */}
      <DailyTasksList 
        tasks={todayTasks} 
        onToggleTask={toggleTaskCompletion} 
        onDeleteTask={deleteTask} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  chip: {
    flex: 1,
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  chipText: {
    fontSize: typography.sizes.caption,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardContent: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  }
});
