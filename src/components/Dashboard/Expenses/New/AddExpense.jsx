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
import ExpenseDetails from "./ExpenseDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function AddExpense() {
  const [expenseDetails, setExpenseDetails] = useState({
    title: "",
    desc: "",
    type: "bill",
    totalAmount: 0,
    date: "",
    from: "",
    to: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();

  const handleAddExpense = async () => {
    setIsLoading(true);
    try {
      if (
        !expenseDetails.title ||
        !expenseDetails.type ||
        !expenseDetails.totalAmount ||
        !expenseDetails.date ||
        !expenseDetails.from ||
        !expenseDetails.to
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/company/expense", {
        method: "POST",
        body: JSON.stringify(expenseDetails),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
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
      console.error("Error creating expense:", error);
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
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <ExpenseDetails
          details={expenseDetails}
          setDetails={setExpenseDetails}
        />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleAddExpense}
          disabled={isLoading}
        >
          {isLoading ? "Adding Expense..." : "Add Expense"}
        </Button>
      </CardFooter>
    </Card>
  );
}
