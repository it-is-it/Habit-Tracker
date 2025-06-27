import { useState, useEffect } from "react";
import type { Habit } from "./models/Habit";
import HabitProgress from "./HabitProgress";
import {
  loadHabits,
  createHabit,
  toggleHabitCompletion,
  deleteHabit as deleteHabitService,
  updateHabitTitle,
} from "./services/habitService";
import { HiTrash, HiPencil, HiEye } from "react-icons/hi2";
import QuoteBanner from "./components/QuoteBanner.tsx";
import ProgressBar from "./components/ProgressBar.tsx";

function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [newHabit, setNewHabit] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  ); // theme state
  const [modalHabit, setModalHabit] = useState<Habit | null>(null);
  const [isEditingModal, setIsEditingModal] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");

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
    const updated = createHabit(newHabit.trim());
    setHabits(updated);
    setNewHabit("");
  };

  const deleteHabit = (id: string) => {
    const updated = deleteHabitService(id);
    setHabits(updated);
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
    const updated = toggleHabitCompletion(id);
    setHabits(updated);
  };

  const openModal = (habit: Habit) => {
    setModalHabit(habit);
    setIsEditingModal(false);
    setEditTitle(habit.title);
  };

  const closeModal = () => {
    setModalHabit(null);
    setIsEditingModal(false);
  };

  const handleSave = () => {
    if (!modalHabit) return;
    const updatedList = updateHabitTitle(modalHabit.id, editTitle.trim());
    setHabits(updatedList);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col py-8 px-10">
      <div className="flex justify-between items-center max-w-6xl mb-6 py-5">
        <div />
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
        <ul className="my-16 space-y-4 w-full max-w-xxl">
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
                    className="mr-2 h-5 w-5 text-green-600 dark:text-green-400 form-checkbox"
                  />
                  {habit.title}
                </label>
                <span className="text-sm text-gray-300 mr-3">
                  {habit.completedDates.length} days completed
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal(habit)}
                    aria-label="View habit"
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    <HiEye color="white" size={20} />
                  </button>
                  <button
                    onClick={() => {
                      openModal(habit);
                      setIsEditingModal(true);
                    }}
                    aria-label="Edit habit"
                    className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                  >
                    <HiPencil color="white" size={20} />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    aria-label="Delete habit"
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    <HiTrash color="white" size={20} />
                  </button>
                </div>
              </div>
              <ProgressBar completedDates={habit.completedDates} />
            </li>
          ))}
        </ul>
        <HabitProgress habits={habits} />
        <QuoteBanner />
        {modalHabit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              {!isEditingModal ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {modalHabit!.title}
                  </h2>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditingModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
