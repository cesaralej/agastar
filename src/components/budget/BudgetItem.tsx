import { ReactNode } from "react";
import { Budget } from "@/types";
import { Card } from "@/components/ui/card";
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface BudgetItemProps {
  budget: Budget;
  spent: number;
  icon: ReactNode;
  color: string;
  noEdit?: boolean;
  onEdit: (budget: Budget) => void;
}

const formatNumberWithCommas = (number: number | undefined): string => {
  if (number === undefined) return "0";
  if (isNaN(number)) return "0";
  return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const BudgetItem = ({
  budget,
  spent,
  icon,
  color,
  onEdit,
}: BudgetItemProps) => {
  const remaining = Number(budget.amount) - spent;
  const percentageUsed =
    Number(budget.amount) > 0
      ? Math.min(Math.round((spent / Number(budget.amount)) * 100), 100)
      : 0;

  const onEditClick = () => {
    onEdit(budget);
  };

  const getProgressBarColor = (percentage: number) => {
    return percentage < 75 ? "#22C55E" : "#EF4444";
  };

  const getRemainingColor = (remaining: number) => {
    return remaining < 0 ? "text-red-500" : "text-green-500";
  };

  const chartData = [
    {
      item: "spent",
      amount: percentageUsed,
      fill: getProgressBarColor(percentageUsed),
    },
  ];

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <button
        className=""
        onClick={onEditClick}
        aria-label={`Edit budget for ${budget.category}`}
        style={{ border: "none", background: "transparent", textAlign: "left" }}
      >
        <div className="flex justify-between items-center">
          <div className="relative">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-24 h-24"
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={percentageUsed * 3.6 + 90}
                innerRadius={30}
                outerRadius={60}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[36, 24]}
                />
                <RadialBar dataKey="amount" background />
                <PolarRadiusAxis
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                ></PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full text-lg ${color}`}
            >
              {icon}
            </div>
          </div>
          <div className="flex-1 pr-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {budget.category.charAt(0).toUpperCase() +
                  budget.category.slice(1)}
              </h3>
            </div>
            <div>
              <div>
                <p className="">
                  {formatNumberWithCommas(Number(budget.amount))}€
                </p>
                <p className={`text-sm ${getRemainingColor(remaining)}`}>
                  Left: {formatNumberWithCommas(remaining)}€
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </Card>
  );
};

export default BudgetItem;
