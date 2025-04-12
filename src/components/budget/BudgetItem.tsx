import { ReactNode, useState } from "react";
import { Budget } from "@/types";
import { Card } from "@/components/ui/card";

interface BudgetItemProps {
  budget: Budget;
  spent: number;
  onChange: (budget: Budget) => Promise<void>;
  icon: ReactNode; // Type the icon prop
  color: string; // Type the color prop
  noEdit?: boolean;
}

const formatNumberWithCommas = (number: number | undefined): string => {
  if (number === undefined) return "0";
  return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const BudgetItem = ({
  budget,
  spent,
  onChange,
  icon,
  color,
  noEdit,
}: BudgetItemProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newAmount, setNewAmount] = useState<string>(budget.amount.toString());
  const remaining = budget.amount - spent;
  const percentageUsed =
    budget.amount > 0
      ? Math.min(Math.round((spent / budget.amount) * 100), 100)
      : 0;

  const handleEditClick = async () => {
    const amountToSave = newAmount === "" ? 0 : Number(newAmount);
    if (isEdit) {
      // Save budget on exit from edit mode
      await onChange({
        ...budget,
        amount: amountToSave, // Update the amount in the budget object
      });
    }
    setIsEdit(!isEdit);
  };

  const handleDiscardChanges = () => {
    setNewAmount(budget.amount.toString()); // Reset to the original budget amount
    setIsEdit(false);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Allow only numeric values
      setNewAmount(value);
    }
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
            <p className="text-sm text-gray-500">
              Budget: {formatNumberWithCommas(budget.amount)}€
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
          </>
        )}
      </div>
    </Card>
  );
};

export default BudgetItem;
