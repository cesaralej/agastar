import { useState, useEffect } from "react";
import { useTransactions } from "@/context/TransactionContext";
import TransactionItem from "./TransactionItem";
import TransactionFilter from "./TransactionFilter";
import Spinner from "@/components/Spinner";
import { Transaction } from "@/types";

const TransactionList = ({
  onEdit,
}: {
  onEdit: (transaction: Transaction) => void;
}) => {
  const { transactions, loading, error } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    setFilteredTransactions(transactions || []);
  }, [transactions]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return <Spinner loading={loading} />;
  }

  const handleFilterChange = (filter: string | null) => {
    if (filter) {
      setFilteredTransactions(
        (transactions || []).filter(
          (transaction) => transaction.category === filter
        )
      );
    }
  };

  if (!filteredTransactions || filteredTransactions.length === 0) {
    return (
      <div className="container mx-auto mt-4">
        <TransactionFilter onFilterChange={handleFilterChange} />
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <p className="text-gray-500 text-center">
              No transactions yet. Add some to see them here.
            </p>
          </div>
        )}
      </div>
    );
  }

  const groupedTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce<Record<string, Transaction[]>>((acc, transaction) => {
      const date = new Date(transaction.date);
      const day = date.toLocaleDateString("en-US", { day: "2-digit" });
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
      const formattedDate = `${day} ${month} | ${weekday}`;

      acc[formattedDate] = acc[formattedDate] || [];
      acc[formattedDate].push(transaction);
      return acc;
    }, {});

  return (
    <div className="container mx-auto mt-4">
      <TransactionFilter onFilterChange={handleFilterChange} />
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        Object.entries(groupedTransactions).map(
          ([date, transactionsByDate]: [string, Transaction[]]) => (
            <div key={date}>
              <h3 className="text-md text-gray-500 font-semibold mb-2">
                {date}
              </h3>
              <div className="flex flex-col gap-4">
                {transactionsByDate.map((transaction: Transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEdit}
                  />
                ))}
                <hr className="my-4 border-gray-300" />
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default TransactionList;
