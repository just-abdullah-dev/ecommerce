import React from "react";
import { Card } from "../ui/card";

const MainDashboardContentSkeleton = ({
  title = "title goes here",
  children,
  btns
}) => {
  return (
    <Card className=" p-4 relative">
      <div className=" ">
        <h1 className=" text-custom-gradient db-title">{title}</h1>
   
      </div>
      <div className="relative">
        <div className=" rounded-lg pb-6 pt-16">{children}</div>
      </div>
    </Card>
  );
};

export default MainDashboardContentSkeleton;
