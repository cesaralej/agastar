import React, { useEffect, useState } from "react";
import { useRecurrings } from "@/context/RecurringContext";
import { Recurring } from "@/types";
import { HiPencil, HiTrash } from "react-icons/hi";
import { FaCreditCard, FaWallet } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";

interface RecurringItemProps {
  recurring: Recurring;
  onEdit: (recurring: Recurring) => void;
}

const RecurringItem = ({ recurring, onEdit }: RecurringItemProps) => {
  const onEditClick = () => {
    onEdit(recurring);
  };

  const { deleteRecurring } = useRecurrings();
  const [dueStatus, setDueStatus] = useState("");
  const [isHovering, setIsHovering] = useState(false);

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
      className={`rounded-lg bg-white shadow-md p-4 hover:shadow-lg hover:scale-101 transition-all duration-200`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-lg font-semibold block">
                {truncateText({ text: recurring.description, limit: 20 })}
              </span>{" "}
              <div
                className={`flex items-center gap-2 text-sm text-gray-600 ${
                  dueStatus.includes("Paid") ? "text-green-500" : ""
                } ${dueStatus.includes("Overdue") ? "text-red-500" : ""}`}
              >
                {accountIcon}
                <p
                  className={`text-sm ${
                    dueStatus.includes("Overdue")
                      ? "text-red-500"
                      : "text-gray-500"
                  } ${dueStatus.includes("Paid") ? "text-green-500" : ""}`}
                >
                  {dueStatus}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className={`text-lg font-semibold block text-right`}>
                  {recurring.amount}€
                </span>
              </div>
              <div className="relative h-6">
                {isHovering && (
                  <div className="flex gap-1 absolute top-0 right-0 p-1 rounded-md">
                    <button
                      onClick={onEditClick}
                      className="text-gray-400 hover:text-blue-500 z-10"
                    >
                      <HiPencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteRecurring(recurring.id)}
                      className="text-red-500 hover:text-red-700 z-10"
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringItem;
