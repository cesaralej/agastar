"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import TransactionList from "@/components/expenses/TransactionList";
import TransactionDrawer from "@/components/expenses/TransactionDrawer";
import Spinner from "@/components/Spinner";
import { PlusIcon } from "lucide-react";
import { Transaction } from "@/types";

const ExpensesPage = () => {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const [showSheet, setShowSheet] = useState(false);
  const [editData, setEditData] = useState<Partial<Transaction> | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setShowSheet(true);
  };

  const handleEdit = (transaction: Transaction) => {
    console.log("Edit handler");
    setEditData(transaction);
    setShowSheet(true);
  };

  const handleDrawerClose = () => {
    setShowSheet(false);
    setEditData(null);
  };

  return (
    <>
      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition duration-300 ease-in-out transform hover:scale-110  z-30"
      >
        <PlusIcon size={24} />
      </button>
      <TransactionDrawer
        isEdit={!!editData}
        showSheet={showSheet}
        setShowSheet={handleDrawerClose}
        initialData={editData}
        onAdd={addTransaction}
        onEdit={updateTransaction}
      />

      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <TransactionList
          transactions={transactions || []}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
          error={error ? { message: error.message } : undefined}
        />
      )}
    </>
  );
};
export default ExpensesPage;
