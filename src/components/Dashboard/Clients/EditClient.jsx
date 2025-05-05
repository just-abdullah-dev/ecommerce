"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditEmailAndAbout from "./EditEmailAndAbout";
import { Separator } from "@/components/ui/separator";
import EditPersonalInfo from "../Employees/EditPersonalInfo";

export function EditClient({ obj, onClose }) {
  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader className=" w-full">
          <CardTitle className=" flex items-center justify-between">
            <h1 className="text-custom-gradient db-title"> Edit Client</h1>{" "}
            <Button onClick={onClose} className="w-fit " variant="destructive">
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <EditEmailAndAbout _id={obj?._id} email={obj?.email} />
          <Separator />
          <EditPersonalInfo personalInfo={obj?.personalInfo} />
        </CardContent>
      </Card>
    </>
  );
}
