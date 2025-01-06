import { ReactNode, useState } from "react";

interface BudgetItemProps {
  category: string;
  amount: number;
  spent: number;
  onChange: (amount: number) => void;
  icon: ReactNode; // Type the icon prop
  color: string; // Type the color prop
}

const BudgetItem = ({
  category,
  amount,
  spent,
  onChange,
  icon,
  color,
}: BudgetItemProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const remaining = amount - spent;
  const percentageUsed =
    amount > 0 ? Math.min(Math.round((spent / amount) * 100), 100) : 0;

  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Math.max(0, Number(event.target.value));
    onChange(newAmount);
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
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
        </div>
        <button
          className="text-blue-500"
          onClick={handleEditClick}
          aria-label={isEdit ? "Save budget" : "Edit budget"}
        >
          {isEdit ? "Save" : "Edit"}
        </button>
      </div>
      <div>
        {isEdit ? (
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full border rounded-md p-2 mt-2"
            placeholder="Budget Amount"
          />
        ) : (
          <>
            <p className="text-sm text-gray-500">Budget: ${amount}</p>
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
