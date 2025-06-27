import { useState, useEffect } from "react";
import type { Habit } from "./models/Habit";
import HabitProgress from "./HabitProgress";

const STORAGE_KEY = "habits";

const safeParse = (value: string | null): Habit[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("Failed to parse habits from localStorage");
    return [];
  }
};

function App() {
  const [habits, setHabits] = useState<Habit[]>(() =>
    safeParse(localStorage.getItem(STORAGE_KEY))
  );
  const [newHabit, setNewHabit] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  ); // theme state

  // Persist habits to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Default to dark mode on Windows
  useEffect(() => {
    const isWindows = navigator.platform.toLowerCase().includes("win");
    if (isWindows) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: crypto.randomUUID(),
      title: newHabit.trim(),
      completedDates: [],
    };
    setHabits((prev) => [...prev, habit]);
    setNewHabit("");
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const toggleCompletion = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completedDates: habit.completedDates.includes(today)
                ? habit.completedDates.filter((date) => date !== today)
                : [...habit.completedDates, today],
            }
          : habit
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col py-8 px-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Habit Tracker & Daily Planner Web App
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? "🌞" : "🌙"}
        </button>
      </div>
      <div className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <input
          type="text"
          placeholder="New habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="appearance-none block w-full max-w-md px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button
          onClick={addHabit}
          className="w-full max-w-md inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Habit
        </button>
        <ul className="my-16 space-y-3 w-full max-w-md">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={habit.completedDates.includes(
                      new Date().toISOString().split("T")[0]
                    )}
                    onChange={() => toggleCompletion(habit.id)}
                    className="mr-2"
                  />
                  {habit.title}
                </label>
                <span className="text-sm text-gray-300">
                  {habit.completedDates.length} days completed
                </span>
              </div>
            </li>
          ))}
        </ul>
        <HabitProgress habits={habits} />
      </div>
    </div>
  );
}

export default App;
