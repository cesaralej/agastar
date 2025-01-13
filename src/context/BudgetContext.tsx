"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  setDoc,
  where,
  doc,
  FirestoreError,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Budget } from "@/types";

interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  error: FirestoreError | null;
  fetchBudgets: (month: number, year: number) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  sumOfBudgets: number;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuthState(auth)[0];
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const fetchBudgets = async (month: number, year: number) => {
    //console.log("BC fetching budgets for ", month, year);
    setLoading(true);
    setError(null);
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const budgetsCollection = collection(db, "users", user.uid, "budgets");
      const q = query(
        budgetsCollection,
        where("month", "==", month),
        where("year", "==", year)
      );
      const querySnapshot = await getDocs(q);

      const fetchedBudgets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Budget[];

      setBudgets(fetchedBudgets);
    } catch (error) {
      console.log(error);
      setError(error as FirestoreError);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (budget: Budget) => {
    if (!user) return;

    try {
      const budgetRef = doc(db, "users", user.uid, "budgets", budget.id);
      await setDoc(budgetRef, {
        ...budget,
        lastUpdated: serverTimestamp(),
      });
      setBudgets((prevBudgets) => {
        const budgetExists = prevBudgets.some((b) => b.id === budget.id);

        if (budgetExists) {
          // Update existing budget
          return prevBudgets.map((b) =>
            b.id === budget.id ? { ...b, ...budget } : b
          );
        } else {
          // Add new budget
          return [...prevBudgets, budget];
        }
      });
      console.log(`Budget ${budget.id} updated successfully.`);
      //console.log("BC Budgets: ", budgets);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const sumOfBudgets = budgets.reduce(
    (acc, budget) => (budget.category !== "Luxury" ? acc + budget.amount : acc),
    0
  );

  useEffect(() => {
    //console.log("BC useEffect");
    const today = new Date();
    fetchBudgets(today.getMonth(), today.getFullYear());
  }, [user]);

  const value = {
    budgets,
    loading,
    error,
    updateBudget,
    fetchBudgets,
    sumOfBudgets,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
};
