import { useEffect, useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { useDate } from "@/context/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { FaReceipt, FaEquals } from "react-icons/fa";
import { Transaction } from "@/types";
import CountUp from "react-countup";

const Balance = () => {
  const { transactions, loading, error } = useTransactions();
  const { selectedMonth, selectedYear } = useDate();
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
        // Check if the transaction is for the selected month and year
        const transactionDate = new Date(transaction.effectiveDate);
        if (
          transactionDate.getMonth() !== selectedMonth ||
          transactionDate.getFullYear() !== selectedYear
        ) {
          return; // Skip further checks for this transaction
        }
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
    [transactions, selectedMonth, selectedYear] // Dependency on transactions prop
  );

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Total Expenses */}

        <div className="flex items-center py-2  border-b ">
          <div className="flex items-center justify-center">
            <FaReceipt className={`text-lg text-blue-500`} />
          </div>
          <div className="ml-4">
            <div className="text-gray-700">Expenses</div>
            <div className={`text-xl font-bold text-blue-500`}>
              <CountUp end={summary.totalExpenses} suffix="€" />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center py-2">
          <div className="flex items-center justify-center">
            <FaEquals
              className={`text-lg ${
                summary.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
          </div>
          <div className="ml-4">
            <div className="text-gray-700">Balance</div>
            <div
              className={`text-xl font-bold ${
                summary.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <CountUp end={summary.balance} suffix="€" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default Balance;
