import { useDate } from "@/context/DateContext";
import { useTransactions } from "@/context/TransactionContext";

import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const ExpensesChart = () => {
  const { selectedMonth, selectedYear } = useDate();
  const { calculateSpentPerDay } = useTransactions();

  const data = calculateSpentPerDay(selectedMonth, selectedYear);
  const chartData = Object.entries(data).map(([, value]) => ({
    Day: value.Day,
    Spent: value.Spent,
  }));

  return (
    <ChartContainer config={chartConfig} className="max-h-[50px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="Spent" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
export default ExpensesChart;
