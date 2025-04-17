"use client";
import { useEffect, useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaWallet, FaCreditCard } from "react-icons/fa";
import { Transaction } from "@/types";
import Spinner from "@/components/Spinner";
import CountUp from "react-countup";

const Summary = () => {
  const { transactions, loading, error } = useTransactions();
  const [summary, setSummary] = useState({
    savings: 0,
    credit: 0,
  });

  useEffect(() => {
    if (!transactions) return;
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
        } else {
          savings -= amount;
        }
      } else {
        credit += amount;
      }
    });

    setSummary({
      savings: savings,
      credit: credit,
    });
  }, [transactions]);

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Savings */}
        <div className="flex items-center py-2 border-b">
          <div className="flex items-center justify-center">
            <FaWallet className="text-yellow-600" />
          </div>
          <div className="ml-4">
            <div className="text-gray-700">Savings</div>
            <div className={`text-xl font-bold text-yellow-600`}>
              <CountUp end={summary.savings} suffix="€" />
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="flex items-center py-2">
          <div className="flex items-center justify-center">
            <FaCreditCard className="text-indigo-600" />
          </div>
          <div className="ml-4">
            <div className="text-gray-700">Credit</div>
            <div className={`text-xl font-bold text-indigo-600`}>
              <CountUp end={summary.credit} suffix="€" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
