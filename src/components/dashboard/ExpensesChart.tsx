import { useDate } from "@/context/DateContext";
import { useTransactions } from "@/context/TransactionContext";
import { useMemo } from "react";

import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  weekend: {
    label: "Weekend",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const ExpensesChart = () => {
  const { selectedMonth, selectedYear } = useDate();
  const { calculateSpentPerDay } = useTransactions();

  const data = useMemo(() => {
    const dailyData = calculateSpentPerDay(selectedMonth, selectedYear);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate(); // Get number of days in the month.

    const chartData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const dayData = dailyData[day] || { Day: day, Spent: 0 }; // Ensure we have data for every day

      chartData.push({
        Day: day,
        Spent: Math.min(dayData.Spent, 200), // Ensure Spent does not exceed 200.
        WeekendFill: isWeekend ? 200 : 0, // Use daysInMonth as a value to fill the whole bar height.
        isWeekend,
      });
    }
    return chartData;
  }, [calculateSpentPerDay, selectedMonth, selectedYear]);

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[50px] w-full"
      key={selectedMonth}
    >
      <BarChart accessibilityLayer data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="WeekendFill"
          fill={chartConfig.weekend.color}
          stackId="weekend"
        />
        <Bar dataKey="Spent" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
export default ExpensesChart;
