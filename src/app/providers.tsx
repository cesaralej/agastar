"use client";

import { TransactionProvider } from "@/context/TransactionContext";
import { BudgetProvider } from "@/context/BudgetContext";

const TransactionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TransactionProvider>
      <BudgetProvider>{children}</BudgetProvider>
    </TransactionProvider>
  );
};

export default TransactionProviderWrapper;
