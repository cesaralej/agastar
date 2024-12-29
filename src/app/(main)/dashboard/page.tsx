"use client";
import Summary from "@/components/Summary";
import { useTransactions } from "@/context/TransactionContext";
import ContextLayout from "../context-layout";

const DashboardPage = () => {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ContextLayout>
      <Summary transactions={transactions} />
    </ContextLayout>
  );
};
export default DashboardPage;
