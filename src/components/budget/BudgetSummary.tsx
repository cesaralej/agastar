const BudgetSummary = ({
  totalBudget,
  totalIncome,
}: {
  totalBudget: number;
  totalIncome: number;
}) => {
  const exceedsIncome = totalBudget > totalIncome;
  const remaining = totalIncome - totalBudget;
  const budgetPercentage = Math.min((totalBudget / totalIncome) * 100, 100);
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4  mt-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">Budgeted</h3>
          <p className="text-xl font-bold">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">Income</h3>
          <p className="text-xl font-bold">${totalIncome.toFixed(2)}</p>
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
          {totalBudget > totalIncome ? "Over Budget" : "Under Budget"}
        </span>
        <span className="text-sm">{`${budgetPercentage.toFixed(1)}%`}</span>
      </div>
    </div>
  );
};
export default BudgetSummary;
