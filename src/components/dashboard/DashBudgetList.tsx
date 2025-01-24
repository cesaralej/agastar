import categories from "@/data/categoriesv2";
import DashBudgetItem from "./DashBudgetItem";
import { Category } from "@/types";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import { useRecurrings } from "@/context/RecurringContext";
import Spinner from "@/components/Spinner";

const DashBudgetList = ({
  selectedMonth,
  selectedYear,
}: {
  selectedMonth: number;
  selectedYear: number;
}) => {
  const { budgets: globalBudgets, loading, error } = useBudgets();
  const { totalIncome, spentPerYearMonthCategory } = useTransactions();
  const { totalRecurring } = useRecurrings();

  const sumOfBudgets = globalBudgets.reduce(
    (acc, budget) => (budget.category !== "Luxury" ? acc + budget.amount : acc),
    0
  );

  const defaults = categories
    .filter(
      (category) =>
        category.name !== "other" &&
        category.name !== "salary" &&
        category.name !== "investment"
    )
    .map((category) => {
      if (category.name === "luxury") {
        return {
          id: `${category.name}-${selectedMonth}-${selectedYear}`,
          category: category.name,
          amount: totalIncome - sumOfBudgets - totalRecurring,
          month: selectedMonth,
          year: selectedYear,
        };
      } else if (category.name === "utilities") {
        return {
          id: `${category.name}-${selectedMonth}-${selectedYear}`,
          category: category.name,
          amount: totalRecurring,
          month: selectedMonth,
          year: selectedYear,
        };
      }

      const existingBudget = globalBudgets.find(
        (budget) => budget.category === category.name
      );

      return (
        existingBudget || {
          id: `${category.name}-${selectedMonth}-${selectedYear}`,
          category: category.name,
          amount: 0,
          month: selectedMonth,
          year: selectedYear,
        }
      );
    });

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {defaults.map((budget) => {
        const categoryData = categories.find(
          (category) => category.name === budget.category
        ) as Category;
        //console.log("BP categoryData: ", categoryData);

        return (
          <DashBudgetItem
            key={budget.id || `${budget.category}`}
            budget={budget} // Pass the entire budget object
            spent={
              spentPerYearMonthCategory[selectedYear]?.[selectedMonth]?.[
                budget.category
              ] || 0
            }
            icon={categoryData.icon}
            color={categoryData.color}
          />
        );
      })}
    </div>
  );
};
export default DashBudgetList;
