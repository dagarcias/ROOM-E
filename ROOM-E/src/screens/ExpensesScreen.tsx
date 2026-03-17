import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Pressable, Modal, TouchableWithoutFeedback, FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/colors';
import { Fab } from '../components/Fab';
import { ExpenseDetailSheet } from '../components/ExpenseDetailSheet';
import { RecurringExpenseCard } from '../components/RecurringExpenseCard';
import { useAppStore } from '../store/useAppStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Expense, RecurringExpense } from '../types';
import { formatRelativeDate, formatCurrency } from '../utils/formatters';

type Tab = 'ledger' | 'fixed';

export const ExpensesScreen = () => {
  const navigation = useNavigation<any>();
  const {
    expenses, houseMembers, getBalances, user,
    recurringExpenses, toggleRecurringExpense, removeRecurringExpense,
  } = useAppStore();

  const [tab, setTab]                       = useState<Tab>('ledger');
  const [selectedExpense, setSelected]      = useState<Expense | null>(null);
  const [selectedRecurring, setRecurring]   = useState<RecurringExpense | null>(null);

  const balances   = getBalances();
  const myBalance  = balances.find(b => b.userId === user?.id)?.owes || 0;

  // Build name lookup for the detail sheet
  const memberNames: Record<string, string> = {};
  houseMembers.forEach(m => { memberNames[m.id] = m.name; });

  /* ─── Ledger card ─── */
  const renderExpenseCard = ({ item }: { item: Expense }) => {
    const payer = houseMembers.find(m => m.id === item.payerId)?.name ?? 'Alguien';
    const date  = formatRelativeDate(item.date);
    return (
      <Pressable
        style={styles.expenseCard}
        onLongPress={() => setSelected(item)}
        android_ripple={{ color: colors.border }}
      >
        <View style={styles.expenseIcon}>
          <MaterialCommunityIcons name="receipt" size={24} color={colors.primary} />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDesc}>Pagado por {payer} · {date}</Text>
        </View>
        <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
      </Pressable>
    );
  };

  const balanceColor = myBalance > 0 ? colors.accent : myBalance < 0 ? colors.success : colors.textPrimary;
  const balanceLabel = myBalance > 0
    ? `Debo ${formatCurrency(Math.abs(myBalance))}`
    : myBalance < 0
      ? `Me deben ${formatCurrency(Math.abs(myBalance))}`
      : 'Al día ✓';

  return (
    <View style={styles.container}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ledger</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Mi balance</Text>
          <Text style={[styles.balanceAmount, { color: balanceColor }]}>
            {balanceLabel}
          </Text>
        </View>

        {/* ─── Tabs ─── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'ledger' && styles.tabBtnActive]}
            onPress={() => setTab('ledger')}
          >
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={15}
              color={tab === 'ledger' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.tabText, tab === 'ledger' && styles.tabTextActive]}>Ledger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'fixed' && styles.tabBtnActive]}
            onPress={() => setTab('fixed')}
          >
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={15}
              color={tab === 'fixed' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.tabText, tab === 'fixed' && styles.tabTextActive]}>Gastos Fijos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Ledger Tab ─── */}
      {tab === 'ledger' && (
        <>
          <Text style={styles.hint}>Mantén presionado un gasto para ver el detalle</Text>
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={renderExpenseCard}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Sin gastos aún. ¡Todo al día!</Text>
            }
          />
          <Fab onPress={() => navigation.navigate('AddExpenseModal')} icon="plus" />
        </>
      )}

      {/* ─── Gastos Fijos Tab ─── */}
      {tab === 'fixed' && (
        <>
          <Text style={styles.hint}>Mantén presionado un servicio para ver opciones</Text>
          <FlatList
            data={recurringExpenses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <RecurringExpenseCard
                item={item}
                payerName={item.payerId ? memberNames[item.payerId] : undefined}
                onLongPress={() => setRecurring(item)}
                onToggle={() => toggleRecurringExpense(item.id)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>Sin servicios configurados</Text>
                <Text style={styles.emptySubText}>
                  Agrega arriendo, internet, Netflix y más con el botón +
                </Text>
              </View>
            }
          />
          <Fab onPress={() => navigation.navigate('AddRecurringExpenseModal')} icon="plus" />
        </>
      )}

      {/* ─── Expense Detail Sheet ─── */}
      <ExpenseDetailSheet
        expense={selectedExpense}
        visible={!!selectedExpense}
        memberNames={memberNames}
        onClose={() => setSelected(null)}
        onDelete={() => setSelected(null)}
      />

      {/* ─── Recurring Expense Detail Sheet ─── */}
      <Modal
        visible={!!selectedRecurring}
        transparent
        animationType="slide"
        onRequestClose={() => setRecurring(null)}
      >
        <TouchableWithoutFeedback onPress={() => setRecurring(null)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {selectedRecurring && (
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetIcon}>{selectedRecurring.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{selectedRecurring.title}</Text>
                <Text style={styles.sheetSub}>
                  {selectedRecurring.recurrence === 'monthly' ? 'Mensual' : 'Anual'} · Día {selectedRecurring.dueDay}
                </Text>
              </View>
            </View>

            <View style={styles.sheetAmountBox}>
              <Text style={styles.sheetAmountLabel}>Monto total</Text>
              <Text style={styles.sheetAmount}>{formatCurrency(selectedRecurring.amount)}</Text>
              <Text style={styles.sheetAmountSub}>
                {formatCurrency(selectedRecurring.amount / (selectedRecurring.participantIds?.length || 1))} / persona
              </Text>
              {selectedRecurring.payerId && (
                <Text style={[styles.sheetAmountLabel, { marginTop: spacing.xs, color: colors.primary }]}>
                  Pagado por: {memberNames[selectedRecurring.payerId] || 'Desconocido'}
                </Text>
              )}
            </View>

            {/* Split Breakdown */}
            <View style={styles.splitListContainer}>
              <Text style={[styles.sheetAmountLabel, { marginBottom: spacing.sm, textAlign: 'left' }]}>SE DIVIDE ENTRE ({selectedRecurring.participantIds?.length || 0})</Text>
              <View style={styles.splitRow}>
                {selectedRecurring.participantIds?.map(uid => (
                  <View key={uid} style={styles.splitUser}>
                    <View style={styles.splitAvatar}>
                      <Text style={styles.splitAvatarText}>{memberNames[uid]?.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.splitName} numberOfLines={1}>
                      {memberNames[uid] || 'Usuario'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetBtnPause]}
                onPress={() => { toggleRecurringExpense(selectedRecurring.id); setRecurring(null); }}
                activeOpacity={0.85}
              >
                <Text style={styles.sheetBtnPauseText}>
                  {selectedRecurring.isActive ? 'Pausar servicio' : 'Reactivar servicio'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetBtnDelete]}
                onPress={() => { removeRecurringExpense(selectedRecurring.id); setRecurring(null); }}
                activeOpacity={0.85}
              >
                <Text style={styles.sheetBtnDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // ── Header ──
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.h1,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  balanceCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceAmount: { fontSize: typography.sizes.h2, fontWeight: '700' },

  // ── Tabs ──
  tabRow: { flexDirection: 'row', gap: spacing.sm },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.white },

  hint: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  listContent: { padding: spacing.xl, paddingBottom: 100 },

  // ── Expense Cards ──
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  expenseIcon: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  expenseInfo: { flex: 1 },
  expenseTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  expenseDesc: { fontSize: typography.sizes.caption, color: colors.textSecondary },
  expenseAmount: { fontSize: typography.sizes.h3, fontWeight: '700', color: colors.textPrimary },

  // ── Empty state ──
  emptyContainer: { alignItems: 'center', marginTop: spacing.xxxl },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.sizes.h3,
    fontWeight: '600',
  },
  emptySubText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: typography.sizes.caption,
    paddingHorizontal: 30,
    lineHeight: 20,
  },

  // ── Recurring detail sheet ──
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  detailSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    width: 40, height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sheetIcon: { fontSize: 36 },
  sheetTitle: {
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sheetSub: { fontSize: typography.sizes.caption, color: colors.textSecondary, marginTop: 3 },
  sheetAmountBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  sheetAmountLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sheetAmount: { fontSize: 32, fontWeight: '800', color: colors.textPrimary, marginVertical: spacing.xs },
  sheetAmountSub: { fontSize: typography.sizes.caption, color: colors.textSecondary },
  sheetActions: { flexDirection: 'row', gap: spacing.md },
  sheetBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sheetBtnPause: {
    backgroundColor: `${colors.primary}15`,
    borderColor: `${colors.primary}40`,
  },
  sheetBtnPauseText: { color: colors.primary, fontWeight: '700' },
  sheetBtnDelete: {
    backgroundColor: `${colors.accent}10`,
    borderColor: `${colors.accent}40`,
  },
  sheetBtnDeleteText: { color: colors.accent, fontWeight: '700' },
  splitListContainer: { marginBottom: spacing.xl },
  splitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  splitUser: { alignItems: 'center', width: 60 },
  splitAvatar: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  splitAvatarText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  splitName: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
});
