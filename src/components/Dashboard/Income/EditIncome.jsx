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
import IncomeDetails from "./New/IncomeDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function EditIncome({ income, onClose }) {
  const [details, setDetails] = useState(income);
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (
        !details.notes ||
        !details.type ||
        !details.totalAmount ||
        !details.date
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/income", {
        method: "PUT",
        body: JSON.stringify({
          ...details,
          incomeId: details?._id,
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
      console.error("Error updating income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center justify-between">
          Edit income
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <IncomeDetails details={details} setDetails={setDetails} />
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
        <Button className=" w-full" onClick={handleEdit} disabled={isLoading}>
          {isLoading ? "Updating Income..." : "Update Income"}
        </Button>
      </CardFooter>
    </Card>
  );
}
