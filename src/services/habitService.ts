import type { Habit } from '../models/Habit';
import { getDateId } from '../utils/dateUtils';

const STORAGE_KEY = 'habits';

/**
 * Read all habits from localStorage
 */
export const loadHabits = (): Habit[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse habits from storage:', error);
    return [];
  }
};

/**
 * Persist array of habits to localStorage
 */
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

/**
 * Create a new habit with a unique ID and return updated list
 */
export const createHabit = (title: string): Habit[] => {
  const habits = loadHabits();
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    title,
    completedDates: [],
  };
  const updated = [...habits, newHabit];
  saveHabits(updated);
  return updated;
};

/**
 * Toggle today's completion for a given habit and return updated list
 */
export const toggleHabitCompletion = (id: string): Habit[] => {
  const habits = loadHabits();
  const today = getDateId(new Date());
  const updated = habits.map((h) =>
    h.id === id
      ? {
          ...h,
          completedDates: h.completedDates.includes(today)
            ? h.completedDates.filter((date) => date !== today)
            : [...h.completedDates, today],
        }
      : h
  );
  saveHabits(updated);
  return updated;
};

/**
 * Remove a habit by ID and return updated list
 */
export const deleteHabit = (id: string): Habit[] => {
  const habits = loadHabits();
  const updated = habits.filter((h) => h.id !== id);
  saveHabits(updated);
  return updated;
};

/**
 * Update a habit's title by ID and return updated list
 */
export const updateHabitTitle = (id: string, title: string): Habit[] => {
  const habits = loadHabits();
  const updated = habits.map((h) =>
    h.id === id ? { ...h, title } : h
  );
  saveHabits(updated);
  return updated;
};
