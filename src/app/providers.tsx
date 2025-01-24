"use client";

import { TransactionProvider } from "@/context/TransactionContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { RecurringProvider } from "@/context/RecurringContext";
import { DateProvider } from "@/context/DateContext";

const TransactionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DateProvider>
      <RecurringProvider>
        <TransactionProvider>
          <BudgetProvider>{children}</BudgetProvider>
        </TransactionProvider>
      </RecurringProvider>
    </DateProvider>
  );
};

export default TransactionProviderWrapper;
