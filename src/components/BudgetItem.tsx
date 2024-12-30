import { CategoryBudget } from "@/context/BudgetContext";

interface BudgetItemProps {
  category: CategoryBudget;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ category }) => {
  const spent = 0; // Replace with actual spent amount calculation
  const remaining = category.budget - spent;
  const percentageUsed = Math.min((spent / category.budget) * 100, 100);

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{category.name}</h3>
        <p className="text-sm text-gray-500">Budget: ${category.budget}</p>
        <p className="text-sm text-gray-500">Spent: ${spent}</p>
        <p
          className={`text-sm ${
            remaining < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          Remaining: ${remaining}
        </p>
      </div>
      <div className="w-2/5">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              percentageUsed < 75 ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetItem;
