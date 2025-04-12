"use client";

import { useState } from "react";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionDrawer from "@/components/transactions/TransactionDrawer";
import { PlusIcon } from "lucide-react";
import { Transaction } from "@/types";

const TransactionsPage = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [editData, setEditData] = useState<Partial<Transaction> | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setShowSheet(true);
  };

  const handleEdit = (transaction: Transaction) => {
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
      />
      <h2 className="text-2xl font-semibold mb-4 mt-4">Transactions</h2>

      <TransactionList onEdit={handleEdit} />
    </>
  );
};
export default TransactionsPage;
