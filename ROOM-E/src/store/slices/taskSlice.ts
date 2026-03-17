import { StateCreator } from 'zustand';
import { Task } from '../../types';

export interface TaskSlice {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export const createTaskSlice: StateCreator<
  TaskSlice,
  [],
  [],
  TaskSlice
> = (set) => ({
  tasks: [],

  addTask: (newTaskData) => set((state) => ({
    tasks: [
      {
        ...newTaskData,
        id: Math.random().toString(36).substring(2, 9),
        status: 'pending',
      },
      ...state.tasks
    ]
  })),

  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== taskId)
  })),

  toggleTaskCompletion: (taskId) => set((state) => {
    let newTasks = [...state.tasks];
    const taskIndex = newTasks.findIndex(t => t.id === taskId);

    if (taskIndex > -1) {
      const task = newTasks[taskIndex];
      const isNowCompleted = task.status === 'pending';

      // Toggle current task
      newTasks[taskIndex] = { ...task, status: isNowCompleted ? 'completed' : 'pending' };

      // Backend Scheduler Simulator: If completed and weekly, spawn next week's instance
      if (isNowCompleted && task.recurrence === 'weekly') {
        const currentDueDate = new Date(task.dueDate);
        const nextWeekDate = new Date(currentDueDate);
        nextWeekDate.setDate(currentDueDate.getDate() + 7);

        // Check if next week's task already exists to prevent duplicates on toggle spam
        const cloneExists = newTasks.some(t =>
          t.title === task.title &&
          t.assignee === task.assignee &&
          new Date(t.dueDate).toDateString() === nextWeekDate.toDateString()
        );

        if (!cloneExists) {
          newTasks.push({
            ...task,
            id: Math.random().toString(36).substring(2, 9), // new ID
            dueDate: nextWeekDate.toISOString(),
            status: 'pending',
          });
        }
      }
    }

    return { tasks: newTasks };
  }),
});
