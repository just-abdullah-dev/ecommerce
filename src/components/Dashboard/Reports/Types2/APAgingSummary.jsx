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
      supplier: "Vendor X",
      current: 300,
      "1-30_days": 200,
      "31-60_days": 100,
      "61+_days": 50,
    },
  ],
};

export function APAgingSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>A/P Aging Summary</CardTitle>
        <CardDescription>Accounts Payable Aging</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.details}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="supplier" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" stackId="a" fill="#8884d8" />
            <Bar dataKey="1-30_days" stackId="a" fill="#82ca9d" />
            <Bar dataKey="31-60_days" stackId="a" fill="#ffc658" />
            <Bar dataKey="61+_days" stackId="a" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
