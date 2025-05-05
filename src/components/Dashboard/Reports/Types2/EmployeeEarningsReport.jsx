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
      grossPay: 55000,
      deductions: 8000,
      netPay: 47000,
    },
  ],
};

export function EmployeeEarningsReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Earnings Report</CardTitle>
        <CardDescription>
          Gross pay, deductions, and net pay per employee
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
            <Bar dataKey="grossPay" fill="#8884d8" />
            <Bar dataKey="deductions" fill="#82ca9d" />
            <Bar dataKey="netPay" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
