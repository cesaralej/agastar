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
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Transaction, TransactionData, Recurring } from "@/types";
import { useRecurrings } from "./RecurringContext";

export interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: FirestoreError | null;
  addTransaction: (transactionData: TransactionData) => Promise<void>;
  updateTransaction: (
    transactionId: string,
    updatedTransactionData: Partial<TransactionData>
  ) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  calculateIncomeForMonth: (year: number, month: number) => number;
  calculateSpentPerDay: (
    year: number,
    month: number
  ) => { Day: number; Spent: number }[];
  spentPerYearMonthCategory: Record<
    number,
    Record<number, Record<string, number>>
  >;
  getRecentPaymentsForRecurring: (recurringItem: Recurring) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loadingUser] = useAuthState(auth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const { recurrings, updateRecurring } = useRecurrings();

  useEffect(() => {
    if (loadingUser || !user) {
      setLoading(false);
      setTransactions([]);
      return;
    }
    setLoading(true);
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
      console.info("Transaction updated with ID: ", transactionId);
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
      console.info("Transaction deleted with ID: ", transactionId);
      //Figure out what to do if it is a recurring expense
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const filterTransactions = (
    month: number,
    year: number,
    effective: boolean = true
  ) => {
    return transactions.filter((transaction) => {
      let tYear;
      let yMonth;
      if (effective) {
        tYear = new Date(transaction.effectiveDate).getFullYear();
        yMonth = new Date(transaction.effectiveDate).getMonth();
      } else {
        tYear = new Date(transaction.date).getFullYear();
        yMonth = new Date(transaction.date).getMonth();
      }
      const matchesYear = year == null || tYear === year;
      const matchesMonth = month == null || yMonth === month;
      return matchesMonth && matchesYear;
    });
  };

  const calculateIncomeForMonth = (month: number, year: number): number => {
    const income = filterTransactions(month, year)
      .filter((transaction) => transaction.type === "income")
      .filter((transaction) => !transaction.isCreditCardPayment)
      .reduce((acc, transaction) => acc + Number(transaction.amount), 0);
    return income;
  };

  const spentPerYearMonthCategory = transactions
    .filter((transaction) => transaction.type === "expense")
    .filter((transaction) => transaction.isCreditCardPayment === false)
    .reduce((acc, transaction) => {
      const year = new Date(transaction.effectiveDate).getFullYear();
      const month = new Date(transaction.effectiveDate).getMonth();
      const category = transaction.category;

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

  const calculateSpentPerDay = (
    month: number,
    year: number
  ): { Day: number; Spent: number }[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const allDays = Array.from({ length: daysInMonth }, (_, day) => ({
      day: day + 1,
      amount: 0,
    }));
    const filteredTransactions = filterTransactions(month, year, false)
      .filter((transaction) => transaction.type === "expense")
      .filter((transaction) => transaction.isCreditCardPayment === false);
    const spentPerDay = filteredTransactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      const day = transactionDate.getDate();

      if (!acc[day]) {
        acc[day] = 0;
      }

      // Add the transaction amount
      acc[day] += Number(transaction.amount);
      return acc;
    }, {} as Record<number, number>);

    const result = allDays.map((entry) => ({
      Day: entry.day, // Day number
      Spent: spentPerDay[entry.day] ?? 0, // Override amount if it exists in the aggregated data
    }));
    return result;
  };

  const getRecentPaymentsForRecurring = (
    recurringItem: Recurring
  ): Transaction[] => {
    // Basic validation on input
    if (!recurringItem || !recurringItem.description) {
      console.warn(
        "Cannot get payments: Recurring item is missing description or category."
      );
      return [];
    }

    // Filter transactions based on matching criteria and ensure date exists for sorting
    const matchingPayments = transactions.filter(
      (tx) =>
        tx.description === recurringItem.description &&
        tx.category === "utilities" &&
        tx.type === "expense" && // Make sure it's classified as an expense payment
        tx.date != null // Ensure date exists for reliable sorting
    );

    // Sort the matching payments by date in descending order (most recent first)
    const sortedPayments = matchingPayments.sort((a, b) => {
      // We already filtered out null dates, so direct comparison is safer
      return b.date!.getTime() - a.date!.getTime();
    });

    // Return the top 3 most recent payments
    return sortedPayments.slice(0, 3);
  };

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    calculateIncomeForMonth,
    spentPerYearMonthCategory,
    calculateSpentPerDay,
    getRecentPaymentsForRecurring,
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
