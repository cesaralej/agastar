"use client";

import DateFilters from "@/components/DateFilters";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetList from "@/components/budget/BudgetList";

const BudgetPage = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4 mt-4">
        <h2 className="text-2xl font-semibold">Budget</h2>
        <DateFilters />
      </div>
      <BudgetSummary />
      <BudgetList />
    </>
  );
};

export default BudgetPage;
