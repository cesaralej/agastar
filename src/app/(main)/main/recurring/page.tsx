"use client";
import RecurringList from "@/components/recurring/RecurringList";
import { PlusIcon } from "lucide-react";

const expenses = [
  { id: "1", name: "Rent", amount: 1000, dueDate: new Date() },
  { id: "2", name: "Gym", amount: 50, dueDate: new Date() },
];

const handleAddExpense = () => {
  console.log("Add Expense");
};

const RecurringPage = () => {
  return (
    <>
      {/* buton to add a new recurring expense */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddExpense}
      >
        <PlusIcon size={24} />
      </button>

      <RecurringList
        expenses={expenses}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </>
  );
};
export default RecurringPage;
