import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import categories from "@/data/categories";
import { Category } from "@/types";
import { HiPlusSm, HiMinusSm, HiPencil, HiTrash } from "react-icons/hi";
import { FaCreditCard, FaWallet, FaCoins } from "react-icons/fa";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

import { Transaction } from "@/types";

const TransactionItem = ({
  transaction,
  onEdit,
}: {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
}) => {
  const { deleteTransaction } = useTransactions();
  const [isHovering, setIsHovering] = useState(false);

  const onEditClick = () => {
    onEdit(transaction);
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        await deleteTransaction(transaction.id);
        toast("Transaction deleted");
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

  const categoryData = categories.find(
    (category) => category.name === transaction.category
  ) as Category;

  //These placeholders dont work because it breaks when no category is found
  const categoryIcon = categoryData.icon || <FaCoins />;
  const categoryColor = categoryData.color || "bg-gray-50"; // Default light gray

  const accountIcon =
    transaction.account === "savings" ? <FaWallet /> : <FaCreditCard />;

  const amountStyle =
    transaction.type === "income" ? "text-green-500" : "text-red-500"; // Conditional amount color
  const cardStyle =
    transaction.type === "income"
      ? `border-green-500/30 border-2 hover:bg-green-50`
      : transaction.isCreditCardPayment
      ? `border-purple-500/30 border-2 hover:bg-purple-50`
      : `hover:bg-gray-50 hover:border-gray-300`;

  return (
    <div
      className={`rounded-lg shadow-md p-4 bg-white ${cardStyle} hover:shadow-lg hover:scale-101 transition-all duration-200`}
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
                  {formatCurrency(Number(transaction.amount))}
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
                      onClick={handleDelete}
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
      {transaction.comment && (
        <div className="text-gray-500 text-sm mt-2 ml-4">
          Comment: {transaction.comment}
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
