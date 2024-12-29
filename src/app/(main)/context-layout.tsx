"use client";
import { usePathname } from "next/navigation";
import { TransactionProvider } from "@/context/TransactionContext";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const isExpenses = pathname === "/expenses";

  if (!isDashboard && !isExpenses) return null;

  return <TransactionProvider>{children}</TransactionProvider>;
}
