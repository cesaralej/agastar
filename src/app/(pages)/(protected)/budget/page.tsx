"use client";
import { useState, useEffect } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetList from "@/components/budget/BudgetList";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(0, i); // Month is 0-indexed
  return {
    name: date.toLocaleString("default", { month: "long" }),
    value: i.toString(),
  };
});

const years = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - 2 + i).toString()
);

const BudgetPage = () => {
  const { fetchBudgets } = useBudgets();
  const { calculateIncomeForMonth } = useTransactions();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    const newMonth = parseInt(selectedMonth, 10);
    const newYear = parseInt(selectedYear, 10);
    fetchBudgets(newMonth, newYear);
    calculateIncomeForMonth(newMonth, newYear);
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Budget</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 ">
          <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Month</SelectLabel>
                {months.map((month) => (
                  <SelectItem key={month.name} value={month.value}>
                    {month.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BudgetSummary />

      <BudgetList
        selectedMonth={Number(selectedMonth)}
        selectedYear={Number(selectedYear)}
      />
    </>
  );
};

export default BudgetPage;
