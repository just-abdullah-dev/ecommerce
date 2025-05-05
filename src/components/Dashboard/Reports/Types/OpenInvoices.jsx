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

import { Checkbox } from "@/components/ui/checkbox";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export default function OpenInvoices() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const { company } = useCompany();
  const contentRef = useRef(null);
  const currency = useCurrency();

  const [overDue, setOverDue] = useState(null);
  const fetchData = async () => {
    if (!fromDate || !toDate) return;
    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/open-invoices?fromDate=${fromDate}&toDate=${toDate}&overDue=${overDue}`,
        {
          method: "GET",
          token: user?.token,
        },
      );
      const result = await response.json();
      if (result?.success) {
        setData(result?.data);
      } else {
        toast({
          description: result?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (isChecked) => {
    if (isChecked) {
      setOverDue(new Date().toISOString());
    } else {
      setOverDue(null);
    }
    setData(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <Link href={"/dashboard/reports"} className=" text-primary-navy">
              <ArrowLeft size={34} />
            </Link>
            <h1 className="db-title text-custom-gradient ">Open Invoices</h1>
          </CardTitle>
          <CardDescription>
            Select a date range to generate the report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
            <div className=" flex items-center pt-4 gap-6">
              <label
                htmlFor="overdue"
                className="text-sm font-medium hover:underline cursor-pointer"
              >
                Only Overdue
              </label>
              <Checkbox
                className=" bg-gray-300"
                id="overdue"
                checked={overDue !== null}
                onCheckedChange={handleChange} // Handle state change
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
                name={`Open-Invoices-[${formatDate(fromDate)}-to-${formatDate(
                  toDate,
                )}]-${company?.displayName}.pdf`}
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
                  Open Invoices {overDue && `(Only Over Due)`}
                </h2>
                <p className="mb-4 font-semibold">
                  {formatDate(data.from)} to {formatDate(data.to)}
                </p>
                <Separator />
                <div className="mb-6 mt-20  ">
                  <Table>
                    <TableHeader>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableHeader>
                    <TableBody>
                      {data?.invoices.map((item, index) => {
                        return (
                          <TableRow
                            className="border-b pb-2 border-neutral-800 mx-4"
                            key={index}
                          >
                            <TableCell>{item?.invoiceNo}</TableCell>
                            <TableCell>{item?.firstName}</TableCell>
                            <TableCell>{item?.email}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              {currency.symbol} {item?.totalAmount}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between font-bold text-lg border-b-[3px] pb-2 border-neutral-800 ">
                  <span>Total Amount</span>
                  <span>
                    {currency.symbol} {data.totalAmount}
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
