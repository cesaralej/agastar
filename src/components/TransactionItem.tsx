import { useState } from "react";
import categories from "@/data/categories";
import { HiPlusSm, HiMinusSm, HiPencil, HiTrash } from "react-icons/hi";
import { FaCreditCard, FaWallet, FaCoins } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

import { Transaction } from "../types";

type CategoryKey = keyof typeof categories;

const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const onEditClick = () => {
    onEdit(transaction.id);
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        await onDelete(transaction.id);
        toast({
          title: "Transaction deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction.");
    }
  };

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

  const category = categories[transaction.category as CategoryKey];

  //These placeholders dont work because it breaks when no category is found
  const categoryIcon = category?.icon || <FaCoins />;
  const categoryColor = category?.color || "bg-gray-50"; // Default light gray

  const accountIcon =
    transaction.account === "savings" ? <FaWallet /> : <FaCreditCard />;

  const amountStyle =
    transaction.type === "income" ? "text-green-500" : "text-red-500"; // Conditional amount color
  const cardStyle =
    transaction.type === "income"
      ? `bg-white border-green-500/30 border-2 hover:bg-green-50`
      : transaction.isCreditCardPayment
      ? `bg-white border-purple-500/30 border-2 hover:bg-purple-50`
      : `bg-white hover:bg-gray-50 hover:border-gray-300`;

  return (
    <div
      className={`rounded-lg shadow-md p-4  ${cardStyle} hover:shadow-lg hover:scale-101 transition-all duration-200`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${categoryColor} shrink-0`}
        >
          {categoryIcon}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-lg font-semibold block">
                {truncateText({ text: transaction.description, limit: 20 })}
              </span>{" "}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {accountIcon}
                <span>
                  {transaction.account.charAt(0).toUpperCase() +
                    transaction.account.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                {transaction.type === "income" ? (
                  <HiPlusSm className="text-green-500 h-5 w-5" />
                ) : (
                  <HiMinusSm className="text-red-500 h-5 w-5" />
                )}
                <span
                  className={`text-lg font-semibold ${amountStyle} block text-right`}
                >
                  {transaction.amount}€
                </span>
              </div>
              <div className="relative h-6">
                {isHovering && (
                  <div className="flex gap-1 absolute top-0 right-0 p-1 rounded-md">
                    <button
                      disabled
                      onClick={onEditClick}
                      className="text-gray-400 cursor-not-allowed"
                    >
                      <HiPencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-700"
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
      {transaction.comment && (
        <div className="text-gray-500 text-sm mt-2 ml-4">
          Comment: {transaction.comment}
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
