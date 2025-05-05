import Link from "next/link";
import React from "react";
import BalanceSheet from "./Types/BalanceSheet";
import { CashFlowStatement } from "./Types2/CashFlowStatement";
import ARAgingSummary from "./Types/ARAgingSummary";
import OpenInvoices from "./Types/OpenInvoices";
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
import ProfitLossStatement from "./Types/ProfitAndLossStatement";

export default function ReportsTypes({ link }) {
  switch (link) {
    case "profit-and-loss":
      return <ProfitLossStatement />;
    case "balance-sheet":
      return <BalanceSheet />;
    case "cash-flow":
      return <CashFlowStatement />;
    case "ar-aging-summary":
      return <ARAgingSummary />;
    case "open-invoices":
      return <OpenInvoices />;
    case "ap-aging-summary":
      return <APAgingSummary />;
    case "unpaid-bills":
      return <UnpaidBills />;
    case "sales-by-customer-summary":
      return <SalesByCustomerSummary />;
    case "sales-by-item-summary":
      return <SalesByItemSummary />;
    case "expense-by-vendor-summary":
      return <ExpenseByVendorSummary />;
    case "expense-by-category":
      return <ExpenseByCategoryReport />;
    case "payroll-summary":
      return <PayrollSummaryReport />;
    case "employee-earnings":
      return <EmployeeEarningsReport />;
    case "fixed-asset-listing":
      return <FixedAssetListing />;
    case "depreciation-schedule":
      return <DepreciationSchedule />;
    case "sales-tax-liability":
      return <SalesTaxLiabilityReport />;
    case "payroll-tax-liability":
      return <PayrollTaxLiabilityReport />;
    case "budget-vs-actual":
      return <BudgetVsActualReport />;
    case "customizable-dashboards":
      return <CustomizableDashboards />;
    default:
      return (
        <div className=" grid place-items-center p-12">
          Report Type not found
          <Link href={"/dashboard/reports"}>Go to Reports</Link>
        </div>
      );
  }
}
