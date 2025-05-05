"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function CashFlowStatement() {
  const cashFlowData = {
    period: {
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    operatingActivities: 30000,
    investingActivities: -10000,
    financingActivities: 5000,
    netCashFlow: 25000,
  };

  const chartData = [
    { name: "Operating", value: cashFlowData.operatingActivities },
    { name: "Investing", value: cashFlowData.investingActivities },
    { name: "Financing", value: cashFlowData.financingActivities },
    { name: "Net Cash Flow", value: cashFlowData.netCashFlow },
  ];

  return (
    <div className="space-y-4 container bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Statement</CardTitle>
          <p>
            {cashFlowData.period.startDate} to {cashFlowData.period.endDate}
          </p>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Operating Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${cashFlowData.operatingActivities.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investing Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${cashFlowData.investingActivities.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financing Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${cashFlowData.financingActivities.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${cashFlowData.netCashFlow.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
