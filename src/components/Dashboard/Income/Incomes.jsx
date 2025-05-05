import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllIncomes } from "./AllIncomes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function Incomes() {
  return (
    <MainDashboardContentSkeleton title="Incomes">
      <Link href={"/dashboard/incomes/new"} className=" absolute top-4 right-4">
        <Button>
          Add New Income <Plus />
        </Button>
      </Link>

      <Link
        href={"/dashboard/incomes/bulk-import"}
        className=" absolute top-4 right-52"
      >
        <Button>
          Bulk Import <Upload />
        </Button>
      </Link>
      <AllIncomes />
    </MainDashboardContentSkeleton>
  );
}
