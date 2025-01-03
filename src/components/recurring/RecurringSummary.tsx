interface RecurringSummaryProps {
  totalRecurringExpenses: number;
  paidRecurringExpenses: number;
}

const RecurringSummary: React.FC<RecurringSummaryProps> = ({
  totalRecurringExpenses,
  paidRecurringExpenses,
}) => {
  const remainingRecurringExpenses =
    totalRecurringExpenses - paidRecurringExpenses;
  const percentagePaid =
    totalRecurringExpenses === 0
      ? 0
      : (paidRecurringExpenses / totalRecurringExpenses) * 100;
  return (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Recurring Expenses Summary</h2>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <p className="text-gray-600">Total Recurring:</p>
          <p className="text-xl font-bold">
            ${totalRecurringExpenses.toFixed(2)}
          </p>
        </div>
        <div className="mb-2 md:mb-0">
          <p className="text-gray-600">Paid:</p>
          <p className="text-xl font-bold text-green-500">
            ${paidRecurringExpenses.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Remaining:</p>
          <p
            className={`text-xl font-bold ${
              remainingRecurringExpenses > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            ${remainingRecurringExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div
          className={`h-4 rounded-full bg-green-500`}
          style={{ width: `${percentagePaid}%` }}
        ></div>
      </div>
      <p className="text-center mt-1 text-xs text-gray-500">
        {percentagePaid.toFixed(1)}% Paid
      </p>
    </div>
  );
};
export default RecurringSummary;
