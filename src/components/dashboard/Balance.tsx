import { useEffect, useState } from "react";
import { FaMoneyBillAlt, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Transaction } from "@/types";

const Balance = ({ transactions }: { transactions: Transaction[] }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savings: 0,
    credit: 0,
  });

  useEffect(
    () => {
      if (!transactions) return;

      let income: number = 0;
      let expenses: number = 0;
      let savings: number = 0;
      let credit: number = 0;

      transactions.forEach((transaction: Transaction) => {
        const amount: number = parseFloat(transaction.amount);

        if (transaction.isCreditCardPayment) {
          // Handle credit card payments
          credit -= amount;
          savings -= amount;
          return; // Skip further checks for this transaction
        }

        // If the transaction is savings then add the amount to the savings or else add it to the credit
        if (transaction.account === "savings") {
          // If the transaction is income then add the amount to the savings or else subtract it
          if (transaction.type === "income") {
            savings += amount;
            income += amount;
          } else {
            savings -= amount;
            expenses += amount;
          }
        } else {
          credit += amount;
          expenses += amount;
        }
      });

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        savings: savings,
        credit: credit,
      });
    },
    [transactions] // Dependency on transactions prop
  );
  return (
    <div className=" bg-white shadow-lg rounded-lg pl-6 pr-6  mt-8">
      {/* Total Income */}
      <div className="flex justify-between items-center py-4 border-b">
        <div className="flex items-center space-x-2">
          <FaMoneyBillAlt className="text-green-600" />
          <span className="text-lg text-gray-700">Total Income</span>
        </div>
        <div className="text-xl font-bold text-green-600">
          {summary.totalIncome?.toFixed(0)}€
        </div>
      </div>

      {/* Total Expenses */}
      <div className="flex justify-between items-center py-4 border-b ">
        <div className="flex items-center space-x-2">
          <FaArrowDown className="text-red-600" />
          <span className="text-lg text-gray-700">Total Expenses</span>
        </div>
        <div className="text-xl font-bold text-red-600">
          {summary.totalExpenses?.toFixed(0)}€
        </div>
      </div>

      {/* Balance */}
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
          <FaArrowUp
            className={`text-xl ${
              summary.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          />
          <span className="text-lg text-gray-700">Balance</span>
        </div>
        <div
          className={`text-xl font-bold ${
            summary.balance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {summary.balance.toFixed(0)}€
        </div>
      </div>
    </div>
  );
};
export default Balance;
