"use client";

import { TransactionProvider } from "@/context/TransactionContext";

const TransactionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <TransactionProvider>{children}</TransactionProvider>;
};

export default TransactionProviderWrapper;
