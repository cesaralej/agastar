import React, { useEffect, useState } from "react";
import { Recurring } from "@/types";
import { FaCreditCard, FaWallet } from "react-icons/fa";
import { FaExclamationTriangle, FaCheckCircle, FaClock } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";
import { formatCurrency } from "@/lib/utils";

interface RecurringItemProps {
  recurring: Recurring;
  onEdit: (recurring: Recurring) => void;
}

function formatDateWithSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return day + "th";
  }
  switch (day % 10) {
    case 1:
      return day + "st";
    case 2:
      return day + "nd";
    case 3:
      return day + "rd";
    default:
      return day + "th";
  }
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

  const statusIcon = dueStatus.includes("Overdue") ? (
    <FaExclamationTriangle className="text-red-500" />
  ) : dueStatus.includes("Paid") ? (
    <FaCheckCircle className="text-green-500" />
  ) : (
    <FaClock className="text-yellow-500" />
  );

  const bgColor = dueStatus.includes("Overdue")
    ? "bg-red-100"
    : dueStatus.includes("Paid")
    ? "bg-green-100"
    : "bg-gray-100";

  return (
    <div
      className={`rounded-lg shadow-md p-4 bg-white hover:shadow-lg hover:scale-101 transition-all duration-200`}
    >
      <button
        onClick={onEditClick}
        aria-label={`Recurring`}
        className="border-none bg-transparent text-left w-full h-full p-0 block"
      >
        <div className="flex  gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center ${bgColor} justify-center shrink-0`}
          >
            {statusIcon}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {truncateText({ text: recurring.description, limit: 20 })}
              </span>{" "}
              <span className={`text-lg font-semibold text-right`}>
                {formatCurrency(Number(recurring.amount))}
              </span>
            </div>
            <div className={`flex items-center justify-between`}>
              <div className={`flex items-center gap-2 text-sm text-gray-600 `}>
                {accountIcon}
                <p>{dueStatus}</p>
              </div>
              <span className={`text-sm text-gray-600 `}>
                {formatDateWithSuffix(recurring.dueDate)}
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default RecurringItem;
