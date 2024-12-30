"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import NewTransaction from "@/components/NewTransaction";
import Spinner from "@/components/Spinner";

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
      <div className="container mx-auto px-4 py-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Transaction Form" : "Add Transaction"}
        </button>
        <NewTransaction />
      </div>

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
