"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import TransactionForm from "@/components/expenses/TransactionForm";
import TransactionList from "@/components/expenses/TransactionList";
import TransactionDrawer from "@/components/expenses/TransactionDrawer";
import Spinner from "@/components/Spinner";
import { PlusIcon } from "lucide-react";

const ExpensesPage = () => {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Hide Transaction Form" : <PlusIcon size={24} />}
      </button>
      {/* <NewTransaction /> */}
      <TransactionDrawer />

      {showForm && <TransactionForm onSubmit={addTransaction} />}

      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <TransactionList
          transactions={transactions || []}
          onEdit={updateTransaction}
          onDelete={deleteTransaction}
          error={error ? { message: error.message } : undefined}
        />
      )}
    </>
  );
};
export default ExpensesPage;
