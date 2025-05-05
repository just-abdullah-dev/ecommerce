import React from "react";
import ReportsTypes from "@/components/Dashboard/Reports/ReportsTypes";

export default async function page({ params }) {
  const link = (await params).link;
  return <ReportsTypes link={link} />;
}
