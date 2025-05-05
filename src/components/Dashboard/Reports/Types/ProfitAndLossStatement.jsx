"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchCustom, formatDate } from "@/lib/utils";
import useUser from "@/contexts/user";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/contexts/company";
import useCurrency from "@/hooks/useCurrency";
import { Separator } from "@radix-ui/react-dropdown-menu";
import DownloadReportBtn from "../DownloadReportBtn";
import Link from "next/link";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";

export default function ProfitLossStatement() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const { company } = useCompany();
  const contentRef = useRef(null);
  const currency = useCurrency();
  const fetchData = async () => {
    if (!fromDate || !toDate) return;

    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/profit-loss?fromDate=${fromDate}&toDate=${toDate}`,
        {
          method: "GET",
          token: user?.token,
        },
      );
      const result = await response.json();
      setData(result?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <Link href={"/dashboard/reports"} className=" text-primary-navy">
              <ArrowLeft size={34} />
            </Link>
            <h1 className="db-title text-custom-gradient ">
              Profit and Loss Statement
            </h1>
          </CardTitle>
          <CardDescription>
            Select a date range to view the report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="mb-1 text-sm font-medium">
                From Date
              </label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className=" w-full"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="toDate" className="mb-1 text-sm font-medium">
                To Date
              </label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className=" w-full"
              />
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-4">
            <Button
              onClick={fetchData}
              disabled={!fromDate || !toDate || isLoading}
              className=""
            >
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
            {data && (
              <DownloadReportBtn
                contentRef={contentRef}
                name={`Profit-Loss-Report-[${formatDate(fromDate)}-to-${formatDate(toDate)}]-${company?.displayName}.pdf`}
              />
            )}
          </div>

          <div className="p-8">
            {data && (
              <div
                ref={contentRef}
                style={{ width: "210mm" }}
                className=" px-14 py-8 mx-auto"
              >
                <h1 className="text-2xl font-bold w-full text-center mb-6">
                  {company?.displayName}
                </h1>

                <div className=" text-sm float-right ">
                  <p className="">EIN: {company?.ein}</p>

                  <p className="">SSN: {company?.ssn}</p>
                  <p className="">Phone: {company?.phone}</p>
                  <p className="">Email: {company?.email}</p>
                  <p className="">Address: {company?.address}</p>
                </div>

                <h2 className="text-xl font-semibold mt-12 mb-2">
                  Profit and Loss Statement
                </h2>
                <p className="mb-4 font-semibold">
                  {formatDate(data.from)} to {formatDate(data.to)}
                </p>
                <Separator />
                <div className="mb-6 mt-20  ">
                  <h3 className="text-lg font-semibold mb-2">Income</h3>
                  {data.incomes.map((income, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b  pb-2 border-neutral-800 ml-4"
                    >
                      <span>
                        {income.type === "invoice" ? "Services" : "Others"}
                      </span>
                      <span>
                        {currency.symbol} {income.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold mt-2 ml-4 border-b-2 pb-2 border-neutral-800">
                    <span>Total Income</span>
                    <span>
                      {currency.symbol} {data.totalIncome}
                    </span>
                  </div>
                </div>
                <div className="mb-6 ">
                  <h3 className="text-lg font-semibold mb-2">Expenses</h3>
                  {data.expenses.map((expense, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b ml-4 pb-2 border-neutral-800"
                    >
                      <span>
                        {expense.type.charAt(0).toUpperCase() +
                          expense.type.slice(1)}
                      </span>
                      <span>
                        {currency.symbol} {expense.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold mt-2 border-b-2 pb-2 border-neutral-800 ml-4">
                    <span>Total Expenses</span>
                    <span>
                      {currency.symbol} {data.totalExpenses}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg border-b-[3px] pb-2 border-neutral-800 ">
                  <span>
                    Net {parseFloat(data.net) >= 0 ? "Profit" : "Loss"}
                  </span>
                  <span
                    className={
                      parseFloat(data.net) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {currency.symbol} {parseFloat(data.net) >= 0 && "+"}
                    {data.net}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
