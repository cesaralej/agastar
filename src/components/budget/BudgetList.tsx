import categories from "@/data/categories";
import BudgetItem from "./BudgetItem";
import { Budget, Category } from "@/types";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import { useRecurrings } from "@/context/RecurringContext";
import { useDate } from "@/context/DateContext";
import Spinner from "@/components/Spinner";

import { Card } from "@/components/ui/card";

const BudgetList = ({ onEdit }: { onEdit: (budget: Budget) => void }) => {
  const { loading, error, getSumOfBudgets, filterBudgets } = useBudgets();
  const { calculateIncomeForMonth, spentPerYearMonthCategory } =
    useTransactions();
  const { totalRecurring } = useRecurrings();
  const { selectedMonth, selectedYear } = useDate();

  const sumOfBudgets = getSumOfBudgets(selectedMonth, selectedYear);
  const incomeForMonth = calculateIncomeForMonth(selectedMonth, selectedYear);

  const defaults = categories
    .filter(
      (category) => category.name !== "other" && category.name !== "salary"
    )
    .map((category) => {
      if (category.name === "luxury") {
        const amount = incomeForMonth - sumOfBudgets - totalRecurring;
        return {
          id: `${category.name}-${selectedMonth}-${selectedYear}`,
          category: category.name,
          amount: (amount < 0 ? 0 : amount).toString(),
          month: selectedMonth,
          year: selectedYear,
        };
      } else if (category.name === "utilities") {
        return {
          id: `${category.name}-${selectedMonth}-${selectedYear}`,
          category: category.name,
          amount: totalRecurring.toString(),
          month: selectedMonth,
          year: selectedYear,
        };
      }

      const existingBudget = filterBudgets(selectedMonth, selectedYear).find(
        (budget) => budget.category === category.name
      );

      return (
        existingBudget || {
          id: `${category.name}-${selectedMonth}-${selectedYear}`,
          category: category.name,
          amount: "0",
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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
            onEdit={onEdit}
            icon={categoryData.icon}
            color={categoryData.color}
          />
        );
      })}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out bg-gray-200">
        <div className="flex justify-center items-center h-full p-4">
          <span className="text-white text-6xl font-bold">+</span>
        </div>
      </Card>
    </div>
  );
};

export default BudgetList;
