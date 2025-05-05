import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllEmployees } from "./AllEmployees";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function Employees() {
  return (
    <MainDashboardContentSkeleton title="Employees">
      <Link
        href={"/dashboard/employees/new"}
        className=" absolute top-4 right-4"
      >
        <Button>
          Add New Employee <Plus />
        </Button>
      </Link>
      <Link
        href={"/dashboard/employees/bulk-import"}
        className=" absolute top-4 right-56"
      >
        <Button>
          Bulk Import <Upload />
        </Button>
      </Link>
      <AllEmployees />
    </MainDashboardContentSkeleton>
  );
}
