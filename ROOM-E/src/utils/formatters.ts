export const formatRelativeDate = (dateString: string): string => {
  const taskDate = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (taskDate.toDateString() === today.toDateString()) return 'Today';
  if (taskDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return taskDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
