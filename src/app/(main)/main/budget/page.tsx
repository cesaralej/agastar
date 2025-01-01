"use client";
import React, { useState, useEffect } from "react";
import { useBudgets } from "@/context/BudgetContext";
import BudgetList from "@/components/budget/BudgetList";
import categories from "@/data/categories";

const monthNumberMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const BudgetPage = () => {
  const { budgets, loading, error, fetchBudgets, updateBudget, createBudget } =
    useBudgets();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [localBudgets, setLocalBudgets] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    console.log(
      "BudgetPage useEffect: fetchBudgets for ",
      selectedMonth,
      selectedYear
    );
    fetchBudgets(selectedMonth, selectedYear).then(() => {
      if (budgets) {
        setLocalBudgets(
          budgets.reduce((acc: { [key: string]: number }, budget) => {
            acc[budget.category] = budget.amount;
            return acc;
          }, {})
        );
      } else {
        setLocalBudgets(
          Object.keys(categories).reduce(
            (acc: { [key: string]: number }, category) => {
              acc[category] = 0;
              return acc;
            },
            {}
          )
        );
      }
    });
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value as string;
    const monthNumber =
      monthNumberMap[selectedMonth as keyof typeof monthNumberMap] - 1;
    console.log("Selected month: ", monthNumber);
    setSelectedMonth(monthNumber ?? 1); // Set a default month if not found
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleBudgetChange = (category: string, amount: number) => {
    setLocalBudgets((prev) => ({ ...prev, [category]: amount }));
  };

  const handleSave = async () => {
    if (!budgets) return;

    const budgetsToUpdate = budgets.filter(
      (budget) => localBudgets[budget.category] !== budget.amount
    );
    const budgetsToCreate = Object.keys(localBudgets)
      .filter(
        (category) => !budgets.find((budget) => budget.category === category)
      )
      .map((category) => ({
        category,
        month: selectedMonth,
        year: selectedYear,
        amount: localBudgets[category],
      }));

    for (const budget of budgetsToUpdate) {
      await updateBudget({ ...budget, amount: localBudgets[budget.category] });
    }

    for (const budget of budgetsToCreate) {
      await createBudget(budget);
    }
    console.log("Budgets saved");
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i); // Month is 0-indexed
    return date.toLocaleString("default", { month: "long" });
  });

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log(localBudgets);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 ">
          <select value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={months[selectedMonth] || "January"}
            onChange={handleMonthChange}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      <BudgetList budgets={localBudgets} onBudgetChange={handleBudgetChange} />
    </div>
  );
};

export default BudgetPage;
