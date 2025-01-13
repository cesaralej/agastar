"use client";

import { TransactionProvider } from "@/context/TransactionContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { RecurringProvider } from "@/context/RecurringContext";

const TransactionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TransactionProvider>
      <BudgetProvider>
        <RecurringProvider>{children}</RecurringProvider>
      </BudgetProvider>
    </TransactionProvider>
  );
};

export default TransactionProviderWrapper;
