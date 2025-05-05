"use client";

import { useEffect, useState } from "react";
import { addDays, format, subDays, subMonths, startOfYear } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function ProfitAndLossStatement() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [plData, setPlData] = useState({
    period: {
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    revenue: 160000,
    costs: 55000,
    expenses: 35000,
    netIncome: 65000,
  });

  const fetchData = async (start, end) => {
    try {
      const response = await fetch(
        `/api/profit-loss?startDate=${start}&endDate=${end}`,
      );
      const data = await response.json();
      setPlData(data);
    } catch (error) {
      console.error("Error fetching profit and loss data:", error);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleQuickSelect = (days) => {
    const end = new Date();
    const start = subDays(end, days - 1);
    handleDateChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  const handleThisMonth = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    handleDateChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  const handleLastSixMonths = () => {
    const end = new Date();
    const start = subMonths(end, 6);
    handleDateChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  const handleThisYear = () => {
    const end = new Date();
    const start = startOfYear(end);
    handleDateChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  const handleLastYear = () => {
    const end = new Date();
    const start = subMonths(end, 12);
    handleDateChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-4 container bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
        <div className="flex flex-wrap gap-2 items-center ">
          <label htmlFor="startDate" className="font-medium">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value, endDate)}
            className="border rounded px-2 py-1"
          />
          <label htmlFor="endDate" className="font-medium">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => handleDateChange(startDate, e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-wrap gap-2 ">
          <Button variant="secondary" onClick={() => handleQuickSelect(7)}>
            Last 7 days
          </Button>
          <Button className="" variant="secondary" onClick={handleThisMonth}>
            This month
          </Button>
          <Button variant="secondary" onClick={handleLastSixMonths}>
            Last 6 months
          </Button>
          <Button variant="secondary" onClick={handleLastYear}>
            Last year
          </Button>
          <Button variant="secondary" onClick={handleThisYear}>
            This year
          </Button>
        </div>
      </div>

      {plData && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Costs & Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Revenue", value: plData.revenue },
                      { name: "Costs", value: plData.costs },
                      { name: "Expenses", value: plData.expenses },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${plData.netIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Profit & Loss Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: "Revenue", value: plData.revenue },
                    { name: "Costs", value: -plData.costs },
                    { name: "Expenses", value: -plData.expenses },
                    { name: "Net Income", value: plData.netIncome },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
