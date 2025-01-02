import categories from "@/data/categories";
import BudgetItem from "./BudgetItem";
import { Category } from "@/types";

const BudgetList = ({
  budgets,
  onBudgetChange,
  spentPerCategory,
}: {
  budgets: { [key: string]: number };
  onBudgetChange: (category: string, amount: number) => void;
  spentPerCategory: { [key: string]: number };
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Object.keys(categories).map((category) => {
        const categoryData = categories[
          category as keyof typeof categories
        ] as Category;

        return (
          <BudgetItem
            key={category}
            category={category}
            amount={budgets[category] ?? 0}
            spent={spentPerCategory?.[category] || 0}
            onChange={(amount) => onBudgetChange(category, amount)}
            icon={categoryData.icon}
            color={categoryData.color}
          />
        );
      })}
    </div>
  );
};

export default BudgetList;
