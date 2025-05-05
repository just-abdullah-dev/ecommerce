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
import { PayrollDetails } from "./PayrollDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function CreatePayroll({ employeeId, navigation = false }) {
  const user = useUser();
  const [payrollDetails, setPayrollDetails] = useState({
    employeeId: employeeId,
    salaryType: "",
    salary: 0,
    bonus: 0,
    tax: 0,
    hourlyRate: 0,
    overtimeHourlyRate: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePayroll = async () => {
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
        method: "POST",
        body: JSON.stringify(payrollDetails),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/employees";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating payroll:", error);
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
          {navigation && (
            <Link href={"/dashboard/employees"}>
              <ArrowLeft stroke="#003366" size={34} />
            </Link>
          )}{" "}
          Create Payroll
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
          onClick={handleCreatePayroll}
          disabled={isLoading}
        >
          {isLoading ? "Creating Payroll..." : "Create Payroll"}
        </Button>
      </CardFooter>
    </Card>
  );
}
