import LoadingDots from "@/components/Utils/LoadingDots";

import useCurrency from "@/hooks/useCurrency";
import { useEffect, useState } from "react";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicesFigures() {
  const currency = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState("lastYear");

  const user = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    handleChange("thisMonth");
  }, []);

  const fetchData = async (fromDate, toDate) => {
    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/invoices?fromDate=${fromDate}&toDate=${toDate}`,
        {
          method: "GET",
          token: user?.token,
        },
      );
      const result = await response.json();
      console.log(result);

      setData(result?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getDateRange(selectedRange) {
    const today = new Date();
    let fromDate, toDate;

    switch (selectedRange) {
      case "thisMonth":
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "lastQuarter":
        // const quarterMonth = Math.floor(today.getMonth() / 3) * 3 - 3;
        // fromDate = new Date(today.getFullYear(), quarterMonth, 1);
        // toDate = new Date(today.getFullYear(), quarterMonth + 3, 0);
        // break;
        const currentQuarter = Math.floor((today.getMonth() + 2) / 3);
        let lastQuarterYear = today.getFullYear();
        let lastQuarterEndMonth = (currentQuarter - 1) * 3;
        if (currentQuarter === 1) {
          lastQuarterYear -= 1;
          lastQuarterEndMonth = 12;
        }
        fromDate = new Date(lastQuarterYear, lastQuarterEndMonth - 2, 1);
        toDate = new Date(lastQuarterYear, lastQuarterEndMonth + 1, 0);
        break;
      case "lastYear":
        fromDate = new Date(today.getFullYear() - 1, 0, 1);
        toDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "listAll":
        return {
          fromDate: "",
          toDate: "",
        };
      default:
        throw new Error("Invalid date range selected");
    }

    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 1);

    return {
      fromDate: fromDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      toDate: toDate.toISOString().split("T")[0],
    };
  }

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
      case "listAll": {
        return "All Time"; // Returns last year
      }
      default: {
        throw new Error("Invalid period");
      }
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
        {!isLoading ? (
          <CardTitle className="text-xl font-semibold text-gray-800">
            Total Invoices ({data?.totalInvoices})
          </CardTitle>
        ) : (
          <div />
        )}
        <Select defaultValue="thisMonth" onValueChange={handleChange}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="lastMonth">Last month</SelectItem>
            <SelectItem value="lastQuarter">Last quarter</SelectItem>
            <SelectItem value="lastYear">Last year</SelectItem>
            <SelectItem value="listAll">All</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className=" w-full bg-gray-300 h-40 rounded-xl animate-pulse"></div>
        ) : (
          <div className="space-y-4 px-3">
            <div className="text-lg font-semibold text-gray-800">
              Total Amount {currency?.symbol}&nbsp;{data?.totalAmount}
              <div className=" text-gray-500 text-base font-normal">
                Invoices of {getPeriodName()}
              </div>
              <div className="text-base font-semibold text-gray-800">
              Total Unpaid Amount {currency?.symbol}&nbsp;{data?.currentAmount+data?.overDueAmount}</div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Pending ({data?.currentInvoices})
                </div>
                <div className="text-xl font-semibold">
                  {currency?.symbol}&nbsp;{data?.currentAmount}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Overdue ({data?.overDueInvoices})
                </div>
                <div className="text-xl font-semibold text-amber-500">
                  {currency?.symbol}&nbsp;{data?.overDueAmount}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Paid ({data?.paidInvoices})
                </div>
                <div className="text-xl font-semibold text-green-500">
                  {currency?.symbol}&nbsp;{data?.paidAmount}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
