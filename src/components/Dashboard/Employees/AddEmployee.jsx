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
import { EmployeeDetails } from "./EmployeeDetails";
import CreatePayroll from "./Payroll/CreatePayroll";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";

export default function AddEmployee() {
  const [employeeCreated, setEmployeeCreated] = useState("");
  const user = useUser();
  const [employeeDetails, setEmployeeDetails] = useState({
    email: "",
    password: "12345678",
    role: "employee",
    personalInfo: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      phone: "",
      avatar: "",
    },
    jobInfo: {
      employeeId: "",
      department: "",
      jobRole: "",
      joinDate: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!employeeDetails.email || !employeeDetails.personalInfo.firstName) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }
      const body = {
        ...employeeDetails,
        companyId: user?.companyId,
        name: employeeDetails.personalInfo.firstName,
      };
      const response = await fetchCustom("/user/create-user", {
        method: "POST",
        body: JSON.stringify(body),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setEmployeeDetails({});
        toast({
          variant: "custom",
          description: data?.message,
        });
        setEmployeeCreated(data?.data?._id);
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (employeeCreated) {
    return <CreatePayroll navigation employeeId={employeeCreated} />;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          <Link href={"/dashboard/employees"}>
            <ArrowLeft stroke="#003366" size={34} />
          </Link>{" "}
          Add Employee
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <EmployeeDetails
          details={employeeDetails}
          setDetails={setEmployeeDetails}
        />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleAddEmployee}
          disabled={isLoading}
        >
          {isLoading ? "Adding Employee..." : "Add Employee"}
        </Button>
      </CardFooter>
    </Card>
  );
}
