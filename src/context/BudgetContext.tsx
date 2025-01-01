"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
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

interface Budget {
  id: string;
  category: string;
  month: number;
  year: number;
  amount: number;
  lastUpdated?: Date;
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
  const user = useAuthState(auth)[0];
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  //Esto del callback esta raro, funciona diferente a sin el callback
  const fetchBudgets = useCallback(async (month: number, year: number) => {
    console.log("Context: Fetching budgets for ", month, year);
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
      console.log("Query snapshot: ", querySnapshot);

      const fetchedBudgets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Budget[];

      console.log("Fetched budgets: ", fetchedBudgets);
      setBudgets(fetchedBudgets);
      console.log("Set budgets: ", budgets);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = async (budgetData: Omit<Budget, "id">) => {
    if (!user) return;
    try {
      const budgetRef = doc(
        db,
        "users",
        user.uid,
        "budgets",
        `${budgetData.category}-${budgetData.month}-${budgetData.year}`
      );
      await setDoc(budgetRef, {
        ...budgetData,
        lastUpdated: serverTimestamp(),
      });
      await fetchBudgets(budgetData.month, budgetData.year);
    } catch (error) {
      console.log(error);
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
      const { month, year } = budget;
      await fetchBudgets(month, year);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Context useEffect");
    const today = new Date();
    fetchBudgets(today.getMonth() + 1, today.getFullYear());
  }, [user]);

  const value = {
    budgets,
    loading,
    error,
    updateBudget,
    fetchBudgets,
    createBudget,
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
