export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  /** User ID of the assigned member (resolves to a name via houseMembers lookup) */
  assignee: string;
  dueDate: string; // ISO date string
  status: TaskStatus;
  category?: string;
  recurrence?: 'none' | 'weekly';
}
