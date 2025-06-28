export interface Habit {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  completedDates: string[];
}
