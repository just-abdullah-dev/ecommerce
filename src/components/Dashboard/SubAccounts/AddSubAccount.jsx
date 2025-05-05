"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AllEmployees } from "../Employees/AllEmployees";
import EditRole from "./EditRole";
import EditEmailAndPassword from "../Employees/EditEmailAndPassword";
import { Separator } from "@/components/ui/separator";

export default function AddSubAccount() {
  const currency = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [step, setStep] = useState(1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          Create Sub Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 ">
          {!selectedEmployee && (
            <AllEmployees
              isSelectEmp={true}
              isSubAccount={true}
              setSelectedEmp={setSelectedEmployee}
            />
          )}

          {selectedEmployee && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-custom-gradient flex gap-2">
                Selected Employee Details
              </h3>
              <Table>
                <TableBody className="grid grid-cols-1 md:grid-cols-2">
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>
                      {[
                        selectedEmployee?.personalInfo?.title,
                        selectedEmployee?.personalInfo?.firstName,
                        selectedEmployee?.personalInfo?.middleName,
                        selectedEmployee?.personalInfo?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{selectedEmployee?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Address</TableCell>
                    <TableCell>
                      {selectedEmployee?.personalInfo.address}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone</TableCell>
                    <TableCell>
                      {selectedEmployee?.personalInfo.phone}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Salary Type</TableCell>
                    <TableCell>
                      {selectedEmployee?.jobInfo?.payrollId?.salaryType}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {selectedEmployee?.jobInfo?.payrollId?.salaryType ===
                      "fixed"
                        ? "Monthly Salary"
                        : "Hourly Rate"}
                    </TableCell>
                    <TableCell>
                      {currency?.symbol}&nbsp;
                      {selectedEmployee?.jobInfo?.payrollId?.salaryType ===
                      "fixed"
                        ? selectedEmployee?.jobInfo?.payrollId?.salary
                        : selectedEmployee?.jobInfo?.payrollId?.hourlyRate}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Overtime Rate</TableCell>
                    <TableCell>
                      {currency?.symbol}&nbsp;
                      {selectedEmployee?.jobInfo?.payrollId?.overtimeHourlyRate}
                      /hour
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bonus</TableCell>
                    <TableCell>
                      {selectedEmployee?.jobInfo?.payrollId?.bonus}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tax</TableCell>
                    <TableCell>
                      {selectedEmployee?.jobInfo?.payrollId?.tax}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {step === 1 ? (
                <EditRole
                  _id={selectedEmployee?._id}
                  role={selectedEmployee?.role}
                  isAddSubAccount={true}
                  setStep={(n) => {
                    setStep(n);
                  }}
                />
              ) : step === 2 ? (
                <EditEmailAndPassword
                  _id={selectedEmployee?._id}
                  email={selectedEmployee?.email}
                  employeeId={selectedEmployee?.employeeId}
                  isSubAccount={true}
                  isAddSubAccount={true}
                  setStep={(n) => {
                    setStep(n);
                  }}
                />
              ) : (
                <h1 className=" text-custom-gradient db-title flex gap-3 items-center">
                  Sub Account Has Been Created.
                </h1>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
