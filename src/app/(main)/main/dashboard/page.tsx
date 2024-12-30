"use client";
import Summary from "@/components/Summary";
import { useTransactions } from "@/context/TransactionContext";

const DashboardPage = () => {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <Summary transactions={transactions || []} />;
};
export default DashboardPage;
