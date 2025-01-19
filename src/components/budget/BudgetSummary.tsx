import { useTransactions } from "@/context/TransactionContext";
import { useBudgets } from "@/context/BudgetContext";
import { useRecurrings } from "@/context/RecurringContext";

const BudgetSummary = () => {
  const { totalIncome, incomeForMonth } = useTransactions();
  const { sumOfBudgets } = useBudgets();
  const { totalRecurring } = useRecurrings();
  const totalBudgets = sumOfBudgets + totalRecurring;
  const exceedsIncome = totalBudgets > incomeForMonth;
  const remaining = incomeForMonth - totalBudgets;
  const budgetPercentage = Math.min((totalBudgets / incomeForMonth) * 100, 100);
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4  mt-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">Income</h3>
          <p className="text-xl font-bold">${incomeForMonth.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">Budgeted</h3>
          <p className="text-xl font-bold">${totalBudgets.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">
            {exceedsIncome ? "Over" : "Remaining"}
          </h3>
          <p
            className={`text-xl font-bold ${
              exceedsIncome ? "text-red-500" : "text-green-500"
            }`}
          >
            ${remaining.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
        <div
          className={`h-2 rounded-full ${
            exceedsIncome ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${budgetPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between">
        <span className="text-sm">
          {sumOfBudgets > totalIncome ? "Over Budget" : "Under Budget"}
        </span>
        <span className="text-sm">{`${budgetPercentage.toFixed(1)}%`}</span>
      </div>
    </div>
  );
};
export default BudgetSummary;
