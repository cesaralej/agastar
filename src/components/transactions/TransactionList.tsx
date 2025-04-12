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
  const { transactions: allTransactions, loading, error } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  // Effect to apply filters whenever transactions, category, or search term change
  useEffect(() => {
    // Start with the full list (or empty if none)
    let result = allTransactions || [];

    // 1. Apply category filter
    if (selectedCategory) {
      result = result.filter(
        (transaction) => transaction.category === selectedCategory
      );
    }

    // 2. Apply search term filter (on the result of the category filter)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Update the state holding the list to be displayed
    setFilteredTransactions(result);
  }, [allTransactions, selectedCategory, searchTerm]); // Dependencies

  // --- Loading and Error States ---
  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Error loading transactions: {error.message}
      </div>
    );
  }

  if (loading && !allTransactions?.length) {
    return (
      <div className="container mx-auto mt-4">
        {/* Optionally show filters even when loading */}
        {/* <TransactionFilter ... /> */}
        <Spinner loading={true} />
      </div>
    );
  }

  // --- Handlers for Filter Changes ---
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // --- Grouping and Sorting (Operate on filteredTransactions) ---
  const groupedTransactions = filteredTransactions // Use the filtered list
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
    .reduce<Record<string, Transaction[]>>((acc, transaction) => {
      // Consistent date formatting
      const date = new Date(transaction.date);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        weekday: "long",
      };
      const formattedDate = date
        .toLocaleDateString("en-US", options)
        .replace(",", " |"); // Example: "12 Apr | Saturday"

      acc[formattedDate] = acc[formattedDate] || [];
      acc[formattedDate].push(transaction);
      return acc;
    }, {});

  return (
    <div className="container mx-auto mt-4">
      <TransactionFilter
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {loading && <Spinner loading={loading} />}
      {!loading && filteredTransactions.length === 0 ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">
            {
              allTransactions && allTransactions.length > 0
                ? "No transactions match your current filters." // Message when filters yield no results
                : "No transactions yet. Add some to see them here." // Message when there are no transactions at all
            }
          </p>
        </div>
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
