"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
  startOfYear,
  endOfYear,
  subYears,
  endOfToday,
  differenceInMonths,
  addMonths,
} from "date-fns";
import { Check, ChevronDown, CalendarIcon } from "lucide-react";

import { cn, fetchCustom } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/contexts/user";
import { toast } from "@/hooks/use-toast";
import LoadingDots from "@/components/Utils/LoadingDots";
// const cashFlowData = [
//   {
//     month: "Jan",
//     incoming: 50000,
//     outgoing: 45000,
//     netCashFlow: 5000,
//     balance: 5000,
//   },
//   {
//     month: "Feb",
//     incoming: 15000,
//     outgoing: 5000,
//     netCashFlow: 10000,
//     balance: 15000,
//   },
//   {
//     month: "Mar",
//     incoming: 22000,
//     outgoing: 26000,
//     netCashFlow: -4000,
//     balance: 11000,
//   },
//   {
//     month: "Apr",
//     incoming: 11000,
//     outgoing: 2000,
//     netCashFlow: 9000,
//     balance: 20000,
//   },
//   {
//     month: "May",
//     incoming: 63000,
//     outgoing: 58000,
//     netCashFlow: 5000,
//     balance: 25000,
//   },
//   {
//     month: "Jun",
//     incoming: 2500,
//     outgoing: 19000,
//     netCashFlow: -16500,
//     balance: 8500,
//   },
//   {
//     month: "Jul",
//     incoming: 45000,
//     outgoing: 5000,
//     netCashFlow: 40000,
//     balance: 48500,
//   },
//   {
//     month: "Aug",
//     incoming: 14000,
//     outgoing: 32000,
//     netCashFlow: -18000,
//     balance: 30500,
//   },
//   {
//     month: "Sep",
//     incoming: 36000,
//     outgoing: 2500,
//     netCashFlow: 33500,
//     balance: 64000,
//   },
//   {
//     month: "Oct",
//     incoming: 9000,
//     outgoing: 18000,
//     netCashFlow: -9000,
//     balance: 55000,
//   },
//   {
//     month: "Nov",
//     incoming: 55000,
//     outgoing: 9000,
//     netCashFlow: 46000,
//     balance: 101000,
//   },
//   {
//     month: "Dec",
//     incoming: 6000,
//     outgoing: 49000,
//     netCashFlow: -43000,
//     balance: 58000,
//   },
// ];

