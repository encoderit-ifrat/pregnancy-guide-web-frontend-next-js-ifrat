// Helper function to calculate weeks pregnant from last period date
export const calculateWeeksPregnant = (lastPeriodDate: string) => {
  const lpd = new Date(lastPeriodDate);
  const today = new Date();

  // Normalize both dates to local midnight to avoid timezone/time-of-day drift
  lpd.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Calculate full-day difference
  const diffTime = today.getTime() - lpd.getTime();

  // +1 day to make it inclusive (so 10th -> 11th = 2 days pregnant)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  return { weeks, days };
};
