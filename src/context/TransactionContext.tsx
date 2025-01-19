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
import { useRecurrings } from "./RecurringContext";

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
  calculateIncomeForMonth: (year: number, month: number) => void;
  incomeForMonth: number;
  spentPerCategory: Record<string, number>;
  spentPerYearMonthCategory: Record<
    number,
    Record<number, Record<string, number>>
  >;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loadingUser] = useAuthState(auth);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [incomeForMonth, setIncomeForMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const { recurrings, updateRecurring } = useRecurrings();

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

        setTransactions(transactionsData);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loadingUser]);

  const checkRecurring = async (
    category: string,
    description: string,
    dateTime: Date
  ) => {
    if (category === "utilities") {
      const recurring = recurrings?.find(
        (recurring) => recurring.description === description
      );
      if (recurring) {
        await updateRecurring(recurring.id, {
          ...recurring,
          lastPaymentDate: dateTime,
          lastUpdated: new Date(),
        });
      }
    }
  };

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

      const docRef = await addDoc(transactionsCollectionRef, {
        ...transactionData,
        //I need to keep changing to number here because typescript will cry if I do it in the component
        amount: Number(transactionData.amount),
      });
      console.log("Document written with ID: ", docRef.id);
      checkRecurring(
        transactionData.category,
        transactionData.description,
        transactionData.date
      );
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (
    transactionId: string,
    updatedTransactionData: Partial<Transaction>
  ) => {
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
      );

      await updateDoc(transactionDocRef, {
        ...updatedTransactionData,
        amount: Number(updatedTransactionData.amount),
      });
      console.log("Transaction updated with ID: ", transactionId);
      if (
        updatedTransactionData.category &&
        updatedTransactionData.description &&
        updatedTransactionData.effectiveDate
      ) {
        checkRecurring(
          updatedTransactionData.category,
          updatedTransactionData.description,
          updatedTransactionData.effectiveDate
        );
      }
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
      //Figure out what to do if it is a recurring expense
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const totalIncome = (transactions ?? [])
    .filter((transaction) => transaction.type === "income")
    .filter((transaction) => !transaction.isCreditCardPayment)
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  // Las transaactions llegan todas, y se filtran en los componentes. Los budgets no, eso se piden por cada mes/año
  // Entonces me tocaria mandar el año y mes al budget summary y calcular esto ahi
  // El punto es que el context de transactions y el de budgets los estoy tratando muy diferentes
  const calculateIncomeForMonth = (month: number, year: number): void => {
    console.log(year, month);
    const income = (transactions ?? [])
      .filter((transaction) => transaction.type === "income")
      .filter((transaction) => !transaction.isCreditCardPayment)
      .filter((transaction) => {
        const tYear = new Date(transaction.effectiveDate).getFullYear();
        const yMonth = new Date(transaction.effectiveDate).getMonth();
        console.log(tYear, yMonth);
        return tYear === year && yMonth === month;
      })

      .reduce((acc, transaction) => acc + Number(transaction.amount), 0);
    console.log(income);
    setIncomeForMonth(income);
  };

  useEffect(() => {
    if (!transactions) {
      return;
    }
    calculateIncomeForMonth(new Date().getMonth(), new Date().getFullYear());
  }, [transactions]);

  const spentPerCategory = (transactions ?? [])
    .filter((transaction) => transaction.type === "expense")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] ?? 0) + Number(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const spentPerYearMonthCategory = (transactions ?? [])
    .filter((transaction) => transaction.type === "expense")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => {
      const year = new Date(transaction.effectiveDate).getFullYear();
      const month = new Date(transaction.effectiveDate).getMonth();
      const category = transaction.category;

      // Initialize the structure if it doesn't exist
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = {};
      }
      if (!acc[year][month][category]) {
        acc[year][month][category] = 0;
      }

      // Add the transaction amount
      acc[year][month][category] += Number(transaction.amount);
      return acc;
    }, {} as Record<number, Record<number, Record<string, number>>>);

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    calculateIncomeForMonth,
    incomeForMonth,
    spentPerCategory,
    spentPerYearMonthCategory,
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
