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
import { ArrowLeft } from "lucide-react";

export default function BalanceSheet() {
  const [date, setDate] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const { company } = useCompany();
  const contentRef = useRef(null);
  const currency = useCurrency();
  const fetchData = async () => {
    if (!date) return;

    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/balance-sheet?date=${date}`,
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
            <h1 className="db-title text-custom-gradient ">Balance Sheet</h1>
          </CardTitle>
          <CardDescription>
            Select a specific date to generate the balance sheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="date" className="mb-1 text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className=" w-full"
              />
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-4">
            <Button
              onClick={fetchData}
              disabled={!date || isLoading}
              className=""
            >
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
            {data && (
              <DownloadReportBtn
                contentRef={contentRef}
                name={`Balance-Sheet-As-of-${formatDate(date)}-${company?.displayName}.pdf`}
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
                  Balance Sheet
                </h2>
                <p className="mb-4 font-semibold">
                  As of {formatDate(data.date)}
                </p>
                <Separator />
                <div className="mb-6 mt-20  ">
                  <h3 className="text-lg font-semibold mb-2">Assets</h3>
                  {data.assets.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b  pb-2 border-neutral-800 ml-4"
                    >
                      <span>{item.title}</span>
                      <span>
                        {currency.symbol} {item.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg border-b-[3px] pb-2 border-neutral-800 ">
                  <span>Total Assets</span>
                  <span>
                    {currency.symbol} {data.totalAssets}
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
