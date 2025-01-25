"use client";
import { useEffect, useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaWallet, FaCreditCard } from "react-icons/fa";
import { Transaction } from "@/types";
import Spinner from "@/components/Spinner";

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
        <div className="flex justify-between items-center py-4 border-b">
          <div className="flex items-center space-x-2">
            <FaWallet className="text-yellow-600" />
            <span className="text-lg text-gray-700">Savings</span>
          </div>
          <div className="text-xl font-bold text-yellow-600">
            {summary.savings.toFixed(0)}€
          </div>
        </div>

        {/* Credit */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <FaCreditCard className="text-indigo-600" />
            <span className="text-lg text-gray-700">Credit</span>
          </div>
          <div className="text-xl font-bold text-indigo-600">
            {summary.credit.toFixed(0)}€
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
