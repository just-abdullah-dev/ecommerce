import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import AllInvoices from "@/components/Dashboard/Invoices/AllInvoices";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Invoices() {
  return (
    <MainDashboardContentSkeleton title="Invoices">
      <Link
        href={"/dashboard/invoices/new"}
        className=" absolute top-4 right-4"
      >
        <Button>
          Create a new invoice <Plus />
        </Button>
      </Link>
      <AllInvoices />
    </MainDashboardContentSkeleton>
  );
}
