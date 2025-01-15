import React, { useEffect, useState } from "react";

const MonthProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      //const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Important: 0 gives last day of previous month
      const daysInMonth = lastDayOfMonth.getDate();
      const currentDay = now.getDate();
      const calculatedProgress = (currentDay / daysInMonth) * 100;
      setProgress(calculatedProgress);
    };

    updateProgress();

    const intervalId = setInterval(updateProgress, 60000); // Update every minute (adjust as needed)

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  const remainingPercentage = 100 - progress;
  const daysRemaining =
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() -
    new Date().getDate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
