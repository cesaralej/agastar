import React, { useEffect, useState } from "react";
import { Recurring } from "@/types";
import { FaCreditCard, FaWallet } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";
import { formatCurrency } from "@/lib/utils";

interface RecurringItemProps {
  recurring: Recurring;
  onEdit: (recurring: Recurring) => void;
}

const RecurringItem = ({ recurring, onEdit }: RecurringItemProps) => {
  const onEditClick = () => {
    onEdit(recurring);
    //console.log("Edit clicked for recurring:", recurring);
  };

  const [dueStatus, setDueStatus] = useState("");

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const difference = recurring.dueDate - currentDay;
    let lastPaymentDate: Date | null = null;

    if (recurring.lastPaymentDate) {
      lastPaymentDate =
        recurring.lastPaymentDate instanceof Timestamp
          ? recurring.lastPaymentDate.toDate()
          : new Date(recurring.lastPaymentDate);
    }

    // Check if last payment date is this month
    if (lastPaymentDate && lastPaymentDate.getMonth() === today.getMonth()) {
      setDueStatus("Paid this month");
    } else if (difference === 0) {
      setDueStatus("Due today");
    } else if (difference > 0) {
      setDueStatus(`Due in ${difference} days`);
    } else {
      setDueStatus(`Overdue by ${Math.abs(difference)} days`);
    }
  }, [recurring.dueDate, recurring.lastPaymentDate]);

  const truncateText = ({
    text,
    limit,
  }: {
    text: string;
    limit: number;
  }): string => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  const accountIcon =
    recurring.account === "savings" ? <FaWallet /> : <FaCreditCard />;

  return (
    <div
      className={`rounded-lg shadow-md p-4 bg-white hover:shadow-lg hover:scale-101 transition-all duration-200`}
    >
      <button
        onClick={onEditClick}
        aria-label={`Recurring`}
        className="border-none bg-transparent text-left w-full h-full p-0 block"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {truncateText({ text: recurring.description, limit: 20 })}
          </span>{" "}
          <span className={`text-lg font-semibold text-right`}>
            {formatCurrency(Number(recurring.amount))}
          </span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm text-gray-600 ${
            dueStatus.includes("Paid") ? "text-green-500" : ""
          } ${dueStatus.includes("Overdue") ? "text-red-500" : ""}`}
        >
          {accountIcon}
          <p
            className={`text-sm ${
              dueStatus.includes("Overdue") ? "text-red-500" : "text-gray-500"
            } ${dueStatus.includes("Paid") ? "text-green-500" : ""}`}
          >
            {dueStatus}
          </p>
        </div>
      </button>
    </div>
  );
};

export default RecurringItem;
