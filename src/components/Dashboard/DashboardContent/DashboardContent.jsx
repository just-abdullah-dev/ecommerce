"use client";
import React from "react";
import useUser from "@/contexts/user";

export default function DashboardContent() {
  const user = useUser();
  return (
   <div>
    main dashboard content page, 
    kist number of products, orders, stock, and sales
   </div>
  );
}
