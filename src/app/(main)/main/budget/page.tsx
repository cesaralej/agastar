"use client";
import React, { useState, useEffect } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetList from "@/components/budget/BudgetList";
import categories from "@/data/categories";
import Spinner from "@/components/Spinner";

const monthNumberMap = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const BudgetPage = () => {
  const { budgets, loading, error, fetchBudgets, updateBudget, createBudget } =
    useBudgets();
  const { transactions } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [localBudgets, setLocalBudgets] = useState<{ [key: string]: number }>(
    {}
  );
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  //console.log("BP render");

  useEffect(() => {
    //console.log("BP useEffect");
    //console.log("BP useEffect: fetchBudgets", selectedMonth, selectedYear);
    fetchBudgets(selectedMonth, selectedYear).then((fetchedBudgets) => {
      if (fetchedBudgets && fetchedBudgets.length > 0) {
        setLocalBudgets(
          fetchedBudgets.reduce((acc: { [key: string]: number }, budget) => {
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
      //console.log("BP useEffect: LocalBudgets", localBudgets);
    });
  }, [selectedMonth, selectedYear, fetchBudgets]);

  const spentPerCategory = (transactions ?? [])
    .filter((transaction) => transaction.type === "expense")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] ?? 0) + Number(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const totalIncome = (transactions ?? [])
    .filter((transaction) => transaction.type === "income")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  const totalBudget = Object.values(localBudgets).reduce(
    (acc, amount) => acc + amount,
    0
  );

  useEffect(() => {
    console.log("BP useEffect: isSaveDisabled", isSaveDisabled);
    setIsSaveDisabled(
      Object.keys(localBudgets).every(
        (category) =>
          localBudgets[category] ===
          budgets?.find((b) => b.category === category)?.amount
      )
    );
  }, [localBudgets, budgets]);

  //console.log("BP spentPerCategory: ", spentPerCategory);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value as string;
    const monthNumber =
      monthNumberMap[selectedMonth as keyof typeof monthNumberMap];
    //console.log("BP Selected month: ", monthNumber);
    setSelectedMonth(monthNumber ?? 0); // Set a default month if not found
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
    return <Spinner loading={loading} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //console.log("BP Render: ", localBudgets);

  return (
    <div className="p-4">
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
            value={months[selectedMonth] || "January"}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md p-2"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`font-bold py-2 px-4 rounded ${
            isSaveDisabled || loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
          onClick={handleSave}
          disabled={isSaveDisabled || loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <BudgetSummary totalBudget={totalBudget} totalIncome={totalIncome} />

      <BudgetList
        budgets={localBudgets}
        spentPerCategory={spentPerCategory}
        onBudgetChange={handleBudgetChange}
      />
    </div>
  );
};

export default BudgetPage;
