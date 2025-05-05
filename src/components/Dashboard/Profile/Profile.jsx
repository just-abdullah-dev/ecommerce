"use client";

import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import useUser from "@/contexts/user";
import React, { useState } from "react";
import EditPersonalInfo from "../Employees/EditPersonalInfo";
import ChangePassword from "./ChangePassword";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function Profile() {
  const user = useUser();
  const [isChangePW, setIsChangePW] = useState(false);
  return (
    <MainDashboardContentSkeleton title="My Profile">
      <EditPersonalInfo forProfile personalInfo={user?.personalInfo} />
      {isChangePW ? (
        <ChangePassword onClose={() => setIsChangePW(false)} />
      ) : (
        <Button className="mt-6" onClick={() => setIsChangePW(true)}>
          Change Password <KeyRound />{" "}
        </Button>
      )}
    </MainDashboardContentSkeleton>
  );
}
