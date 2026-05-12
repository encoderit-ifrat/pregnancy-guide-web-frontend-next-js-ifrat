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

export function calculatePregnancyProgress(dueDate: string, locale = "sv") {
  if (!dueDate) return null;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dd = new Date(dueDate);
  dd.setHours(0, 0, 0, 0);

  const pregnancyStart = new Date(dd);
  pregnancyStart.setDate(dd.getDate() - 280);

  const diffDays = Math.floor(
    (today.getTime() - pregnancyStart.getTime()) / MS_PER_DAY
  );

  if (diffDays < 0) return null;

  const week = Math.floor(diffDays / 7);
  const day = diffDays % 7;
  const totalDays = 280;
  const percentage = Math.min((diffDays / totalDays) * 100, 100);

  let trimester = "";
  if (week < 13) trimester = "1st Trimester";
  else if (week < 27) trimester = "2nd Trimester";
  else trimester = "3rd Trimester";

  const daysLeft = Math.max(
    0,
    Math.floor((dd.getTime() - today.getTime()) / MS_PER_DAY)
  );

  return {
    week,
    day,
    percentage: +percentage.toFixed(1),
    trimester,
    dueDate: dd.toLocaleDateString(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    daysLeft,
    isOverdue: diffDays > totalDays,
  };
}
