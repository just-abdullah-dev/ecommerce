"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Trash2 } from "lucide-react";
import EditExpense from "./EditExpense";
import { fetchCustom, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/contexts/user";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";

export function AllExpenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [addedFromDate, setAddedFromDate] = useState("");
  const [addedToDate, setAddedToDate] = useState("");
  const [isEdit, setIsEdit] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const currency = useCurrency();
  const [expenses, setExpenses] = useState([]);
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/company/expense", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setExpenses(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const newFilteredItems = expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.type.toLowerCase().includes(searchTerm.toLowerCase());

      const expenseDate = new Date(expense.date);
      const createdDate = new Date(expense.createdAt);

      const matchesDateRange =
        (!fromDate || expenseDate >= new Date(fromDate)) &&
        (!toDate || expenseDate <= new Date(toDate));

      const matchesAddedDateRange =
        (!addedFromDate || createdDate >= new Date(addedFromDate)) &&
        (!addedToDate || createdDate <= new Date(addedToDate));

      return matchesSearch && matchesDateRange && matchesAddedDateRange;
    });

    setFilteredItems(newFilteredItems);
  }, [searchTerm, fromDate, toDate, addedFromDate, addedToDate, expenses]);

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }

  if (isEdit !== null) {
    return (
      <EditExpense
        expense={isEdit}
        onClose={() => {
          setIsEdit(null);
          fetchItems();
        }}
      />
    );
  }
  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom("/company/expense", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ expenseId: id }),
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
      console.error("Error deleting expense:", error);
    }
  };
  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setAddedFromDate("");
    setAddedToDate("");
    setSearchTerm("");
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className=" py-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className=" col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              From Date
            </label>
            <Input
              id="search"
              placeholder="Search by title, description, or type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 col-span-2 gap-4">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-sm font-medium text-gray-700"
              >
                From Date
              </label>
              <Input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-sm font-medium text-gray-700"
              >
                To Date
              </label>
              <Input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 col-span-2 gap-4">
            <div>
              <label
                htmlFor="addedFromDate"
                className="block text-sm font-medium text-gray-700"
              >
                Added From Date
              </label>
              <Input
                type="date"
                id="addedFromDate"
                value={addedFromDate}
                onChange={(e) => setAddedFromDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="addedToDate"
                className="block text-sm font-medium text-gray-700"
              >
                Added To Date
              </label>
              <Input
                type="date"
                id="addedToDate"
                value={addedToDate}
                onChange={(e) => setAddedToDate(e.target.value)}
              />
            </div>
          </div>
          <Button
            className=" w-full col-span-1 mt-3"
            size="lg"
            disabled={!fromDate && !toDate && !searchTerm}
            variant="destructive"
            onClick={handleClearFilter}
          >
            Clear Filters
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.desc}</TableCell>
                <TableCell className=" font-semibold text-xs">
                  {expense.type.toUpperCase()}
                  <br />
                  {expense?.type === "payroll" &&
                    expense?.payrollRunsId === undefined &&
                    `(From Bulk Import)`}
                </TableCell>
                <TableCell>
                  {currency?.symbol}&nbsp;{expense.totalAmount.toFixed(2)}
                </TableCell>

                <TableCell>
                  {expense.from ? formatDate(expense.from) : "N/A"}
                </TableCell>
                <TableCell>
                  {expense.to ? formatDate(expense.to) : "N/A"}
                </TableCell>
                <TableCell>{`${expense.addedBy.personalInfo.title} ${expense.addedBy.personalInfo.firstName}`}</TableCell>
                <TableCell>{formatDate(expense.createdAt)}</TableCell>
                <TableCell className=" flex items-center gap-4">
                  <Button
                    title={
                      expense?.type === "payroll" &&
                      expense?.payrollRunsId !== undefined
                        ? "Update respective payroll run from Payroll Runs."
                        : "Edit Expense"
                    }
                    disabled={
                      expense?.type === "payroll" &&
                      expense?.payrollRunsId !== undefined
                    }
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEdit(expense)}
                  >
                    <Edit3 size={20} />
                  </Button>
                  <ConfirmationDialog
                    trigger={
                      <Button
                        title={
                          expense?.type === "payroll" &&
                          expense?.payrollRunsId !== undefined
                            ? "Delete respective payroll run from Payroll Runs."
                            : "Delete Expense"
                        }
                        disabled={
                          expense?.type === "payroll" &&
                          expense?.payrollRunsId !== undefined
                        }
                        variant="outline"
                        size="icon"
                      >
                        <Trash2 className="h-8 w-8 text-red-600" />
                      </Button>
                    }
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete."
                    onConfirm={() => handleDelete(expense?._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
