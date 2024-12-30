"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  getDoc,
  setDoc,
  where,
  doc,
  updateDoc,
  FirestoreError,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Budget {
  id: string;
  category: string;
  month: number;
  year: number;
  amount: number;
  lastUpdated?: any;
}

interface BudgetContextType {
  budgets: Budget[] | null;
  loading: boolean;
  error: FirestoreError | null;
  fetchBudgets: (month: number, year: number) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  createBudget: (budget: Omit<Budget, "id">) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loadingUser] = useAuthState(auth);
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const fetchBudgets = async (month: number, year: number) => {
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
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (
    month: string,
    income: number,
    categories: CategoryBudget[]
  ) => {
    if (!user) {
      console.error("User not logged in. Cannot add budget.");
      return;
    }

    try {
      const budgetDocRef = doc(db, "users", user.uid, "budgets", month);
      await setDoc(budgetDocRef, { month, income, categories });
      console.log("Budget added for month: ", month);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const updateBudget = async (
    month: string,
    category: string,
    newBudget: number
  ) => {
    if (!user) {
      console.error("User not logged in. Cannot update budget.");
      return;
    }

    try {
      const budgetDocRef = doc(db, "users", user.uid, "budgets", month);
      const budgetDoc = await getDoc(budgetDocRef);
      if (budgetDoc.exists()) {
        const budgetData = budgetDoc.data();
        const updatedCategories = budgetData.categories.map(
          (cat: CategoryBudget) =>
            cat.name === category ? { ...cat, budget: newBudget } : cat
        );

        await updateDoc(budgetDocRef, { categories: updatedCategories });
        console.log("Budget updated for category: ", category);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const value = {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
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
