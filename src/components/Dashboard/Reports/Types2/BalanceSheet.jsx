"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function BalanceSheet() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [balanceSheetData, setBalanceSheetData] = useState({
    date: "2024-12-31",
    assets: {
      currentAssets: 50000,
      fixedAssets: 100000,
    },
    liabilities: {
      currentLiabilities: 20000,
      longTermLiabilities: 30000,
    },
    equity: 100000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalanceSheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/balance-sheet?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch balance sheet data");
      }
      const data = await response.json();
      setBalanceSheetData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheetData();
  }, []);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBalanceSheetData();
  };

  const pieChartData = balanceSheetData
    ? [
        {
          name: "Current Assets",
          value: balanceSheetData.assets.currentAssets,
        },
        { name: "Fixed Assets", value: balanceSheetData.assets.fixedAssets },
        {
          name: "Current Liabilities",
          value: balanceSheetData.liabilities.currentLiabilities,
        },
        {
          name: "Long Term Liabilities",
          value: balanceSheetData.liabilities.longTermLiabilities,
        },
        { name: "Equity", value: balanceSheetData.equity },
      ]
    : [];

  return (
    <div className="space-y-4 container bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex items-end space-x-2 mb-4"
          >
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Date
              </label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                className="mt-1 block w-full"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Fetch Data"}
            </Button>
          </form>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {balanceSheetData && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  Balance Sheet as of {balanceSheetData.date}
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
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
            </>
          )}
        </CardContent>
      </Card>

      {balanceSheetData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Current Assets: $
                {balanceSheetData.assets.currentAssets.toLocaleString()}
              </p>
              <p>
                Fixed Assets: $
                {balanceSheetData.assets.fixedAssets.toLocaleString()}
              </p>
              <p className="font-bold">
                Total Assets: $
                {(
                  balanceSheetData.assets.currentAssets +
                  balanceSheetData.assets.fixedAssets
                ).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Current Liabilities: $
                {balanceSheetData.liabilities.currentLiabilities.toLocaleString()}
              </p>
              <p>
                Long Term Liabilities: $
                {balanceSheetData.liabilities.longTermLiabilities.toLocaleString()}
              </p>
              <p className="font-bold">
                Total Liabilities: $
                {(
                  balanceSheetData.liabilities.currentLiabilities +
                  balanceSheetData.liabilities.longTermLiabilities
                ).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">
                Total Equity: ${balanceSheetData.equity.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
