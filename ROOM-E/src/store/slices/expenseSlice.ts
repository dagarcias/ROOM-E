import { StateCreator } from 'zustand';
import { Expense, Balance, User } from '../../types';
import { StoreState } from '../types';

export interface ExpenseSlice {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  getBalances: () => Balance[];
}

export const createExpenseSlice: StateCreator<
  StoreState,
  [],
  [],
  ExpenseSlice
> = (set, get) => ({
  expenses: [],

  addExpense: (newExpenseData) => set((state) => ({
    expenses: [
      {
        ...newExpenseData,
        id: Math.random().toString(36).substring(2, 9),
      },
      ...state.expenses
    ]
  })),

  getBalances: () => {
    // Cross-domain access: reading houseMembers to calculate debts
    const { expenses, houseMembers } = get();
    // Initialize balances to 0
    let balances: Record<string, number> = {};
    houseMembers.forEach((m: User) => balances[m.id] = 0);

    expenses.forEach((exp: Expense) => {
      // The payer gets credited (negative debt) for the total amount they paid
      if (balances[exp.payerId] !== undefined) {
        balances[exp.payerId] -= exp.amount;
      }

      // The cost is split evenly among participants
      const splitAmount = exp.amount / exp.participantIds.length;

      exp.participantIds.forEach((pId: string) => {
        // Each participant owes their slice of the split
        if (balances[pId] !== undefined) {
          balances[pId] += splitAmount;
        }
      });
    });

    return Object.entries(balances)
      .map(([userId, owes]) => ({ userId, owes }))
      .filter(b => Math.abs(b.owes) > 0.01); // Filter out zero balances
  }
});
