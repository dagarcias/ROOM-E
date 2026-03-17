import { StateCreator } from 'zustand';
import { RecurringExpense } from '../../types';
import { StoreState } from '../useAppStore';

const uid = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

export interface RecurringExpenseSlice {
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (data: Omit<RecurringExpense, 'id' | 'createdAt' | 'isActive'>) => void;
  updateRecurringExpense: (id: string, changes: Partial<RecurringExpense>) => void;
  toggleRecurringExpense: (id: string) => void;
  removeRecurringExpense: (id: string) => void;
}

export const createRecurringExpenseSlice: StateCreator<
  StoreState,
  [],
  [],
  RecurringExpenseSlice
> = (set) => ({
  recurringExpenses: [],

  addRecurringExpense: (data) => set((state) => ({
    recurringExpenses: [
      ...state.recurringExpenses,
      { ...data, id: uid(), createdAt: now(), isActive: true },
    ],
  })),

  updateRecurringExpense: (id, changes) => set((state) => ({
    recurringExpenses: state.recurringExpenses.map(r =>
      r.id === id ? { ...r, ...changes } : r,
    ),
  })),

  toggleRecurringExpense: (id) => set((state) => ({
    recurringExpenses: state.recurringExpenses.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r,
    ),
  })),

  removeRecurringExpense: (id) => set((state) => ({
    recurringExpenses: state.recurringExpenses.filter(r => r.id !== id),
  })),
});
