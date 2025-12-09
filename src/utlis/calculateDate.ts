export const calculateDueDateFromLPD = (lastPeriodDate: string): string => {
  const lpd = new Date(lastPeriodDate);
  const dueDate = new Date(lpd);
  dueDate.setDate(lpd.getDate() + 280); // Add 40 weeks (280 days)
  return dueDate.toISOString();
};

export const calculateLPDFromDueDate = (dueDate: string): string => {
  const dd = new Date(dueDate);
  const lpd = new Date(dd);
  lpd.setDate(dd.getDate() - 280); // Subtract 40 weeks (280 days)
  return lpd.toISOString();
};

export function calculatePregnancyProgress(lastPeriodDate: string) {
  if (!lastPeriodDate) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to midnight

  const lastPeriod = new Date(lastPeriodDate);
  lastPeriod.setHours(0, 0, 0, 0); // Reset to midnight

  const dueDate = new Date(lastPeriod);
  dueDate.setDate(lastPeriod.getDate() + 280);

  const diffDays = Math.floor(
    (now.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Handle invalid dates
  if (diffDays < 0) return null;

  const week = Math.floor(diffDays / 7);
  const day = diffDays % 7;
  const totalDays = 280;
  const percentage = Math.min((diffDays / totalDays) * 100, 100);

  let trimester = "";
  if (week < 13) trimester = "Trimester 1";
  else if (week < 27) trimester = "Trimester 2";
  else trimester = "Trimester 3";

  const daysLeft = Math.max(
    0,
    Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    week,
    day,
    percentage: +percentage.toFixed(1),
    trimester,
    dueDate: dueDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    daysLeft,
    isOverdue: diffDays > totalDays, // Optional: flag overdue pregnancies
  };
}
