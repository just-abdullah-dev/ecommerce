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
  totalSales: 30000,
  taxRate: 0.1,
  taxOwed: 3000,
};

const chartData = [
  { name: "Net Sales", value: data.totalSales - data.taxOwed },
  { name: "Tax Owed", value: data.taxOwed },
];

const COLORS = ["#0088FE", "#00C49F"];

export function SalesTaxLiabilityReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Tax Liability Report</CardTitle>
        <CardDescription>Breakdown of sales tax liability</CardDescription>
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
          <p>Total Sales: ${data.totalSales.toFixed(2)}</p>
          <p>Tax Rate: {(data.taxRate * 100).toFixed(2)}%</p>
          <p>Tax Owed: ${data.taxOwed.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
