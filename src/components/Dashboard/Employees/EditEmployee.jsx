"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditPayroll from "./Payroll/EditPayroll";
import CreatePayroll from "./Payroll/CreatePayroll";
import useUser from "@/contexts/user";
import EditEmailAndPassword from "./EditEmailAndPassword";
import EditPersonalInfo from "./EditPersonalInfo";
import EditJobInfo from "./EditJobInfo";
import { Separator } from "@/components/ui/separator";

export function EditEmployee({ employee, onClose }) {
  const user = useUser();

  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader className=" w-full">
          <CardTitle className=" flex items-center justify-between">
            <h1 className="text-custom-gradient db-title"> Edit Employee</h1>{" "}
            <Button onClick={onClose} className="w-fit " variant="destructive">
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <EditEmailAndPassword
            _id={employee?._id}
            email={employee?.email}
            employeeId={employee?.employeeId}
          />
          <Separator />
          <EditPersonalInfo personalInfo={employee?.personalInfo} />
          <EditJobInfo jobInfo={employee?.jobInfo} />
        </CardContent>
      </Card>
      <br />

      {employee.jobInfo?.payrollId?._id ? (
        <EditPayroll payroll={employee.jobInfo?.payrollId} />
      ) : (
        <CreatePayroll employeeId={employee?._id} />
      )}
    </>
  );
}
