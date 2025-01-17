import categories from "@/data/categoriesv2";
import BudgetItem from "./BudgetItem";
import { Budget, Category } from "@/types";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import { useRecurrings } from "@/context/RecurringContext";
import Spinner from "@/components/Spinner";

const BudgetList = ({
  selectedMonth,
  selectedYear,
}: {
  selectedMonth: number;
  selectedYear: number;
}) => {
  const { budgets: globalBudgets, loading, error, updateBudget } = useBudgets();
  const { totalIncome, spentPerYearMonthCategory } = useTransactions();
  const { totalRecurring } = useRecurrings();

  const sumOfBudgets = globalBudgets.reduce(
    (acc, budget) => (budget.category !== "Luxury" ? acc + budget.amount : acc),
    0
  );

  const defaults = categories
    .filter(
      (category) => category.name !== "other" && category.name !== "salary"
    )
    .map((category) => {
      if (category.name === "luxury") {
        console.log(`BP: ${totalIncome} - ${sumOfBudgets} - ${totalRecurring}`);
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

  const handleBudgetChange = async (updatedBudget: Budget) => {
    await updateBudget(updatedBudget);
    defaults.forEach((budget) => {
      if (budget.category === updatedBudget.category) {
        budget.amount = updatedBudget.amount;
      }
    });
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {defaults.map((budget) => {
        const categoryData = categories.find(
          (category) => category.name === budget.category
        ) as Category;
        //console.log("BP categoryData: ", categoryData);

        return (
          <BudgetItem
            key={budget.id || `${budget.category}`}
            budget={budget} // Pass the entire budget object
            spent={
              spentPerYearMonthCategory[selectedYear]?.[selectedMonth]?.[
                budget.category
              ] || 0
            }
            onChange={handleBudgetChange}
            icon={categoryData.icon}
            color={categoryData.color}
            noEdit={
              categoryData.name === "luxury" ||
              categoryData.name === "utilities"
            }
          />
        );
      })}
    </div>
  );
};

export default BudgetList;
