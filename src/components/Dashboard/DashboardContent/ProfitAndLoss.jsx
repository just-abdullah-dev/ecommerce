"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Import React and Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useCurrency from "@/hooks/useCurrency";
import { useEffect, useState } from "react";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import LoadingDots from "@/components/Utils/LoadingDots";
import ExpensesChart from "./ExpensesChart";
import IncomesChart from "./IncomesChart";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// export default function Financial() {
//   const currency = useCurrency();
//   const [selectedPeriod, setSelectedPeriod] = useState("lastYear");

//   const user = useUser();
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   useEffect(() => {
//     handleChange("thisMonth");
//   }, []);

//   const fetchData = async (fromDate, toDate) => {
//     setIsLoading(true);
//     try {
//       const response = await fetchCustom(
//         `/reports/profit-loss?fromDate=${fromDate}&toDate=${toDate}`,
//         {
//           method: "GET",
//           token: user?.token,
//         },
//       );
//       const result = await response.json();
//       setData(result?.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getDateRange = (period) => {
//     const currentDate = new Date();
//     let fromDate, toDate;

//     switch (period) {
//       case "thisMonth":
//         fromDate = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth(),
//           1,
//         ); // First day of the current month
//         toDate = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth() + 1,
//           0,
//         ); // Last day of the current month
//         break;
//       case "lastMonth":
//         fromDate = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth() - 1,
//           1,
//         );
//         toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
//         break;

//       // case "lastQuarter":
//       //   const currentQuarter = Math.floor((currentDate.getMonth() + 3) / 3);
//       //   const lastQuarterEndMonth = currentQuarter * 3 - 3;
//       //   fromDate = new Date(
//       //     currentDate.getFullYear(),
//       //     lastQuarterEndMonth - 3,
//       //     1,
//       //   );
//       //   toDate = new Date(currentDate.getFullYear(), lastQuarterEndMonth, 0); // Last day of the last quarter
//       //   break;

//       case "lastQuarter":
//         const currentQuarter = Math.floor((currentDate.getMonth() + 3) / 3);
//         const lastQuarterEndMonth = (currentQuarter - 1) * 3; // Last month of the previous quarter
//         fromDate = new Date(currentDate.getFullYear(), lastQuarterEndMonth - 2, 1); // First day of the last quarter
//         toDate = new Date(currentDate.getFullYear(), lastQuarterEndMonth + 1, 0); // Last day of the last quarter
//         break;

//       case "lastYear":
//         fromDate = new Date(currentDate.getFullYear() - 1, 0, 1);
//         toDate = new Date(currentDate.getFullYear() - 1, 11, 31); // Entire last year
//         break;

//       default:
//         throw new Error("Invalid period");
//     }

//     fromDate.setDate(fromDate.getDate() + 1);
//     toDate.setDate(toDate.getDate() + 1);

//     return {
//       fromDate: fromDate.toISOString().split("T")[0],
//       toDate: toDate.toISOString().split("T")[0],
//     };
//   };

//   const handleChange = (value) => {
//     setSelectedPeriod(value);
//     const { fromDate, toDate } = getDateRange(value);

//     fetchData(fromDate, toDate);
//   };
//   const getPeriodName = () => {
//     const currentDate = new Date();

//     switch (selectedPeriod) {
//       case "thisMonth": {
//         const thisMonth = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth(),
//           1,
//         );
//         return thisMonth.toLocaleString("default", { month: "long" }); // Returns full month name
//       }
//       case "lastMonth": {
//         const lastMonth = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth() - 1,
//           1,
//         );
//         return lastMonth.toLocaleString("default", { month: "long" }); // Returns full month name
//       }
//       case "lastQuarter": {
//         const currentQuarter = Math.floor((currentDate.getMonth() + 3) / 3);
//         const quarterStartMonthIndex = (currentQuarter - 2) * 3;
//         const months = Array.from({ length: 3 }, (_, i) =>
//           new Date(
//             currentDate.getFullYear(),
//             quarterStartMonthIndex + i,
//             1,
//           ).toLocaleString("default", { month: "long" }),
//         );
//         return months.join(", "); // Returns last 3 months names
//       }
//       case "lastYear": {
//         return (currentDate.getFullYear() - 1).toString(); // Returns last year
//       }
//       default: {
//         throw new Error("Invalid period");
//       }
//     }
//   };

//   return (
//     <div className="grid gap-4 md:grid-cols-3 p-4">
//       {/* Profit & Loss Card */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-base font-medium">Profit & Loss</CardTitle>
//           <Select defaultValue="thisMonth" onValueChange={handleChange}>
//             <SelectTrigger className="w-[130px] h-8">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="thisMonth">This month</SelectItem>
//               <SelectItem value="lastMonth">Last month</SelectItem>
//               <SelectItem value="lastQuarter">Last quarter</SelectItem>
//               <SelectItem value="lastYear">Last year</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <LoadingDots />
//           ) : (
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">
//                   Net {data?.net >= 0 ? "profit" : "loss"} for {getPeriodName()}
//                 </p>
//                 <div className="flex items-center">
//                   <span
//                     className={`text-2xl font-bold ${data?.net >= 0 ? "text-green-500" : "text-red-500"
//                       }`}
//                   >
//                     {currency?.symbol}&nbsp;
//                     {data?.net}
//                   </span>
//                   {/* <span className="ml-2 text-sm text-red-500">73%</span> */}
//                 </div>
//                 <div className="flex items-center text-sm">
//                   {/* <span className="text-orange-500">Down 146%</span> */}
//                   {/* <span className="ml-1 text-muted-foreground">
//                     from prior month
//                   </span> */}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Income</span>
//                   <span className="flex items-center">
//                     {currency?.symbol}&nbsp;{data?.totalIncome}
//                     <ChevronRight className="h-4 w-4 ml-1" />
//                     {/* <span className="text-muted-foreground">8 to review</span> */}
//                   </span>
//                 </div>
//                 <Progress
//                   value={100}
//                   className="h-2 bg-muted"
//                   indicatorClassName="bg-primary-teal"
//                 />

//                 <div className="flex  justify-between text-sm">
//                   <span>Expenses</span>
//                   <span className="flex items-center">
//                     {currency?.symbol}&nbsp;{data?.totalExpenses}
//                     <ChevronRight className="h-4 w-4 ml-1" />
//                     {/* <span className="text-muted-foreground">18 to review</span> */}
//                   </span>
//                 </div>
//                 <Progress
//                   value={100}
//                   className="h-2 bg-muted"
//                   indicatorClassName="bg-primary-navy"
//                 />
//               </div>

//               {/* <div className="text-sm text-muted-foreground">
//                 Categorize 24 transactions
//               </div> */}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Profit Card */}
//       <IncomesChart />
//       {/* Expenses Card */}
//       <ExpensesChart />
//     </div>
//   );
// }

// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ChevronRight } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import { useEffect, useState, useCallback } from "react";
// import useCurrency from "@/hooks/useCurrency";
// import useUser from "@/contexts/user";
// import { fetchCustom } from "@/lib/utils";
// import LoadingDots from "@/components/Utils/LoadingDots";
// import ExpensesChart from "./ExpensesChart";
// import IncomesChart from "./IncomesChart";

export default function ProfitAndLoss() {
  const currency = useCurrency();
  const user = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState("lastYear");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (fromDate, toDate) => {
    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/profit-loss?fromDate=${fromDate}&toDate=${toDate}`,
        {
          method: "GET",
          token: user?.token,
        }
      );
      const result = await response.json();
      setData(result?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = (period) => {
    const currentDate = new Date();
    let fromDate, toDate;

    switch (period) {
      case "thisMonth":
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case "lastMonth":
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        break;
      case "lastQuarter":
        const currentQuarter = Math.floor((currentDate.getMonth() + 2) / 3);
        let lastQuarterYear = currentDate.getFullYear();
        let lastQuarterEndMonth = (currentQuarter - 1) * 3;
        if (currentQuarter === 1) {
          lastQuarterYear -= 1;
          lastQuarterEndMonth = 12;
        }
        fromDate = new Date(lastQuarterYear, lastQuarterEndMonth - 2, 1);
        toDate = new Date(lastQuarterYear, lastQuarterEndMonth + 1, 0);
        break;
      case "lastYear":
        fromDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        toDate = new Date(currentDate.getFullYear() - 1, 11, 31);
        break;
      default:
        throw new Error("Invalid period");
    }

    return { fromDate: fromDate.toISOString().split("T")[0], toDate: toDate.toISOString().split("T")[0] };
  };

  useEffect(() => {
    const initialFetch = async () => {
      const { fromDate, toDate } = getDateRange("thisMonth");
      await fetchData(fromDate, toDate);
    };
    initialFetch();
  }, []);

  const handleChange = (value) => {
    setSelectedPeriod(value);
    const { fromDate, toDate } = getDateRange(value);

    fetchData(fromDate, toDate);
  };
  const getPeriodName = () => {
    const currentDate = new Date();

    switch (selectedPeriod) {
      case "thisMonth": {
        const thisMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        return thisMonth.toLocaleString("default", { month: "long" }); // Returns full month name
      }
      case "lastMonth": {
        const lastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1,
        );
        return lastMonth.toLocaleString("default", { month: "long" }); // Returns full month name
      }
      case "lastQuarter": {
        const currentQuarter = Math.floor((currentDate.getMonth() + 3) / 3);
        const quarterStartMonthIndex = (currentQuarter - 2) * 3;
        const months = Array.from({ length: 3 }, (_, i) =>
          new Date(
            currentDate.getFullYear(),
            quarterStartMonthIndex + i,
            1,
          ).toLocaleString("default", { month: "long" }),
        );
        return months.join(", "); // Returns last 3 months names
      }
      case "lastYear": {
        return (currentDate.getFullYear() - 1).toString(); // Returns last year
      }
      default: {
        throw new Error("Invalid period");
      }
    }
  };

  return (
      <Card className="w-[90vw] md:w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Profit & Loss</CardTitle>
          <Select defaultValue="thisMonth" onValueChange={handleChange}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="lastQuarter">Last quarter</SelectItem>
              <SelectItem value="lastYear">Last year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Net {data?.net >= 0 ? "profit" : "loss"} for {getPeriodName()}
                </p>
                <div className="flex items-center">
                  <span
                    className={`text-2xl font-bold ${data?.net >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {currency?.symbol}&nbsp;
                    {data?.net}
                  </span>
                  {/* <span className="ml-2 text-sm text-red-500">73%</span> */}
                </div>
                <div className="flex items-center text-sm">
                  {/* <span className="text-orange-500">Down 146%</span> */}
                  {/* <span className="ml-1 text-muted-foreground">
                    from prior month
                  </span> */}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Income</span>
                  <span className="flex items-center">
                    {currency?.symbol}&nbsp;{data?.totalIncome}
                    <ChevronRight className="h-4 w-4 ml-1" />
                    {/* <span className="text-muted-foreground">8 to review</span> */}
                  </span>
                </div>
                <Progress
                  value={100}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-primary-teal"
                />

                <div className="flex  justify-between text-sm">
                  <span>Expenses</span>
                  <span className="flex items-center">
                    {currency?.symbol}&nbsp;{data?.totalExpenses}
                    <ChevronRight className="h-4 w-4 ml-1" />
                    {/* <span className="text-muted-foreground">18 to review</span> */}
                  </span>
                </div>
                <Progress
                  value={100}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-primary-navy"
                />
              </div>

              {/* <div className="text-sm text-muted-foreground">
                Categorize 24 transactions
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>
  );
}