export default function FinancialGraph() {
  const currency = useCurrency();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);
  // Toggle button states
  const [toggles, setToggles] = useState({
    incoming: true,
    outgoing: true,
    balance: true,
    showDots: true,
  });

  // Date range states
  const [selectedOption, setSelectedOption] = useState("this-year");
  const [cashFlowData, setCashFlowData] = useState(null);
  const [dateRange, setDateRange] = useState({
    fromDate: startOfYear(new Date()),
    toDate: endOfToday(),
  });
  const [customFromDate, setCustomFromDate] = useState(subYears(new Date(), 1));
  const [customToDate, setCustomToDate] = useState(new Date());
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Date range options
  const dateRangeOptions = [
    {
      label: "This Year",
      value: "this-year",
      getDateRange: () => {
        const fromDate = startOfYear(new Date());
        const toDate = endOfToday();
        return { fromDate, toDate };
      },
    },
    {
      label: "Last 2 Months",
      value: "last-2-months",
      getDateRange: () => {
        const fromDate = startOfMonth(subMonths(new Date(), 2));
        const toDate = endOfMonth(subMonths(new Date(), 1));
        return { fromDate, toDate };
      },
    },
    {
      label: "Last 3 Months",
      value: "last-quarter",
      getDateRange: () => {
        const lastQuarter = subQuarters(new Date(), 1);
        return {
          fromDate: startOfQuarter(lastQuarter),
          toDate: endOfQuarter(lastQuarter),
        };
      },
    },
    {
      label: "Last 6 Months",
      value: "last-6-months",
      getDateRange: () => {
        const fromDate = startOfMonth(subMonths(new Date(), 6));
        const toDate = endOfMonth(subMonths(new Date(), 1));
        return { fromDate, toDate };
      },
    },
    {
      label: "Last year",
      value: "last-year",
      getDateRange: () => {
        const lastYear = subYears(new Date(), 1);
        return {
          fromDate: startOfYear(lastYear),
          toDate: endOfYear(lastYear),
        };
      },
    },
    {
      label: "Custom range",
      value: "custom",
      getDateRange: () => ({
        fromDate: customFromDate,
        toDate: customToDate,
      }),
    },
  ];

  // Handle toggle changes
  const handleToggleChange = (toggleName) => {
    setToggles((prev) => ({
      ...prev,
      [toggleName]: !prev[toggleName],
    }));
  };

  // Handle date range option selection
  const handleDateRangeSelect = (option) => {
    setSelectedOption(option.value);

    if (option.value === "custom") {
      setIsCustomRange(true);
      setCalendarOpen(true);
    } else {
      setIsCustomRange(false);
      const newDateRange = option.getDateRange();
      setDateRange(newDateRange);
    }
  };

  // Apply custom date range
  const applyCustomDateRange = () => {
    if (customFromDate && customToDate) {
      setDateRange({
        fromDate: customFromDate,
        toDate: customToDate,
      });
      setCalendarOpen(false);
      fetchData();
    }
  };

  // API call effect when date range changes (except for custom range)
  useEffect(() => {
    if (!isCustomRange) {
      fetchData();
    }
  }, [dateRange, isCustomRange]);
  const fetchData = () => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetchCustom(
          `/reports/cashflow?fromDate=${format(
            dateRange.fromDate,
            "yyyy-MM-dd"
          )}&toDate=${format(dateRange.toDate, "yyyy-MM-dd")}`,
          {
            method: "GET",
            token: user?.token,
          }
        );
        const result = await response.json();
        setCashFlowData(result?.data);
        console.log(result?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
      // Simulating API call
      console.log("API call with date range:", {
        fromDate: format(dateRange.fromDate, "yyyy-MM-dd"),
        toDate: format(dateRange.toDate, "yyyy-MM-dd"),
      });
    })();
  };
  return (
    <div className="w-full md:p-4 space-y-4 relative">
      <Card className="bg-white">
        <CardHeader>
          Cash Flow Chart
          <div className="p-6 space-y-6 border rounded-lg shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  className="data-[state=checked]:bg-primary-navy data-[state=unchecked]:bg-gray-400"
                  id="incoming"
                  checked={toggles.incoming}
                  onCheckedChange={() => handleToggleChange("incoming")}
                />
                <Label htmlFor="incoming">Incoming</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  className="data-[state=checked]:bg-primary-navy data-[state=unchecked]:bg-gray-400"
                  id="outgoing"
                  checked={toggles.outgoing}
                  onCheckedChange={() => handleToggleChange("outgoing")}
                />
                <Label htmlFor="outgoing">Outgoing</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  className="data-[state=checked]:bg-primary-navy data-[state=unchecked]:bg-gray-400"
                  id="balance"
                  checked={toggles.balance}
                  onCheckedChange={() => handleToggleChange("balance")}
                />
                <Label htmlFor="balance">Balance</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  className="data-[state=checked]:bg-primary-navy data-[state=unchecked]:bg-gray-400"
                  id="showDots"
                  checked={toggles.showDots}
                  onCheckedChange={() => handleToggleChange("showDots")}
                />
                <Label htmlFor="showDots">Show Dots</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-[200px] justify-between"
                  >
                    {dateRangeOptions.find(
                      (option) => option.value === selectedOption
                    )?.label || "Select range"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {dateRangeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        selectedOption === option.value && "bg-muted"
                      )}
                      onClick={() => handleDateRangeSelect(option)}
                    >
                      {option.label}
                      {selectedOption === option.value && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {isCustomRange && (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto justify-between"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(customFromDate, "MMM dd, yyyy")} -{" "}
                      {format(customToDate, "MMM dd, yyyy")}
                    </Button>

                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="from-date">From Date</Label>
                        <input
                          type="date"
                          id="from-date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={format(customFromDate, "yyyy-MM-dd")}
                          onChange={(e) =>
                            setCustomFromDate(new Date(e.target.value))
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="to-date">To Date</Label>
                        <input
                          type="date"
                          id="to-date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={format(customToDate, "yyyy-MM-dd")}
                          onChange={(e) => {
                            const selectedToDate = new Date(e.target.value);

                            if (!customFromDate) {
                              setCustomToDate(selectedToDate);
                              return;
                            }

                            const monthDiff = differenceInMonths(
                              selectedToDate,
                              customFromDate
                            );

                            if (monthDiff > 12) {
                              const maxToDate = addMonths(customFromDate, 12);
                              setCustomToDate(maxToDate);
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: "Only 12 months allowed",
                              });
                            } else {
                              setCustomToDate(selectedToDate);
                            }
                          }}
                        />
                      </div>

                      <Button className="w-full" onClick={applyCustomDateRange}>
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="md:p-4">
          <div className="grid lg:grid-cols-[1fr_200px]">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {isLoading ? (
                  <LoadingDots />
                ) : (
                  <LineChart data={cashFlowData?.cashFlowData}>
                    <XAxis
                      dataKey="month"
                      axisLine={true}
                      tickLine={true}
                      tick={{ fontSize: 12, fill: "#666" }}
                    />
                    <YAxis
                      axisLine={true}
                      tickLine={true}
                      tick={{ fontSize: 12, fill: "#666" }}
                    />

                    {toggles.incoming && (
                      <Line
                        type="monotone"
                        dataKey="incoming"
                        stroke="#22C55E"
                        strokeWidth={1.5}
                        dot={toggles.showDots}
                      />
                    )}
                    {toggles.outgoing && (
                      <Line
                        type="monotone"
                        dataKey="outgoing"
                        stroke="#EF4444"
                        strokeWidth={1.5}
                        dot={toggles.showDots}
                      />
                    )}
                    {toggles.balance && (
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#000"
                        strokeWidth={2}
                        dot={toggles.showDots}
                      />
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {!isLoading && (
              <div className="pl-4 space-y-4">
                <div>
                  <div className="text-xs text-gray-500">
                    {/* Cash as on */}
                    {cashFlowData?.cashAsDate}
                  </div>
                  {/* <div className="font-semibold">
                  {currency?.symbol}&nbsp;0.00
                </div> */}
                </div>
                <div>
                  <div className="text-xs text-gray-500">Incoming</div>
                  <div className="font-semibold">
                    {currency?.symbol}&nbsp;
                    {cashFlowData?.totalIncoming.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Outgoing</div>
                  <div className="font-semibold">
                    {currency?.symbol}&nbsp;
                    {cashFlowData?.totalOutgoing.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
