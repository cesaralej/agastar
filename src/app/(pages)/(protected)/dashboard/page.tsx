"use client";

import DateFilters from "@/components/DateFilters";
import Summary from "@/components/dashboard/Summary";
import Balance from "@/components/dashboard/Balance";
import MonthProgress from "@/components/dashboard/MonthProgress";
import DashBudgetList from "@/components/dashboard/DashBudgetList";

const DashboardPage = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4 mt-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <DateFilters />
      </div>
      <div className="flex flex-col space-y-4">
        <DashBudgetList />
        <div className="grid grid-cols-2 gap-4">
          <Summary />
          <Balance />
        </div>
        <MonthProgress />
      </div>
    </>
  );
};
export default DashboardPage;
