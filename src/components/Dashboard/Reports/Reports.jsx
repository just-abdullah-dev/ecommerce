"use client";
import React, { useState } from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

const reports = [
  {
    name: "Financial Reports",
    reports: [
      {
        name: "Profit and Loss",
        link: "/profit-and-loss",
      },
      {
        name: "Balance Sheet",
        link: "/balance-sheet",
      },
      {
        name: "Cash Flow",
        link: "/cash-flow",
      },
    ],
  },
  {
    name: "Accounts Receivable Reports",
    reports: [
      {
        name: "A/R Aging Summary",
        link: "/ar-aging-summary",
      },
      {
        name: "Open Invoices",
        link: "/open-invoices",
      },
    ],
  },
  {
    name: "Accounts Payable Reports",
    reports: [
      {
        name: "A/P Aging Summary",
        link: "/ap-aging-summary",
      },
      {
        name: "Unpaid Bills",
        link: "/unpaid-bills",
      },
    ],
  },
  {
    name: "Sales Reports",
    reports: [
      {
        name: "Sales by Customer Summary",
        link: "/sales-by-customer-summary",
      },
      {
        name: "Sales by Item Summary",
        link: "/sales-by-item-summary",
      },
    ],
  },
  {
    name: "Expense Reports",
    reports: [
      {
        name: "Expense by Vendor Summary",
        link: "/expense-by-vendor-summary",
      },
      {
        name: "Expense by Category Report",
        link: "/expense-by-category",
      },
    ],
  },
  {
    name: "Payroll Reports",
    reports: [
      {
        name: "Payroll Summary Report",
        link: "/payroll-summary",
      },
      {
        name: "Employee Earnings Report",
        link: "/employee-earnings",
      },
    ],
  },
  {
    name: "Asset Reports",
    reports: [
      {
        name: "Fixed Asset Listing",
        link: "/fixed-asset-listing",
      },
      {
        name: "Depreciation Schedule",
        link: "/depreciation-schedule",
      },
    ],
  },
  {
    name: "Tax Reports",
    reports: [
      {
        name: "Sales Tax Liability",
        link: "/sales-tax-liability",
      },
      {
        name: "Payroll Tax Liability",
        link: "/payroll-tax-liability",
      },
    ],
  },
  {
    name: "Performance Reports",
    reports: [
      {
        name: "Budget vs. Actual",
        link: "/budget-vs-actual",
      },
      {
        name: "Customizable Dashboards",
        link: "/customizable-dashboards",
      },
    ],
  },
];

export function Reports() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <MainDashboardContentSkeleton title="Reports">
      <div className=" grid">
        {reports.map((item, index) => {
          return (
            <div key={index}>
              <div
                className=" py-2 px-4 flex items-center gap-6 border-b border-black group cursor-pointer hover:bg-gray-300/50 duration-500 transition-all "
                onClick={() => {
                  if (item.name === selectedItem?.name) {
                    setSelectedItem(null);
                  } else {
                    setSelectedItem(item);
                  }
                }}
              >
                {selectedItem?.name === item?.name ? (
                  <ChevronDown size={22} />
                ) : (
                  <ChevronRight
                    size={22}
                    onClick={() => {
                      setSelectedItem(item);
                    }}
                  />
                )}
                <h1 className=" group-hover:underlin text-xl font-semibol">
                  {item?.name}
                </h1>
              </div>
              {selectedItem?.name === item?.name && (
                <div className=" grid md:grid-cols-3 px-12 py-4 gap-4">
                  {item?.reports.map((report, i) => {
                    return (
                      <Link
                        href={`/dashboard/reports${report.link}`}
                        key={i}
                        className=" p-4 rounded-lg bg-gradient grid place-items-center "
                      >
                        <FileText size={62} className=" my-4" />
                        <h2 className=" text-lg font-semibold ">
                          {report.name}
                        </h2>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MainDashboardContentSkeleton>
  );
}
