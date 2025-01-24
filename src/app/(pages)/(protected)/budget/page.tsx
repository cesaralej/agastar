"use client";

import DateFilters from "@/components/DateFilters";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetList from "@/components/budget/BudgetList";

const BudgetPage = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Budget</h2>
      <DateFilters />
      <BudgetSummary />
      <BudgetList />
    </>
  );
};

export default BudgetPage;
