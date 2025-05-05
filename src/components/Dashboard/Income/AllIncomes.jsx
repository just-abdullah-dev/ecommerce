"use client";

import React, { useState, useEffect } from "react";
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
import EditIncome from "./EditIncome";
import { fetchCustom, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/contexts/user";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";

export function AllIncomes() {
  const currency = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isEdit, setIsEdit] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/income", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setIncomes(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const newFilteredItems = incomes.filter((income) => {
      const matchesSearch = income?.notes
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const incomeDate = new Date(income.date);

      const matchesDateRange =
        (!fromDate || incomeDate >= new Date(fromDate)) &&
        (!toDate || incomeDate <= new Date(toDate));

      return matchesSearch && matchesDateRange;
    });
    setFilteredItems(newFilteredItems);
  }, [searchTerm, fromDate, toDate, incomes]);

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }

  if (isEdit !== null) {
    return (
      <EditIncome
        income={isEdit}
        onClose={() => {
          setIsEdit(null);
          fetchItems();
        }}
      />
    );
  }
  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom("/income", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ incomeId: id }),
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
      console.error("Error deleting income:", error);
    }
  };
  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
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
              .
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
              <TableHead>Notes</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Invoice # / Added By</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item?._id}>
                <TableCell>{item?.notes}</TableCell>
                <TableCell className=" font-semibold text-xs">
                  {item?.type.toUpperCase()}
                  <br />
                  {item?.type === "invoice" &&
                    item?.invoiceId === undefined &&
                    `(From Bulk Import)`}
                </TableCell>

                <TableCell>
                  {item?.type === "invoice" && item?.invoiceId !== undefined
                    ? item?.invoiceId?.invoiceNo
                    : `${item?.addedBy?.personalInfo?.title} ${item?.addedBy?.personalInfo?.firstName}`}
                </TableCell>

                <TableCell className={" font-semibold"}>
                  {currency?.symbol}&nbsp;{item?.totalAmount.toFixed(2)}
                </TableCell>

                <TableCell>
                  {item?.date ? formatDate(item?.date) : "N/A"}
                </TableCell>

                <TableCell>{formatDate(item?.createdAt)}</TableCell>
                <TableCell className=" flex items-center gap-4">
                  <Button
                    title={
                      item?.type === "invoice" && item?.invoiceId !== undefined
                        ? "Income added through invoices cannot be edited."
                        : "Edit Income"
                    }
                    disabled={
                      item?.type === "invoice" && item?.invoiceId !== undefined
                    }
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEdit(item)}
                  >
                    <Edit3 size={20} />
                  </Button>
                  <ConfirmationDialog
                    trigger={
                      <Button
                        title={
                          item?.type === "invoice" &&
                          item?.invoiceId !== undefined
                            ? `Income added through invoices cannot be deleted. ${item?.invoiceId}`
                            : "Delete Income"
                        }
                        disabled={
                          item?.type === "invoice" &&
                          item?.invoiceId !== undefined
                        }
                        variant="outline"
                        size="icon"
                      >
                        <Trash2 className="h-8 w-8 text-red-600" />
                      </Button>
                    }
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete."
                    onConfirm={() => handleDelete(item?._id)}
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
