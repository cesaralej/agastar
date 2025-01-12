import { ReactNode, useState } from "react";
import { Budget } from "@/types";

interface BudgetItemProps {
  budget: Budget;
  spent: number;
  onChange: (budget: Budget) => Promise<void>;
  icon: ReactNode; // Type the icon prop
  color: string; // Type the color prop
  noEdit?: boolean;
}

const BudgetItem = ({
  budget,
  spent,
  onChange,
  icon,
  color,
  noEdit,
}: BudgetItemProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newAmount, setNewAmount] = useState(budget.amount);
  const remaining = budget.amount - spent;
  const percentageUsed =
    budget.amount > 0
      ? Math.min(Math.round((spent / budget.amount) * 100), 100)
      : 0;

  const handleEditClick = async () => {
    if (isEdit) {
      // Save budget on exit from edit mode
      await onChange({
        ...budget,
        amount: newAmount, // Update the amount in the budget object
      });
    }
    setIsEdit(!isEdit);
  };

  const handleDiscardChanges = () => {
    setNewAmount(budget.amount); // Reset to the original budget amount
    setIsEdit(false);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAmount(Math.max(0, Number(event.target.value)));
  };

  const getProgressBarColor = (percentage: number) => {
    return percentage < 75 ? "bg-green-500" : "bg-red-500";
  };

  const getRemainingColor = (remaining: number) => {
    return remaining < 0 ? "text-red-500" : "text-green-500";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md ">
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
          <div className="flex gap-2">
            {isEdit && (
              <button
                className="text-gray-500"
                onClick={handleDiscardChanges}
                aria-label="Discard changes"
              >
                Cancel
              </button>
            )}
            <button
              className="text-blue-500"
              onClick={handleEditClick}
              aria-label={isEdit ? "Save budget" : "Edit budget"}
            >
              {isEdit ? "Save" : "Edit"}
            </button>
          </div>
        )}
      </div>
      <div>
        {isEdit ? (
          <input
            type="number"
            inputMode="decimal"
            value={newAmount}
            onChange={handleAmountChange}
            className="w-full border rounded-md p-2 mt-2"
            placeholder="Budget Amount"
          />
        ) : (
          <>
            <p className="text-sm text-gray-500">Budget: ${budget.amount}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Spent: {percentageUsed}%
                </p>
                <p className={`text-sm ${getRemainingColor(remaining)}`}>
                  Remaining: ${remaining}
                </p>
              </div>

              <div className="w-2/5">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  {percentageUsed >= 5 && (
                    <div
                      className={`h-4 rounded-full ${getProgressBarColor(
                        percentageUsed
                      )}`}
                      style={{ width: `${percentageUsed}%` }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetItem;
