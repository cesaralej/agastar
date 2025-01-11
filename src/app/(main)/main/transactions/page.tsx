"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionDrawer from "@/components/transactions/TransactionDrawer";
import Spinner from "@/components/Spinner";
import { PlusIcon } from "lucide-react";
import { Transaction, TransactionData } from "@/types";
import { useToast } from "@/hooks/use-toast";

const TransactionsPage = () => {
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
  const { toast } = useToast();

  const handleAdd = () => {
    setEditData(null);
    setShowSheet(true);
  };

  const onAdd = async (transaction: TransactionData) => {
    try {
      await addTransaction(transaction);
      toast({
        description: "Transaction added",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
    }
  };

  const onEdit = async (
    transactionId: string,
    transaction: TransactionData
  ) => {
    try {
      await updateTransaction(transactionId, transaction);
      toast({
        description: "Transaction updated",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
    }
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
        onAdd={onAdd}
        onEdit={onEdit}
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
export default TransactionsPage;
