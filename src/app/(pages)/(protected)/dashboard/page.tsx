"use client";

import DateFilters from "@/components/DateFilters";
import Summary from "@/components/dashboard/Summary";
import Balance from "@/components/dashboard/Balance";
import MonthProgress from "@/components/dashboard/MonthProgress";
import DashBudgetList from "@/components/dashboard/DashBudgetList";

const DashboardPage = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Dashboard</h2>
      <DateFilters />
      <MonthProgress />
      <DashBudgetList />
      <Balance />
      <Summary />
    </>
  );
};
export default DashboardPage;
