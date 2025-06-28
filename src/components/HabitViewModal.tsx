import React, { useEffect, useState } from "react";
import type { Habit } from "../models/Habit";
import { HiEllipsisVertical } from "react-icons/hi2";

interface HabitViewModalProps {
  habit: Habit;
  onClose: () => void;
  onSave?: (id: string, title: string, description: string) => void;
  onToggleCompletion?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  initialEditing?: boolean;
}

const HabitViewModal: React.FC<HabitViewModalProps> = ({
  habit,
  onClose,
  onSave,
  onToggleCompletion,
  onDelete,
  onArchive,
  initialEditing = false,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const [isEditing, setIsEditing] = useState(initialEditing);
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(habit.title);
  const [editDescription, setEditDescription] = useState(habit.description || "");
  useEffect(() => {
    setEditTitle(habit.title);
    setEditDescription(habit.description || "");
    setIsEditing(initialEditing);
    setShowOptions(false);
  }, [habit, initialEditing]);

  const dateSet = new Set(habit.completedDates);
  const toId = (d: Date) => d.toISOString().split("T")[0];
  const getStreakForward = (start: Date) => {
    let count = 0;
    const set = dateSet;
    const d = new Date(start);
    while (set.has(toId(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentStreak = getStreakForward(today);

  let longestStreak = 0;
  for (const dateId of dateSet) {
    const d = new Date(dateId);
    const prev = new Date(d);
    prev.setDate(d.getDate() - 1);
    if (!dateSet.has(toId(prev))) {
      const streak = getStreakForward(d);
      if (streak > longestStreak) longestStreak = streak;
    }
  }

  const createdAt = new Date(habit.createdAt).toLocaleString();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 relative">
        <div className="flex items-center justify-between">
          <input
            type="checkbox"
            checked={dateSet.has(toId(today))}
            onChange={() => onToggleCompletion?.(habit.id)}
            className="h-5 w-5 text-green-600 dark:text-green-400 form-checkbox"
            aria-label="Mark today's completion"
          />
          {isEditing ? (
            <input autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-2xl font-bold border-b border-gray-300 focus:outline-none dark:bg-gray-800 dark:text-gray-100"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {habit.title}
            </h2>
          )}
          <button
            onClick={() => setShowOptions(prev => !prev)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Options"
          >
            <HiEllipsisVertical className="h-6 w-6" />
          </button>
          {showOptions && (
            <div className="absolute top-8 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-md z-10">
              {onArchive && (
                <button
                  onClick={() => {
                    onArchive(habit.id);
                    setShowOptions(false);
                    onClose();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-600"
                >
                  Archive
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    setShowConfirmDelete(true);
                    setShowOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-600"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none dark:bg-gray-800 dark:text-gray-100"
            rows={3}
          />
        ) : habit.description && (
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {habit.description}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-200">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span>Current Streak: {currentStreak}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🏆</span>
            <span>Longest Streak: {longestStreak}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✔️</span>
            <span>Checks: {habit.completedDates.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>❄️</span>
            <span>Freezes: 0</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <span>📆</span>
            <span>Created At: {createdAt}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  onSave?.(habit.id, editTitle, editDescription);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(habit.title);
                  setEditDescription(habit.description || "");
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Close
              </button>
            </>
          ) : (
            <>
              {onSave && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Close
              </button>
            </>
          )}
        </div>
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md w-full max-w-sm mx-auto">
              <p className="text-gray-900 dark:text-gray-100">Are you sure you want to delete this habit?</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button onClick={() => { onDelete?.(habit.id); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none">Delete</button>
                <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitViewModal;
