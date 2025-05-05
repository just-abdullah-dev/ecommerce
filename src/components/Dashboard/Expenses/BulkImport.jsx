"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import GetDataFromExcel from "@/components/Utils/GetDataFromExcel";
import Image from "next/image";

export default function BulkImport() {
  const user = useUser();
  const [expensesData, setExpensesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchCustom("/company/expense/bulk-import", {
        method: "POST",
        body: JSON.stringify({ expenses: expensesData }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setExpensesData([]);
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/expenses";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error importing bulk expenses:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          <Link href={"/dashboard/expenses"}>
            <ArrowLeft stroke="#003366" size={34} />
          </Link>{" "}
          Bulk Import of Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <h1 className="font-semibold text-lg">Instructions:</h1>
        <div className=" w-full md:flex gap-3">
          <Image
            src={"/portal/expenses-sample.png"}
            width={900}
            height={600}
            alt="expenses-Sample-Image"
            className=" aspect-auto w-[74%] border-2 border-black"
          />
          <div className=" w-[26%] container text-sm rounded-lg shadow-lg">
            <h1 className="font-semibold">
              1. Columns Name must be same as shown.
            </h1>
            <h1 className="font-semibold">2. Required Attributes Are:</h1>
            <ul className="list-none pl-4">
              <li>i. Title</li>
              <li>ii. Total Amount</li>
              <li>iii. Type</li>
              <li>iv. Date(on paid), From, To</li>
            </ul>
            <h1 className="font-semibold">
              3. Select this (&quot;YYYY-MM-DD&quot;) format for join date.{" "}
              <Link
                className=" font-normal text-blue-600 hover:underline"
                href="https://support.microsoft.com/en-us/office/format-a-date-the-way-you-want-8e10019e-d5d8-47a1-ba95-db95123d273e"
                target="_blank"
              >
                (see how)
              </Link>
            </h1>
            <h1 className="font-semibold">4. Rest are optionals.</h1>
          </div>
        </div>
        <GetDataFromExcel
          setData={(data) => {
            setExpensesData(data);
          }}
        />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleBulkImport}
          disabled={isLoading || expensesData.length === 0}
        >
          {isLoading ? "Importing Expenses..." : "Import Expenses"}
        </Button>
      </CardFooter>
    </Card>
  );
}
