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
import EditRole from "./EditRole";
import { Separator } from "@/components/ui/separator";
import EditEmailAndPassword from "../Employees/EditEmailAndPassword";

export function EditSubAccount({ employee, onClose, isSubAccount = false }) {
  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader className=" w-full">
          <CardTitle className=" flex items-center justify-between">
            <h1 className="text-custom-gradient db-title"> Edit Sub Account</h1>{" "}
            <Button onClick={onClose} className="w-fit " variant="destructive">
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <EditRole _id={employee?._id} role={employee?.role} 
             />
          <Separator />
          <EditEmailAndPassword
            _id={employee?._id}
            email={employee?.email}
            employeeId={employee?.employeeId}
            isSubAccount={isSubAccount}
          />
        </CardContent>
      </Card>
    </>
  );
}
