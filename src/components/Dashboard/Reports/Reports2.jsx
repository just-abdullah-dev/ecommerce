"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfitAndLossStatement } from "./Types2/ProfitAndLossStatement";
import { BalanceSheet } from "./Types2/BalanceSheet";
import { CashFlowStatement } from "./Types2/CashFlowStatement";
import { ARAgingSummary } from "./Types2/ARAgingSummary";
import { OpenInvoices } from "./Types2/OpenInvoices";
import { APAgingSummary } from "./Types2/APAgingSummary";
import { UnpaidBills } from "./Types2/UnpaidBills";
import { SalesByCustomerSummary } from "./Types2/SalesByCustomerSummary";
import { SalesByItemSummary } from "./Types2/SalesByItemSummary";
import { ExpenseByVendorSummary } from "./Types2/ExpenseByVendorSummary";
import { ExpenseByCategoryReport } from "./Types2/ExpenseByCategoryReport";
import { PayrollSummaryReport } from "./Types2/PayrollSummaryReport";
import { EmployeeEarningsReport } from "./Types2/EmployeeEarningsReport";
import { FixedAssetListing } from "./Types2/FixedAssetListing";
import { DepreciationSchedule } from "./Types2/DepreciationSchedule";
import { SalesTaxLiabilityReport } from "./Types2/SalesTaxLiabilityReport";
import { PayrollTaxLiabilityReport } from "./Types2/PayrollTaxLiabilityReport";
import { BudgetVsActualReport } from "./Types2/BudgetVsActualReport";
import { CustomizableDashboards } from "./Types2/CustomizableDashboards";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

const reportCategories = [
  {
    name: "Financial Reports",
    reports: [
      "Profit and Loss Statement",
      "Balance Sheet",
      "Cash Flow Statement",
    ],
  },
  {
    name: "Accounts Receivable Reports",
    reports: ["A/R Aging Summary", "Open Invoices"],
  },
  {
    name: "Accounts Payable Reports",
    reports: ["A/P Aging Summary", "Unpaid Bills"],
  },
  {
    name: "Sales Reports",
    reports: ["Sales by Customer Summary", "Sales by Item Summary"],
  },
  {
    name: "Expense Reports",
    reports: ["Expense by Vendor Summary", "Expense by Category Report"],
  },
  {
    name: "Payroll Reports",
    reports: ["Payroll Summary Report", "Employee Earnings Report"],
  },
  {
    name: "Asset Reports",
    reports: ["Fixed Asset Listing", "Depreciation Schedule"],
  },
  {
    name: "Tax Reports",
    reports: ["Sales Tax Liability Report", "Payroll Tax Liability Report"],
  },
  {
    name: "Performance Reports",
    reports: ["Budget vs. Actual Report", "Customizable Dashboards"],
  },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportCategory, setReportCategory] = useState("Financial Reports");

  const renderReport = () => {
    switch (selectedReport) {
      case "Profit and Loss Statement":
        return <ProfitAndLossStatement />;
      case "Balance Sheet":
        return <BalanceSheet />;
      case "Cash Flow Statement":
        return <CashFlowStatement />;
      case "A/R Aging Summary":
        return <ARAgingSummary />;
      case "Open Invoices":
        return <OpenInvoices />;
      case "A/P Aging Summary":
        return <APAgingSummary />;
      case "Unpaid Bills":
        return <UnpaidBills />;
      case "Sales by Customer Summary":
        return <SalesByCustomerSummary />;
      case "Sales by Item Summary":
        return <SalesByItemSummary />;
      case "Expense by Vendor Summary":
        return <ExpenseByVendorSummary />;
      case "Expense by Category Report":
        return <ExpenseByCategoryReport />;
      case "Payroll Summary Report":
        return <PayrollSummaryReport />;
      case "Employee Earnings Report":
        return <EmployeeEarningsReport />;
      case "Fixed Asset Listing":
        return <FixedAssetListing />;
      case "Depreciation Schedule":
        return <DepreciationSchedule />;
      case "Sales Tax Liability Report":
        return <SalesTaxLiabilityReport />;
      case "Payroll Tax Liability Report":
        return <PayrollTaxLiabilityReport />;
      case "Budget vs. Actual Report":
        return <BudgetVsActualReport />;
      case "Customizable Dashboards":
        return <CustomizableDashboards />;
      default:
        return null;
    }
  };

  return (
    <MainDashboardContentSkeleton title="Reports">
      <Tabs defaultValue={reportCategories[0].name} className="w-full">
        <TabsList className="mb-4 flex flex-wrap items-start justify-start h-fit gap-4">
          {reportCategories.map((category) => (
            <Button>
              <TabsTrigger
                onClick={() => {
                  setReportCategory(category.name);
                  setSelectedReport("");
                }}
                key={category.name}
                value={category.name}
              >
                {category.name}
              </TabsTrigger>
            </Button>
          ))}
        </TabsList>
        <h1 className=" text-custom-gradient db-title">{reportCategory}</h1>
        {reportCategories.map((category) => (
          <TabsContent key={category.name} value={category.name}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.reports.map((report) => (
                <Button
                  key={report}
                  className=" shadow-lg"
                  onClick={() => setSelectedReport(report)}
                  variant={selectedReport === report ? "default" : "outline"}
                >
                  {report}
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
        <ScrollArea className=" mt-6 border rounded-md">
          {renderReport()}
        </ScrollArea>
      </Tabs>
    </MainDashboardContentSkeleton>
  );
}
