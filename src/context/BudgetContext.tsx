"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  setDoc,
  doc,
  FirestoreError,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Budget } from "@/types";

interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  error: FirestoreError | null;
  updateBudget: (budget: Budget) => Promise<void>;
  filterBudgets: (month?: number, year?: number) => Budget[];
  getSumOfBudgets: (month?: number, year?: number) => number;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loadingUser] = useAuthState(auth);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (loadingUser || !user) {
      setLoading(false);
      setBudgets([]);
      return;
    }
    setLoading(true);
    const budgetsCollectionRef = collection(db, "users", user.uid, "budgets");
    const q = query(budgetsCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const budgetsData: Budget[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount || 0,
            lastUpdated: data.lastUpdated?.toDate() || null,
            category: data.category || "",
            account: data.account || "",
            month: data.month || 0,
            year: data.year || 0,
          };
        });

        setBudgets(budgetsData);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loadingUser]);

  const updateBudget = async (budget: Budget) => {
    if (!user) {
      console.error("User not logged in. Cannot update budget.");
      return;
    }
    if (!budget.id) {
      console.error("Budget ID is missing. Cannot update.");
      return;
    }

    try {
      const budgetRef = doc(db, "users", user.uid, "budgets", budget.id);
      await setDoc(budgetRef, {
        ...budget,
        amount: Number(budget.amount),
        lastUpdated: serverTimestamp(),
      });
      console.info("Budget updated with ID: ", budget.id);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const filterBudgets = (month?: number, year?: number) => {
    return budgets.filter((budget) => {
      const matchesMonth = month == null || budget.month === month;
      const matchesYear = year == null || budget.year === year;
      return matchesMonth && matchesYear;
    });
  };

  const getSumOfBudgets = (month?: number, year?: number) => {
    return budgets
      .filter((budget) => {
        const matchesMonth = month == null || budget.month === month;
        const matchesYear = year == null || budget.year === year;
        return matchesMonth && matchesYear;
      })
      .filter(
        (budget) =>
          budget.category !== "luxury" && budget.category !== "utilities"
      )
      .reduce((acc, budget) => acc + Number(budget.amount), 0);
  };

  const value = {
    budgets,
    loading,
    error,
    updateBudget,
    filterBudgets,
    getSumOfBudgets,
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
