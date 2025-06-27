import { getDateId } from "./dateUtils";

export interface CompletionRate {
  count: number;
  percent: number;
}

/**
 * Calculate completed count and percentage for the last 7 days
 */
export function calculateCompletionRate(
  completedDates: string[]
): CompletionRate {
  const today = new Date();
  const last7: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7.push(getDateId(d));
  }
  const count = last7.filter((date) => completedDates.includes(date)).length;
  const percent = Math.round((count / 7) * 100);
  return { count, percent };
}
