import { ReactNode } from "react";
import { Budget } from "@/types";
import { Card } from "@/components/ui/card";

interface BudgetItemProps {
  budget: Budget;
  spent: number;
  icon: ReactNode;
  color: string;
  noEdit?: boolean;
  onEdit: (budget: Budget) => void;
}

const formatNumberWithCommas = (number: number | undefined): string => {
  if (number === undefined) return "0";
  if (isNaN(number)) return "0";
  return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const BudgetItem = ({
  budget,
  spent,
  icon,
  color,
  noEdit,
  onEdit,
}: BudgetItemProps) => {
  const remaining = Number(budget.amount) - spent;
  const percentageUsed =
    Number(budget.amount) > 0
      ? Math.min(Math.round((spent / Number(budget.amount)) * 100), 100)
      : 0;

  const onEditClick = () => {
    onEdit(budget);
  };

  const getProgressBarColor = (percentage: number) => {
    return percentage < 75 ? "bg-green-500" : "bg-red-500";
  };

  const getRemainingColor = (remaining: number) => {
    return remaining < 0 ? "text-red-500" : "text-green-500";
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}
          >
            {icon}
          </div>
          <h3 className="text-lg font-bold">
            {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
          </h3>
        </div>
        {!noEdit && (
          <button
            className="text-blue-500"
            onClick={onEditClick}
            aria-label="Edit budget"
          >
            Edit
          </button>
        )}
      </div>
      <div>
        <div>
          <p className="text-sm text-gray-500">
            Budget: {formatNumberWithCommas(Number(budget.amount))}€
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${getRemainingColor(remaining)}`}>
                Remaining: {formatNumberWithCommas(remaining)}€
              </p>
            </div>
            <div className="w-2/5">
              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                {" "}
                {/* Added relative positioning */}
                {percentageUsed > 10 && (
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(
                      percentageUsed
                    )} absolute left-0 top-0 flex items-center justify-center`}
                    style={{
                      width: `${Math.max(percentageUsed, 0)}%`,
                      transition: "width 0.3s ease-in-out",
                    }} // Ensure width doesn't go below 0 and add smooth transitions
                  >
                    {percentageUsed > 30 && ( // Only show percentage if greater than 0
                      <span className="text-sm text-white font-medium px-1 whitespace-nowrap">
                        {" "}
                        {percentageUsed.toFixed(0)}%{" "}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetItem;
