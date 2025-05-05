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
import IncomeDetails from "./IncomeDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function AddIncome() {
  const [details, setDetails] = useState({
    notes: "",
    type: "others",
    totalAmount: 0,
    date: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      if (!details.notes || !details.totalAmount || !details.date) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/income", {
        method: "POST",
        body: JSON.stringify(details),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/incomes";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating income:", error);
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
          Add Income
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <IncomeDetails details={details} setDetails={setDetails} />
      </CardContent>
      <CardFooter>
        <Button className=" w-full" onClick={handleAdd} disabled={isLoading}>
          {isLoading ? "Adding Income..." : "Add Income"}
        </Button>
      </CardFooter>
    </Card>
  );
}
