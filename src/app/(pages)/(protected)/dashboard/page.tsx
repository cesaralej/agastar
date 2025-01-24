"use client";
import { useTransactions } from "@/context/TransactionContext";
import Summary from "@/components/dashboard/Summary";
import Balance from "@/components/dashboard/Balance";
import MonthProgress from "@/components/dashboard/MonthProgress";
import DashBudgetList from "@/components/dashboard/DashBudgetList";

const DashboardPage = () => {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Dashboard</h2>
      <MonthProgress />
      <DashBudgetList
        selectedMonth={new Date().getMonth()}
        selectedYear={new Date().getFullYear()}
      />
      <Balance transactions={transactions || []} />
      <Summary transactions={transactions || []} />
    </>
  );
};
export default DashboardPage;
