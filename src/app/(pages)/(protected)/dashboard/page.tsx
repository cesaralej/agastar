"use client";
import Summary from "@/components/dashboard/Summary";
import MonthProgress from "@/components/dashboard/MonthProgress";
import { useTransactions } from "@/context/TransactionContext";

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
      <Summary transactions={transactions || []} />
    </>
  );
};
export default DashboardPage;
