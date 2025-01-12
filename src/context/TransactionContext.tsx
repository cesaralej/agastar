"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  FirestoreError,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Transaction, TransactionData } from "@/types";

export interface TransactionContextType {
  transactions: Transaction[] | null;
  loading: boolean;
  error: FirestoreError | null;
  addTransaction: (transactionData: TransactionData) => Promise<void>;
  updateTransaction: (
    transactionId: string,
    updatedTransactionData: Partial<TransactionData>
  ) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  totalIncome: number;
  spentPerCategory: Record<string, number>;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loadingUser] = useAuthState(auth);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (loadingUser || !user) {
      setLoading(false);
      setTransactions(null);
      return;
    }
    const transactionsCollectionRef = collection(
      db,
      "users",
      user.uid,
      "transactions"
    );
    const q = query(transactionsCollectionRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transactionsData: Transaction[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data?.date?.toDate() || null,
            effectiveDate: data?.effectiveDate?.toDate() || null,
            amount: data.amount || 0,
            time: data.time || "",
            description: data.description || "",
            category: data.category || "",
            account: data.account || "",
            comment: data.comment || "",
            type: data.type || "",
            isCreditCardPayment: data.isCreditCardPayment || false,
          };
        });
        const sortedTransactions = transactionsData.sort((a, b) => {
          const dateA = new Date(
            `${a.date?.toISOString().split("T")[0]}T${a.time}`
          );
          const dateB = new Date(
            `${b.date?.toISOString().split("T")[0]}T${b.time}`
          );
          return dateB.getTime() - dateA.getTime();
        });
        setTransactions(sortedTransactions);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loadingUser]);

  const addTransaction = async (transactionData: TransactionData) => {
    if (!user) {
      console.error("User not logged in. Cannot add transaction.");
      return;
    }

    try {
      const transactionsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "transactions"
      );

      const datePart = transactionData.date.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"

      const dateTime = new Date(`${datePart}T${transactionData.time}:00`);
      console.log("TC transaction time:", dateTime);

      const docRef = await addDoc(transactionsCollectionRef, {
        ...transactionData,
        amount: Number(transactionData.amount),
        date: dateTime,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (
    transactionId: string,
    updatedTransactionData: Partial<Transaction>
  ) => {
    // New update function
    if (!user) {
      console.error("User not logged in. Cannot update transaction.");
      return;
    }

    try {
      const transactionDocRef = doc(
        db,
        "users",
        user.uid,
        "transactions",
        transactionId
      ); // Get doc reference
      await updateDoc(transactionDocRef, updatedTransactionData); // Update the document
      console.log("Transaction updated with ID: ", transactionId);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (transactionId: string | undefined) => {
    // New delete function
    if (!user) {
      console.error("User not logged in. Cannot delete transaction.");
      return;
    }

    if (!transactionId) {
      console.error("Transaction ID is required to delete a transaction.");
      return;
    }

    try {
      const transactionDocRef = doc(
        db,
        "users",
        user.uid,
        "transactions",
        transactionId
      );
      await deleteDoc(transactionDocRef);
      console.log("Transaction deleted with ID: ", transactionId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const totalIncome = (transactions ?? [])
    .filter((transaction) => transaction.type === "income")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  const spentPerCategory = (transactions ?? [])
    .filter((transaction) => transaction.type === "expense")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] ?? 0) + Number(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    spentPerCategory,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
