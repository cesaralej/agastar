import TransactionItem from "./TransactionItem";
import { Transaction } from "@/types";

const TransactionList = ({
  isHome = false,
  transactions = [] as Transaction[],
  error,
  onEdit,
  onDelete,
}: {
  isHome?: boolean;
  transactions: Transaction[];
  error?: { message: string };
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500 text-center">
          No transactions yet. Add some to see them here.
        </p>
      </div>
    );
  }

  const filteredTransactions = isHome ? transactions.slice(0, 3) : transactions;

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce<
    Record<string, Transaction[]>
  >((acc, transaction) => {
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
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
      {Object.entries(groupedTransactions).map(([date, transactionsByDate]) => (
        <div key={date}>
          <h3 className="text-md text-gray-500 font-semibold mb-2">{date}</h3>
          <div className="flex flex-col gap-4">
            {transactionsByDate.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            <hr className="my-4 border-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
