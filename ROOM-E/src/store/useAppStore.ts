import { create } from 'zustand';
import { Task, User, Expense, Balance, House } from '../types';
import { createNewHouseEntity } from '../utils/houseUtils';
import { AuthSlice, createAuthSlice } from './slices/authSlice';
import { HouseSlice, createHouseSlice } from './slices/houseSlice';
import { TaskSlice, createTaskSlice } from './slices/taskSlice';
import { ExpenseSlice, createExpenseSlice } from './slices/expenseSlice';
import { ShoppingSlice, createShoppingSlice } from './slices/shoppingSlice';
import { ChatSlice, createChatSlice } from './slices/chatSlice';
import { RecurringExpenseSlice, createRecurringExpenseSlice } from './slices/recurringExpenseSlice';

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  currentHouseId: string | null;
  houseMembers: User[];
  tasks: Task[];
  expenses: Expense[];
  houses: House[];
  // Actions
  login: (user: User) => void;
  logout: () => void;
  completeProfile: (name: string, avatar?: string) => void;
  createHouse: (name: string) => void;
  requestJoinHouse: (code: string) => 'success' | 'invalid' | 'already_in';
  approveMember: (houseId: string, userId: string) => void;
  // Feature Actions
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  getBalances: () => Balance[];
}

const mockUsers: User[] = [
  { id: 'u1', name: 'Mateo' },
  { id: 'u2', name: 'Laura' },
  { id: 'u3', name: 'Daniel' },
];

const mockInitialTasks: Task[] = [
  {
    id: 't1',
    title: 'Clean Kitchen',
    assignee: 'u2', // Laura
    dueDate: new Date().toISOString(),
    status: 'pending',
    category: 'Cleaning',
  },
  {
    id: 't2',
    title: 'Take out trash',
    assignee: 'u3', // Daniel
    dueDate: new Date().toISOString(),
    status: 'pending',
    category: 'General',
  },
];

const mockInitialExpenses: Expense[] = [
  {
    id: 'e1',
    title: 'Groceries',
    amount: 120,
    payerId: 'u1', // Mateo paid
    participantIds: ['u1', 'u2', 'u3'], // Split between everyone
    date: new Date().toISOString(),
  }
];

import { StoreState } from './types';

// 2. Compose the store
export const useAppStore = create<StoreState>()((set, get, api) => ({
  ...createAuthSlice(set, get, api),
  ...createHouseSlice(set, get, api),
  ...createTaskSlice(set, get, api),
  ...createExpenseSlice(set, get, api),
  ...createShoppingSlice(set, get, api),
  ...createChatSlice(set, get, api),
  ...createRecurringExpenseSlice(set, get, api),
}));
