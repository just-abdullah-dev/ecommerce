import CompanyDetails from "@/components/Dashboard/Company/Company";
import { SubscriptionDetails } from "@/components/Dashboard/Company/SubscriptionDetails";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import React from "react";

export default function page() {
  return (
    <>
      <MainDashboardContentSkeleton title="Settings">
        <CompanyDetails />
        <br />
        <SubscriptionDetails />
      </MainDashboardContentSkeleton>
    </>
  );
}
