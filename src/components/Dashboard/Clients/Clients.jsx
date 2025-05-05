import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllClients } from "./AllClients";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function Clients() {
  return (
    <MainDashboardContentSkeleton
      title="Clients"
    >
        <>
          <Link
            href={"/dashboard/clients/new"}
            className=" absolute top-4 right-0 md:right-4"
          >
            <Button>
              Add Client <Plus />
            </Button>
          </Link>
          <Link
            href={"/dashboard/clients/bulk-import"}
            className=" absolute top-4 right-28 md:right-48"
          >
            <Button>
              Bulk Import <Upload />
            </Button>
          </Link>
        </>
      <AllClients />
    </MainDashboardContentSkeleton>
  );
}
