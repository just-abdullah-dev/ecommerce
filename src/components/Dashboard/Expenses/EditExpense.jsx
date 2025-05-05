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
import { toast } from "@/hooks/use-toast";
import ExpenseDetails from "./New/ExpenseDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function EditExpense({ expense, onClose }) {
  const [expenseDetails, setExpenseDetails] = useState(expense);
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleEditExpense = async () => {
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
        method: "PUT",
        body: JSON.stringify({
          ...expenseDetails,
          expenseId: expenseDetails?._id,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center justify-between">
          Edit Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <ExpenseDetails
          details={expenseDetails}
          setDetails={setExpenseDetails}
        />
      </CardContent>
      <CardFooter className=" flex gap-4">
        <Button
          onClick={onClose}
          className=" w-full"
          variant="destructive"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className=" w-full"
          onClick={handleEditExpense}
          disabled={isLoading}
        >
          {isLoading ? "Updating Expense..." : "Update Expense"}
        </Button>
      </CardFooter>
    </Card>
  );
}
