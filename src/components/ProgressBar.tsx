import React from "react";
import { calculateCompletionRate } from "../utils/progressUtils";

interface ProgressBarProps {
  completedDates: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completedDates }) => {
  const { count: completedCount, percent: percentage } = calculateCompletionRate(completedDates);

  return (
    <div className="w-full mt-2">
      <div className="mb-1 text-sm text-gray-700 dark:text-gray-300">
        {completedCount}/7 days
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
