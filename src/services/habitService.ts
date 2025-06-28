import type { Habit } from "../models/Habit";
import { getDateId } from "../utils/dateUtils";

const STORAGE_KEY = "habits";

export const loadHabits = (): Habit[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((h: Partial<Habit>) => ({
        id: h.id ?? crypto.randomUUID(),
        title: h.title ?? "Untitled Habit",
        description: h.description ?? "",
        createdAt: h.createdAt ?? new Date().toISOString(),
        completedDates: h.completedDates ?? [],
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to parse habits from storage:", error);
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const createHabit = (title: string): Habit[] => {
  const habits = loadHabits();
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    title,
    description: "",
    createdAt: new Date().toISOString(),
    completedDates: [],
  };
  const updated = [...habits, newHabit];
  saveHabits(updated);
  return updated;
};

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

export const deleteHabit = (id: string): Habit[] => {
  const habits = loadHabits();
  const updated = habits.filter((h) => h.id !== id);
  saveHabits(updated);
  return updated;
};

export const updateHabitTitle = (id: string, title: string): Habit[] => {
  const habits = loadHabits();
  const updated = habits.map((h) => (h.id === id ? { ...h, title } : h));
  saveHabits(updated);
  return updated;
};

export const updateHabit = (
  id: string,
  title: string,
  description: string
): Habit[] => {
  const habits = loadHabits();
  const updated = habits.map((h) =>
    h.id === id ? { ...h, title, description } : h
  );
  saveHabits(updated);
  return updated;
};
