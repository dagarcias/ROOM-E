export interface Expense {
  id: string;
  title: string;
  amount: number;
  payerId: string; // User ID who paid
  participantIds: string[]; // User IDs splitting it
  date: string;
}

export interface Balance {
  userId: string;
  owes: number; // Positive means they owe money, negative means they are owed
}

export type RecurrencePeriod = 'monthly' | 'yearly';

export interface RecurringExpense {
  id: string;
  title: string;
  icon: string;                 // emoji, e.g. "🏠", "📺", "💧"
  amount: number;               // valor total del servicio
  participantIds: string[];     // entre quiénes se divide
  recurrence: RecurrencePeriod;
  dueDay: number;               // día del mes en que vence (1–31)
  payerId?: string;             // quién suele pagarlo (opcional)
  houseId: string;
  createdAt: string;
  isActive: boolean;
}
