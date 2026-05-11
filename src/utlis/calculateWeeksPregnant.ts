export const calculateWeeksPregnant = (dueDate: string) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysSinceLMP =
    280 - Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);

  const weeks = Math.floor(daysSinceLMP / 7);
  const days = daysSinceLMP % 7;

  return { weeks, days };
};
