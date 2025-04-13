"use client";

import DateFilters from "@/components/DateFilters";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetList from "@/components/budget/BudgetList";
import BudgetDrawer from "@/components/budget/BudgetDrawer";
import { useState } from "react";
import { Budget } from "@/types";

const BudgetPage = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editData, setEditData] = useState<Partial<Budget> | null>(null);

  const handleEdit = (budget: Budget) => {
    setEditData(budget);
    setShowDrawer(true);
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setEditData(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 mt-4">
        <h2 className="text-2xl font-semibold">Budget</h2>
        <DateFilters />
      </div>
      <BudgetSummary />
      <BudgetList onEdit={handleEdit} />
      <BudgetDrawer
        showDrawer={showDrawer}
        setShowDrawer={handleDrawerClose}
        initialData={editData}
      />
    </>
  );
};

export default BudgetPage;
