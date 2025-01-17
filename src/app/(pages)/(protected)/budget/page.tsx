"use client";
import { useState, useCallback } from "react";
import { useBudgets } from "@/context/BudgetContext";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetList from "@/components/budget/BudgetList";

const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(0, i); // Month is 0-indexed
  return date.toLocaleString("default", { month: "long" });
});

const years = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() - 2 + i
);

const BudgetPage = () => {
  const { fetchBudgets } = useBudgets();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleMonthChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newMonth = parseInt(event.target.value, 10);
      setSelectedMonth(newMonth);
      fetchBudgets(newMonth, selectedYear);
    },
    [fetchBudgets, selectedYear]
  );

  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newYear = parseInt(event.target.value, 10);
      setSelectedYear(newYear);
      fetchBudgets(selectedMonth, newYear);
    },
    [fetchBudgets, selectedMonth]
  );

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Budget</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 ">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md p-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth || "January"}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md p-2"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BudgetSummary />

      <BudgetList selectedMonth={selectedMonth} selectedYear={selectedYear} />
    </>
  );
};

export default BudgetPage;
