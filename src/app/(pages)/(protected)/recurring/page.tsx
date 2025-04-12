"use client";

import { useState } from "react";
import RecurringList from "@/components/recurring/RecurringList";
import { PlusIcon } from "lucide-react";
import { useRecurrings } from "@/context/RecurringContext";
import RecurringDrawer from "@/components/recurring/RecurringDrawer";
import { Recurring, RecurringData } from "@/types";
import { toast } from "sonner";

const RecurringPage = () => {
  const { addRecurring, updateRecurring } = useRecurrings();
  const [showSheet, setShowSheet] = useState(false);
  const [editData, setEditData] = useState<Partial<Recurring> | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setShowSheet(true);
  };

  const onAdd = async (recurring: RecurringData) => {
    try {
      await addRecurring(recurring);
      toast("Recurring expense added");
    } catch (error) {
      console.error("Error adding recurring:", error);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  const onEdit = async (recurringId: string, recurring: RecurringData) => {
    try {
      await updateRecurring(recurringId, recurring);
      toast("Recurring expense updated");
    } catch (error) {
      console.error("Error updating recurring:", error);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  const handleEdit = (recurring: Recurring) => {
    setEditData(recurring);
    setShowSheet(true);
  };

  const handleDrawerClose = () => {
    setShowSheet(false);
    setEditData(null);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Recurring Expenses</h2>
      {/* buton to add a new recurring expense */}
      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition duration-300 ease-in-out transform hover:scale-110  z-30"
      >
        <PlusIcon size={24} />
      </button>
      <RecurringDrawer
        isEdit={!!editData}
        showSheet={showSheet}
        setShowSheet={handleDrawerClose}
        initialData={editData}
        onAdd={onAdd}
        onEdit={onEdit}
      />

      <RecurringList onEdit={handleEdit} />
    </>
  );
};
export default RecurringPage;
