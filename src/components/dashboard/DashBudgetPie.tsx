"use client";

import { ReactNode } from "react";
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { Budget } from "@/types";

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

interface BudgetPieProps {
  budget: Budget;
  spent: number;
  icon: ReactNode; // Type the icon prop
  color: string; // Type the color prop
}

const DashBudgetPie = ({ budget, spent, icon, color }: BudgetPieProps) => {
  const remaining = Number(budget.amount) - spent;
  const percentageUsed =
    Number(budget.amount) > 0
      ? Math.min(Math.round((spent / Number(budget.amount)) * 100), 100)
      : 0;

  const chartData = [{ item: "spent", amount: percentageUsed, fill: color }];

  const getRemainingColor = (remaining: number) => {
    return remaining < 1 ? "text-red-500" : "text-gray-700";
  };

  return (
    <div className="flex items-center">
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
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full text-lg ${getRemainingColor(
            remaining
          )}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md text-gray-700">
              {budget.category.charAt(0).toUpperCase() +
                budget.category.slice(1)}
            </h3>
            <p className={`text-lg font-bold ${getRemainingColor(remaining)}`}>
              {remaining}€
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBudgetPie;
