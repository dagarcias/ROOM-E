import { AuthSlice } from './slices/authSlice';
import { HouseSlice } from './slices/houseSlice';
import { TaskSlice } from './slices/taskSlice';
import { ExpenseSlice } from './slices/expenseSlice';
import { ShoppingSlice } from './slices/shoppingSlice';
import { ChatSlice } from './slices/chatSlice';
import { RecurringExpenseSlice } from './slices/recurringExpenseSlice';

export type StoreState = AuthSlice & 
  HouseSlice & 
  TaskSlice & 
  ExpenseSlice & 
  ShoppingSlice & 
  ChatSlice & 
  RecurringExpenseSlice;
