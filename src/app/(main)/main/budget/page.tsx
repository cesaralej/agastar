"use client";

import { useState } from "react";
import { useBudgets } from "@/context/BudgetContext";
import BudgetItem from "@/components/BudgetItem";

const BudgetPage = () => {
  const { budgets, loading, error } = useBudgets();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );

  const handleMonthChange = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month + (direction === "prev" ? -1 : 1));
    setSelectedMonth(newDate.toISOString().slice(0, 7));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const currentBudget = budgets?.find(
    (budget) => budget.month === selectedMonth
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => handleMonthChange("prev")}
          className="text-blue-500 hover:underline"
        >
          Previous
        </button>
        <h1 className="text-xl font-bold">Budgets for {selectedMonth}</h1>
        <button
          onClick={() => handleMonthChange("next")}
          className="text-blue-500 hover:underline"
        >
          Next
        </button>
      </div>

      {/* Income and Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p className="text-2xl font-bold">${currentBudget?.income || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Budgeted</h2>
          <p className="text-2xl font-bold">
            $
            {currentBudget?.categories.reduce(
              (total, category) => total + category.budget,
              0
            ) || 0}
          </p>
        </div>
      </div>

      {/* Budget List */}
      <div className="space-y-4">
        {currentBudget?.categories.map((category) => (
          <BudgetItem key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
};

export default BudgetPage;
