"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = {
  budget: 50000,
  actual: 47000,
  variance: -3000,
};

const chartData = [
  { name: "Budget", value: data.budget },
  { name: "Actual", value: data.actual },
  { name: "Variance", value: Math.abs(data.variance) },
];

export function BudgetVsActualReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual Report</CardTitle>
        <CardDescription>
          Comparison of budgeted and actual amounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <p>Budget: ${data.budget.toFixed(2)}</p>
          <p>Actual: ${data.actual.toFixed(2)}</p>
          <p>
            Variance: ${data.variance.toFixed(2)} (
            {data.variance < 0 ? "Under" : "Over"} Budget)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
