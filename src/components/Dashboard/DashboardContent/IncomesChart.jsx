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

import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncomesChart() {
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
        `/reports/income?fromDate=${fromDate}&toDate=${toDate}`,
        {
          method: "GET",
          token: user?.token,
        },
      );
      const result = await response.json();
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
      default: {
        throw new Error("Invalid period");
      }
    }
  };

  // Donut chart data
  const expensesData = {
    labels: ["Invoices", "Others"],
    datasets: [
      {
        data: [30, 25],
        backgroundColor: ["rgb(13, 148, 136)", "rgb(15, 118, 110)"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "80%",
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  return (
    <Card className="w-[90vw] md:w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 w-[350px] md:w-full ">
        <CardTitle className="text-base font-medium">Incomes</CardTitle>
        <br/>
        <Select defaultValue="thisMonth" onValueChange={handleChange}>
          <SelectTrigger className="md:w-[130px] h-8">
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
                Income for {getPeriodName()}
              </p>
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  {currency?.symbol}&nbsp;{data?.totalIncome}
                </span>
                {/* <span className="ml-2 text-sm text-emerald-500">67%</span> */}
              </div>
              {/* <div className="flex items-center text-sm">
                <span className="text-emerald-500">Down 56%</span>
                <span className="ml-1 text-muted-foreground">
                  from prior 30 days
                </span>
              </div> */}
            </div>

            <div className="relative aspect-square">
              <Doughnut
                data={data ? data?.chartData : expensesData}
                options={chartOptions}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
