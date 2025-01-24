import { ReactNode } from "react";
import { Budget } from "@/types";

interface BudgetItemProps {
  budget: Budget;
  spent: number;
  icon: ReactNode; // Type the icon prop
  color: string; // Type the color prop
  noEdit?: boolean;
}

const DashBudgetItem = ({ budget, spent, icon, color }: BudgetItemProps) => {
  const remaining = budget.amount - spent;
  const percentageUsed =
    budget.amount > 0
      ? Math.min(Math.round((spent / budget.amount) * 100), 100)
      : 0;

  const getProgressBarColor = (percentage: number) => {
    return percentage < 75 ? "bg-green-500" : "bg-red-500";
  };

  const getRemainingColor = (remaining: number) => {
    return remaining < 0 ? "text-red-500" : "text-gray-700";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg text-gray-700">
            {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
          </h3>
          <div>
            <p className={`text-lg font-bold ${getRemainingColor(remaining)}`}>
              {remaining}€
            </p>
          </div>
        </div>

        <div className="pt-1">
          <div className="w-full bg-gray-200 rounded-full h-3 relative">
            {" "}
            {/* Added relative positioning */}
            <div
              className={`h-full rounded-full ${getProgressBarColor(
                percentageUsed
              )} absolute left-0 top-0 flex items-center justify-center`}
              style={{
                width: `${Math.max(percentageUsed, 0)}%`,
                transition: "width 0.3s ease-in-out",
              }} // Ensure width doesn't go below 0 and add smooth transitions
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBudgetItem;
