import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllAssets } from "./AllAssets";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function Assets() {
  return (
    <MainDashboardContentSkeleton title="Assets">
      <Link href={"/dashboard/assets/new"} className=" absolute top-4 right-4">
        <Button>
          Add New Asset <Plus />
        </Button>
      </Link>

      <Link
        href={"/dashboard/assets/bulk-import"}
        className=" absolute top-4 right-48"
      >
        <Button>
          Bulk Import <Upload />
        </Button>
      </Link>
      <AllAssets />
    </MainDashboardContentSkeleton>
  );
}
