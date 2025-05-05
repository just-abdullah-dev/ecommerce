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
  details: [
    {
      category: "Office Supplies",
      totalExpenses: 500,
    },
    {
      category: "Utilities",
      totalExpenses: 1500,
    },
  ],
};

export function ExpenseByCategoryReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense by Category Report</CardTitle>
        <CardDescription>Total expenses per category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.details}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalExpenses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
