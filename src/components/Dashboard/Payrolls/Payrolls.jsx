"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PayrollRow from "./PayrollRow";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { addDays, format, subDays, subMonths, startOfYear } from "date-fns";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import { toast } from "@/hooks/use-toast";

export default function Payrolls() {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isOpenId, setIsOpenId] = useState("");
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/payroll/runs/all", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setPayrolls(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching run payrolls:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const filtered = payrolls.filter((payroll) => {
      let nameMatch = true;
      let idMatch = true;
      if (payroll?.employeeId) {
        nameMatch =
          payroll?.employeeId?.personalInfo?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payroll?.employeeId?.personalInfo?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payroll?.employeeId?.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        idMatch = payroll?.employeeId?.jobInfo?.employeeId
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }

      const statusMatch =
        statusFilter === "" || payroll?.status === statusFilter;
      const dateMatch =
        (fromDate === "" || new Date(payroll?.from) >= new Date(fromDate)) &&
        (toDate === "" || new Date(payroll?.to) <= new Date(toDate));

      return (nameMatch && statusMatch && dateMatch) || idMatch;
    });
    setFilteredPayrolls(filtered);
  }, [payrolls, searchTerm, statusFilter, fromDate, toDate]);

  if (isLoading) {
    return <LoadingDots />;
  }

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setStatusFilter("");
    setSearchTerm("");
  };

  const handleThisMonth = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };
  const handleLastMonth = () => {
    const end = new Date();
    const start = subMonths(end, 1);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };
  const handleLast3Months = () => {
    const end = new Date();
    const start = subMonths(end, 3);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };

  const handleLast6Months = () => {
    const end = new Date();
    const start = subMonths(end, 6);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom(`/payroll/runs?payrollRunsId=${id}`, {
        method: "DELETE",
        token: user?.token,
      });
      const data = await response.json();
      if (data.success) {
        fetchItems();
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error deleting run payroll:", error);
    }
  };

  return (
    <MainDashboardContentSkeleton title="Payroll Runs">
      <Link
        href={"/dashboard/payrolls/new"}
        className=" absolute top-4 right-4"
      >
        <Button>
          Run a Payroll <Plus />
        </Button>
      </Link>
      {isError ? (
        <ShowError error={isError} />
      ) : (
        <div>
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full overflow-hidden">
            <input
              type="text"
              placeholder="Search by employee name, emp id or email"
              className="border p-2 rounded w-full col-span-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Unpaid</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <Button
              size="lg"
              disabled={!fromDate && !toDate && !searchTerm && !statusFilter}
              variant="destructive"
              onClick={handleClearFilter}
            >
              Clear Filters
            </Button>
            <Button className="" variant="secondary" onClick={handleThisMonth}>
              This month
            </Button>
            <Button variant="secondary" onClick={handleLastMonth}>
              Last Month
            </Button>
            <Button variant="secondary" onClick={handleLast3Months}>
              Last 3 Months
            </Button>
            <Button variant="secondary" onClick={handleLast6Months}>
              Last 6 Months
            </Button>
          </div>
          <table className="w-full font-normal text-base overflow-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Salary Type</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Total Amount</th>
                <th className="p-2 text-left">From Date</th>
                <th className="p-2 text-left">To Date</th>
                <th className="p-2 text-left">Run By</th>
                <th className="p-2 text-left">Preview</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayrolls.map((payroll) => (
                <PayrollRow
                  handleDelete={handleDelete}
                  key={payroll?._id}
                  payroll={payroll}
                  isOpen={isOpenId === payroll?._id}
                  toggleOpen={() => {
                    if (isOpenId === payroll?._id) {
                      setIsOpenId("");
                    } else {
                      setIsOpenId(payroll?._id);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainDashboardContentSkeleton>
  );
}
