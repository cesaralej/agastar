import React, { useEffect, useState } from "react";

import { useDate } from "@/context/DateContext";

const MonthProgress = () => {
  const { selectedMonth, selectedYear } = useDate();
  const [progress, setProgress] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const lastDayOfSelectedMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      );
      const daysInSelectedMonth = lastDayOfSelectedMonth.getDate();

      const today = new Date();

      if (
        selectedYear < today.getFullYear() ||
        (selectedYear === today.getFullYear() &&
          selectedMonth < today.getMonth())
      ) {
        // Selected month is in the past
        setProgress(100);
        setDaysRemaining(0);
      } else if (
        selectedYear > today.getFullYear() ||
        (selectedYear === today.getFullYear() &&
          selectedMonth > today.getMonth())
      ) {
        // Selected month is in the future
        setProgress(0);
        setDaysRemaining(daysInSelectedMonth);
      } else {
        // Selected month is the current month
        const currentDay = today.getDate();
        const calculatedProgress = (currentDay / daysInSelectedMonth) * 100;
        setProgress(calculatedProgress);
        setDaysRemaining(daysInSelectedMonth - currentDay);
      }
    };

    updateProgress();

    const intervalId = setInterval(updateProgress, 60000); // Update every minute (adjust as needed)

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [selectedMonth, selectedYear]);

  const remainingPercentage = 100 - progress;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Month Progress</h2>
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-width duration-500 ease-in-out" // Added transition
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-medium text-sm">
          {remainingPercentage > 5 && (
            <>{remainingPercentage.toFixed(0)}% Left</>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {daysRemaining} days remaining
      </p>
    </div>
  );
};

export default MonthProgress;
