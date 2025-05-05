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
import { PayrollDetails } from "./PayrollDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function EditPayroll({ payroll }) {
  const [payrollDetails, setPayrollDetails] = useState(payroll);
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePayroll = async () => {
    setIsLoading(true);
    try {
      if (!payrollDetails.salaryType) {
        toast({
          title: "Salary type missing!",
          variant: "destructive",
          description: "Select salary type.",
        });
        return;
      }
      if (payrollDetails.salaryType === "fixed" && payrollDetails.salary <= 0) {
        toast({
          title: "Salary field error!",
          variant: "destructive",
          description: "Salary must be greater than 0.",
        });
        return;
      }
      if (
        payrollDetails.salaryType === "hourly" &&
        payrollDetails.hourlyRate <= 0
      ) {
        toast({
          title: "Hourly Rate field error!",
          variant: "destructive",
          description: "Hourly Rate must be greater than 0.",
        });
        return;
      }

      const response = await fetchCustom("/payroll", {
        method: "PUT",
        body: JSON.stringify({
          ...payrollDetails,
          payrollId: payrollDetails?._id,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error Updating payroll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          Edit Payroll
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <PayrollDetails
          details={payrollDetails}
          setDetails={setPayrollDetails}
        />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleUpdatePayroll}
          disabled={isLoading}
        >
          {isLoading ? "Updating Payroll..." : "Update Payroll"}
        </Button>
      </CardFooter>
    </Card>
  );
}
