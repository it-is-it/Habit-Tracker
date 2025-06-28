import { useState, useEffect } from "react";
import type { Habit } from "./models/Habit";
import HabitProgress from "./components/HabitProgress.tsx";
import { loadHabits, saveHabits, createHabit, toggleHabitCompletion, deleteHabit as deleteHabitService, updateHabit } from "./services/habitService";
import { HiTrash, HiPencil, HiEye } from "react-icons/hi2";
import QuoteBanner from "./components/QuoteBanner.tsx";
import ProgressBar from "./components/ProgressBar.tsx";
import HabitViewModal from "./components/HabitViewModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [newHabit, setNewHabit] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [modalHabit, setModalHabit] = useState<Habit | null>(null);
  const [modalIsEditing, setModalIsEditing] = useState(false);
  const [confirmDeleteHabitId, setConfirmDeleteHabitId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const items = Array.from(habits);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setHabits(items);
    saveHabits(items);
  }; 

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
    setIsDark((prev) => !prev);
  };

  const toggleCompletion = (id: string) => {
    const updated = toggleHabitCompletion(id);
    setHabits(updated);
  };

  const openModal = (habit: Habit, editing = false) => {
    setModalHabit(habit);
    setModalIsEditing(editing);
  };

  const closeModal = () => {
    setModalHabit(null);
    setModalIsEditing(false);
  };

  const handleModalSave = (id: string, title: string, description: string) => {
    const updatedList = updateHabit(id, title.trim(), description.trim());
    setHabits(updatedList);
    closeModal();
  };

  return (
    <div
      className="min-h-screen bg-white-100 dark:bg-gray-900
     flex flex-col py-8 px-10"
    >
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
          className="w-full max-w-md inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          Add Habit
        </button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="habit-list">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="my-16 space-y-4 w-full max-w-xxl"
              >
          {habits.map((habit, index) => (
            <Draggable draggableId={habit.id} index={index} key={habit.id}>
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
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
                    onClick={() => openModal(habit, true)}
                    aria-label="Edit habit"
                    className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                  >
                    <HiPencil color="white" size={20} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteHabitId(habit.id)}
                    aria-label="Delete habit"
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    <HiTrash color="white" size={20} />
                  </button>
                </div>
              </div>
              <ProgressBar completedDates={habit.completedDates} />
                </li>
              )}
            </Draggable>
          ))}
                        {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <HabitProgress habits={habits} />
        <QuoteBanner />
        {confirmDeleteHabitId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-full max-w-sm mx-auto">
              <p className="text-gray-900 dark:text-gray-100">Are you sure you want to delete this habit?</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button onClick={() => { deleteHabit(confirmDeleteHabitId!); setConfirmDeleteHabitId(null); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none">Delete</button>
                <button onClick={() => setConfirmDeleteHabitId(null)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
              </div>
            </div>
          </div>
        )}
        {modalHabit && (
          <HabitViewModal
            initialEditing={modalIsEditing}
            habit={modalHabit}
            onClose={closeModal}
            onSave={handleModalSave}
            onToggleCompletion={toggleCompletion}
            onDelete={(id) => {
              const updated = deleteHabitService(id);
              setHabits(updated);
            }}
            onArchive={(id) => {
              const updated = deleteHabitService(id);
              setHabits(updated);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
