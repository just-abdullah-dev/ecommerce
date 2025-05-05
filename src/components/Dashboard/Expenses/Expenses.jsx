import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllExpenses } from "./AllExpenses";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function Expenses() {
  return (
    <MainDashboardContentSkeleton title="Expenses">
      <Link
        href={"/dashboard/expenses/new"}
        className=" absolute top-4 right-4"
      >
        <Button>
          Add Expense <Plus />
        </Button>
      </Link>

      <Link
        href={"/dashboard/expenses/bulk-import"}
        className=" absolute top-4 right-40"
      >
        <Button>
          Bulk Import <Upload />
        </Button>
      </Link>
      <AllExpenses />
    </MainDashboardContentSkeleton>
  );
}
