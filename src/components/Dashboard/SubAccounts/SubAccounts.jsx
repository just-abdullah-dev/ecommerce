"use client";
import React, { useState } from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllSubAccounts } from "./AllSubAccounts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddSubAccount from "./AddSubAccount";
import { useCompany } from "@/contexts/company";
import Link from "next/link";

export default function SubAccounts() {
  const [createSubAccount, setCreateSubAccount] = useState(false);

  const [currentSubAccounts, setCurrentSubAccounts] = useState(0);
  const { company } = useCompany();
  const allowedSubAccounts = company?.subscriptionId?.screens;

  return (
    <MainDashboardContentSkeleton title="Sub Accounts">
      {currentSubAccounts >= allowedSubAccounts ? 
      (<Link href={'/dashboard/settings'}>
      <Button
        className=" absolute top-4 right-4"
      >
        Upgrade the Package
      </Button></Link>):
      (
        <Button
          variant={createSubAccount ? "destructive" : ""}
          onClick={() => {
            setCreateSubAccount(!createSubAccount);
          }}
          className=" absolute top-4 right-4"
        >
          {!createSubAccount ? `Add Sub-Account` : `Close`}
        </Button>
      )}
      {createSubAccount ? (
        <AddSubAccount />
      ) : (
        <AllSubAccounts
          setCurrentSubAccounts={(n) => {
            setCurrentSubAccounts(n);
          }}
          allowedSubAccounts={company?.subscriptionId?.screens}
        />
      )}
    </MainDashboardContentSkeleton>
  );
}
