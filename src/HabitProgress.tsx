import React from "react";
import type { Habit } from "./models/Habit";
import { DAYS_TO_SHOW } from "./constants";
import { getDateId } from "./utils/dateUtils";

interface HabitProgressProps {
  habits: Habit[];
}

const HabitProgress: React.FC<HabitProgressProps> = ({ habits }) => {
  const today = new Date();
  const dateArray: string[] = [];

  // Generate array of past DAYS_TO_SHOW dates
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
              <td className="px-2 py-1 border">{habit.title}</td>
              {dateArray.map((dateId) => (
                <td
                  key={dateId}
                  className={`w-4 h-4 m-10 rounded-sm ${
                    habit.completedDates.includes(dateId)
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitProgress;
