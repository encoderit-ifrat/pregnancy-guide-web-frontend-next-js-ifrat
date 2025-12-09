export const calculateWeeksFromDueDate = (dueDate: string) => {
  const dd = new Date(dueDate);
  const today = new Date();
  const pregnancyStart = new Date(dd);
  pregnancyStart.setDate(dd.getDate() - 280); // 40 weeks = 280 days

  const diffTime = Math.abs(today.getTime() - pregnancyStart.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  return { weeks, days };
};
