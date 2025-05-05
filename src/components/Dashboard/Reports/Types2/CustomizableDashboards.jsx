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
  KPI1: {
    title: "Monthly Revenue",
    value: 30000,
    target: 35000,
  },
  KPI2: {
    title: "Expenses",
    value: 10000,
    target: 12000,
  },
};

const chartData = [
  { name: "Monthly Revenue", value: data.KPI1.value, target: data.KPI1.target },
  { name: "Expenses", value: data.KPI2.value, target: data.KPI2.target },
];

export function CustomizableDashboards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customizable Dashboards</CardTitle>
        <CardDescription>Key Performance Indicators (KPIs)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Actual" />
            <Bar dataKey="target" fill="#82ca9d" name="Target" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, kpi]) => (
            <div key={key} className="border p-4 rounded-md">
              <h3 className="font-semibold">{kpi.title}</h3>
              <p>Value: ${kpi.value.toFixed(2)}</p>
              <p>Target: ${kpi.target.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
