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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCustom, formatDate } from "@/lib/utils";
import useUser from "@/contexts/user";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/contexts/company";
import useCurrency from "@/hooks/useCurrency";
import { Separator } from "@radix-ui/react-dropdown-menu";
import DownloadReportBtn from "../DownloadReportBtn";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ARAgingSummary() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const { company } = useCompany();
  const contentRef = useRef(null);
  const currency = useCurrency();
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/ar-aging-summary?date=${new Date()}`,
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
          variant: "destructive",
          description: result?.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(data);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <Link href={"/dashboard/reports"} className=" text-primary-navy">
              <ArrowLeft size={34} />
            </Link>
            <h1 className="db-title text-custom-gradient ">
              Accounts Receivable Aging Summary
            </h1>
          </CardTitle>
          <CardDescription>
            Select a specific date to generate the summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" grid grid-cols-2 gap-4">
            <Button onClick={fetchData} disabled={isLoading} className="">
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
            {data && (
              <DownloadReportBtn
                contentRef={contentRef}
                name={`AR-Aging-Summary-As-of-${formatDate(new Date())}-${
                  company?.displayName
                }.pdf`}
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
                  Accounts Receivable Aging Summary
                </h2>
                <p className="mb-4 font-semibold">
                  As of {formatDate(data.date)}
                </p>
                <Separator />
                <div className="mb-6 mt-20  ">
                  <Table>
                    <TableHeader className="border-b-2 font-semibold  border-neutral-800">
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableHeader>
                    <TableBody>
                      {data.invoices.map((type, i) => {
                        return (
                          <>
                            <h1 className=" mt-2 font-semibold text-lg">
                              {type.category} ({type.count})
                            </h1>
                            {type?.invoices.map((item, index) => {
                              return (
                                <TableRow
                                  className="border-b pb-2 border-neutral-800 mx-4"
                                  key={index}
                                >
                                  <TableCell>{item?.invoiceNo}</TableCell>
                                  <TableCell>{item?.firstName}</TableCell>
                                  <TableCell>{item?.email}</TableCell>
                                  <TableCell>
                                    {formatDate(item?.dueDate)}
                                  </TableCell>
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
                            <TableRow>
                              <TableCell colSpan={9}>
                                <div className="flex justify-between border-b-2 pb-2 border-neutral-800 ">
                                  <span>Total Amount</span>
                                  <span>
                                    {currency.symbol} {type?.totalAmount}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={9}></TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between font-bold text-lg border-b-[3px] pb-2 border-neutral-800 ">
                  <span>Total Amount</span>
                  <span>
                    {currency.symbol} {data.netTotal}
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
