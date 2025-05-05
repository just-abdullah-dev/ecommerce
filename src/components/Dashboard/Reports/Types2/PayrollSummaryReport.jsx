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
      employee: "Employee A",
      salary: 50000,
      bonus: 5000,
      tax: 8000,
    },
  ],
};

export function PayrollSummaryReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Summary Report</CardTitle>
        <CardDescription>
          Salary, bonus, and tax details per employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.details}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="employee" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="salary" fill="#8884d8" />
            <Bar dataKey="bonus" fill="#82ca9d" />
            <Bar dataKey="tax" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
