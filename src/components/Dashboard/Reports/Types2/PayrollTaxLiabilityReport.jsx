"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = {
  totalWages: 55000,
  taxRate: 0.15,
  taxOwed: 8250,
};

const chartData = [
  { name: "Net Wages", value: data.totalWages - data.taxOwed },
  { name: "Tax Owed", value: data.taxOwed },
];

const COLORS = ["#0088FE", "#00C49F"];

export function PayrollTaxLiabilityReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Tax Liability Report</CardTitle>
        <CardDescription>Breakdown of payroll tax liability</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <p>Total Wages: ${data.totalWages.toFixed(2)}</p>
          <p>Tax Rate: {(data.taxRate * 100).toFixed(2)}%</p>
          <p>Tax Owed: ${data.taxOwed.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
