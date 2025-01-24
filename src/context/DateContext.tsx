"use client";

import { createContext, useContext, useState } from "react";

interface DateContextType {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
}

const DateContext = createContext<DateContextType | null>(null);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleMonthChange = (month: string) => {
    setSelectedMonth(Number(month));
  };
  const handleYearChange = (year: string) => {
    setSelectedYear(Number(year));
  };

  const value = {
    selectedMonth,
    selectedYear,
    setSelectedMonth: handleMonthChange,
    setSelectedYear: handleYearChange,
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDates must be used within a DateProvider");
  }
  return context;
};
