import React from "react";
import type { Habit } from "../models/Habit";
import { DAYS_TO_SHOW } from "../models/constants";
import { getDateId } from "../utils/dateUtils";
import { HiCheck } from "react-icons/hi2";

interface HabitProgressProps {
  habits: Habit[];
}

const HabitProgress: React.FC<HabitProgressProps> = ({ habits }) => {
  const today = new Date();
  const dateArray: string[] = [];

  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dateArray.push(getDateId(date));
  }

  return (
    <div className="mt-8 overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Habit</th>
            {dateArray.map((dateId) => (
              <th key={dateId} className="px-2 py-1 border text-xs">
                {dateId}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td className="px-2 py-1 border font-medium">{habit.title}</td>
              {dateArray.map((dateId) => {
                const isChecked = habit.completedDates.includes(dateId);
                return (
                  <td
                    key={dateId}
                    title={isChecked ? "Completed" : "Not completed"}
                    className={`w-6 h-6 border rounded-md pl-2 text-center align-middle justify-center${
                      isChecked
                        ? "bg-green-500 dark:bg-green-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {isChecked && <HiCheck color="white" size={20} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitProgress;
