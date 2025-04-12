import { useTransactions } from "@/context/TransactionContext";
import { useBudgets } from "@/context/BudgetContext";
import { useRecurrings } from "@/context/RecurringContext";
import { useDate } from "@/context/DateContext";
import { Card } from "@/components/ui/card";

const BudgetSummary = () => {
  const { calculateIncomeForMonth } = useTransactions();
  const { getSumOfBudgets } = useBudgets();
  const { totalRecurring } = useRecurrings();
  const { selectedMonth, selectedYear } = useDate();

  const sumOfBudgets = getSumOfBudgets(selectedMonth, selectedYear);
  const incomeForMonth = calculateIncomeForMonth(selectedMonth, selectedYear);

  const totalBudgets = sumOfBudgets + totalRecurring;
  const exceedsIncome = totalBudgets > incomeForMonth;
  const remaining = incomeForMonth - totalBudgets;
  const budgetPercentage = Math.min((totalBudgets / incomeForMonth) * 100, 100);

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">Income</h3>
          <p className="text-xl font-bold">{incomeForMonth.toFixed(0)}€</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">Budgeted</h3>
          <p className="text-xl font-bold">{budgetPercentage.toFixed(0)}%</p>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">
            {exceedsIncome ? "Over" : "Remaining"}
          </h3>
          <p
            className={`text-xl font-bold ${
              exceedsIncome ? "text-red-500" : "text-green-500"
            }`}
          >
            {remaining.toFixed(0)}€
          </p>
        </Card>
      </div>
      {/* <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
        <div
          className={`h-2 rounded-full ${
            exceedsIncome ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${budgetPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between">
        <span className="text-sm">
          {sumOfBudgets > incomeForMonth ? "Over Budget" : "Under Budget"}
        </span>
        <span className="text-sm">{`${budgetPercentage.toFixed(1)}%`}</span>
      </div> */}
    </>
  );
};
export default BudgetSummary;
