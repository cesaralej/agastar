"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  FirestoreError,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Recurring, RecurringData } from "@/types";

export interface RecurringContextType {
  recurrings: Recurring[] | null;
  loading: boolean;
  error: FirestoreError | null;
  addRecurring: (recurringData: RecurringData) => Promise<void>;
  updateRecurring: (
    recurringId: string,
    updatedRecurringData: Partial<RecurringData>
  ) => Promise<void>;
  deleteRecurring: (recurringId: string) => Promise<void>;
  totalRecurring: number;
}

const RecurringContext = createContext<RecurringContextType | null>(null);

export const RecurringProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loadingUser] = useAuthState(auth);
  const [recurrings, setRecurrings] = useState<Recurring[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (loadingUser || !user) {
      setLoading(false);
      setRecurrings(null);
      return;
    }
    const recurringsCollectionRef = collection(
      db,
      "users",
      user.uid,
      "recurrings"
    );
    const q = query(recurringsCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const recurringsData: Recurring[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            description: data.description,
            amount: data.amount,
            dueDate: data.dueDate,
            account: data.account,
            lastPaymentDate: data.lastPaymentDate,
            lastUpdated: data.lastUpdated,
          };
        });
        const sortedRecurrings = recurringsData.sort(
          (a, b) => a.dueDate - b.dueDate
        );

        setRecurrings(sortedRecurrings);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loadingUser]);

  const addRecurring = async (recurringData: RecurringData) => {
    if (!user) {
      console.error("User not logged in. Cannot add recurring.");
      return;
    }

    try {
      const recurringsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "recurrings"
      );

      const docRef = await addDoc(recurringsCollectionRef, {
        ...recurringData,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding recurring:", error);
    }
  };

  const updateRecurring = async (
    recurringId: string,
    updatedRecurringData: Partial<Recurring>
  ) => {
    // New update function
    if (!user) {
      console.error("User not logged in. Cannot update recurring.");
      return;
    }

    try {
      const recurringDocRef = doc(
        db,
        "users",
        user.uid,
        "recurrings",
        recurringId
      ); // Get doc reference
      await updateDoc(recurringDocRef, updatedRecurringData); // Update the document
      console.log("Recurring updated with ID: ", recurringId);
    } catch (error) {
      console.error("Error updating recurring:", error);
    }
  };

  const deleteRecurring = async (recurringId: string | undefined) => {
    // New delete function
    if (!user) {
      console.error("User not logged in. Cannot delete recurring.");
      return;
    }

    if (!recurringId) {
      console.error("Recurring ID is required to delete a recurring.");
      return;
    }

    try {
      const recurringDocRef = doc(
        db,
        "users",
        user.uid,
        "recurrings",
        recurringId
      );
      await deleteDoc(recurringDocRef);
      console.log("Recurring deleted with ID: ", recurringId);
    } catch (error) {
      console.error("Error deleting recurring:", error);
    }
  };

  const totalRecurring = (recurrings ?? []).reduce(
    (acc, recurring) => acc + Number(recurring.amount),
    0
  );

  const value = {
    recurrings,
    loading,
    error,
    addRecurring,
    updateRecurring,
    deleteRecurring,
    totalRecurring,
  };

  return (
    <RecurringContext.Provider value={value}>
      {children}
    </RecurringContext.Provider>
  );
};

export const useRecurrings = () => {
  const context = useContext(RecurringContext);
  if (!context) {
    throw new Error("useRecurrings must be used within a RecurringProvider");
  }
  return context;
};
