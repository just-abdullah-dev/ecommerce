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
import { ChevronDown, ChevronRight, Edit3, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EditEmployee } from "./EditEmployee";
import InputComp from "@/components/Utils/Input";
import Link from "next/link";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/contexts/user";
import { fetchCustom, formatDate } from "@/lib/utils";
import ShowError from "@/components/Utils/ShowError";
import LoadingDots from "@/components/Utils/LoadingDots";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";
import { Separator } from "@/components/ui/separator";

export function AllEmployees({
  isSelectEmp = false,
  setSelectedEmp,
  isSubAccount = false,
}) {
  const currency = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editEmployee, setEditEmployee] = useState(null);
  const [openItem, setOpenItem] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [filteredItems, setFilteredItems] = useState([]);
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/user", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        if (isSubAccount) {
          const employees = data?.data?.filter(
            (person) => person.role === "employee"
          );
          setEmployees(employees);
        } else {
          setEmployees(data?.data);
        }
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  // Update filteredItems whenever employees, searchTerm, or roleFilter change
  useEffect(() => {
    const newFilteredItems = employees.filter((employee) => {
      const fullName = `${[
        employee?.personalInfo?.title,
        employee?.personalInfo?.firstName,
        employee?.personalInfo?.middleName,
        employee?.personalInfo?.lastName,
      ]
        .filter(Boolean)
        .join(" ")}`.toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        employee?.jobInfo?.employeeId.includes(searchTerm.toLowerCase()) ||
        employee?.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || employee?.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    setFilteredItems(newFilteredItems);
  }, [employees, searchTerm, roleFilter]);
  console.log(employees);

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }

  if (editEmployee) {
    return (
      <EditEmployee
        employee={editEmployee}
        onClose={() => {
          setEditEmployee(null);
          fetchItems();
        }}
      />
    );
  }

  const handleDelete = async (userId) => {
    try {
      const response = await fetchCustom("/user", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ employeeId: userId }),
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
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <InputComp
              id="search"
              placeholder="Search by name, emp id or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!isSubAccount && (
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className=" bg-gray-200" id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div>Total: {filteredItems.length}</div>
        <Table>
          <TableHeader>
            <TableRow>
              {isSelectEmp && <TableHead>Actions</TableHead>}
              <TableHead>Expand</TableHead>
              <TableHead>Emp ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Salary Type</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Job Role</TableHead>
              {!isSelectEmp && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((employee) => (
              <>
                <TableRow key={employee?._id}>
                  {isSelectEmp && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (employee?.jobInfo?.payrollId) {
                          setSelectedEmp(employee);
                        } else {
                          toast({
                            variant: "destructive",
                            description:
                              "Employee does not have payroll structure. Kindly create it from employees section.",
                          });
                        }
                      }}
                    >
                      Select
                    </Button>
                  )}
                  <TableCell>
                    {openItem?._id === employee?._id ? (
                      <ChevronDown
                        className=" cursor-pointer"
                        onClick={() => {
                          setOpenItem(null);
                        }}
                      />
                    ) : (
                      <ChevronRight
                        className=" cursor-pointer"
                        onClick={() => {
                          setOpenItem(employee);
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{employee?.jobInfo?.employeeId}</TableCell>{" "}
                  <TableCell>
                    {[
                      employee?.personalInfo?.title,
                      employee.personalInfo?.firstName,
                      employee.personalInfo?.middleName,
                      employee.personalInfo?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    <Link href={`mail:${employee.email}`}>
                      {employee.email}
                    </Link>
                  </TableCell>
                  <TableCell className=" font-semibold text-xs">
                    {employee.role.toUpperCase()}
                  </TableCell>
                  <TableCell className=" font-semibold text-xs">
                    {employee?.jobInfo?.payrollId?.salaryType.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Link href={`tel:${employee.personalInfo?.phone}`}>
                      +{employee.personalInfo?.phone}
                    </Link>
                  </TableCell>
                  <TableCell>{employee?.jobInfo?.jobRole}</TableCell>
                  <TableCell className="flex items-center gap-4">
                    {!isSelectEmp && (
                      <>
                        {" "}
                        <Button
                          // disabled={
                          //   employee?.role === "admin" && employee?.subscriptionId
                          // }
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditEmployee(employee)}
                        >
                          <Edit3 size={20} />
                        </Button>
                        <ConfirmationDialog
                          trigger={
                            <Button
                              disabled={
                                employee?.role === "admin" && employee?.isBuyer
                              }
                              variant="outline"
                              size="icon"
                            >
                              <Trash2 className="h-8 w-8 text-red-600" />
                            </Button>
                          }
                          title="Are you sure?"
                          description="This action cannot be undone. This will permanently delete."
                          onConfirm={() => handleDelete(employee?._id)}
                        />
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {openItem?._id === employee?._id && (
                  <TableRow className=" ">
                    <TableCell></TableCell>
                    <TableCell colSpan={7}>
                      <div className=" grid grid-cols-2 gap-4">
                        {employee?.jobInfo?.payrollId ? (
                          <>
                            <div className=" w-full flex items-center justify-between border-b border-gray-700">
                              {" "}
                              <p className="font-semibold">
                                {employee?.jobInfo?.payrollId?.salaryType ===
                                "fixed"
                                  ? "Salary: "
                                  : "Hourly Rate:"}
                              </p>
                              {employee?.jobInfo?.payrollId?.salaryType ===
                              "fixed"
                                ? `${currency?.symbol} ${employee?.jobInfo?.payrollId?.salary}`
                                : `${currency?.symbol} ${employee?.jobInfo?.payrollId?.hourlyRate}/hr`}
                            </div>
                            <div className=" w-full flex items-center justify-between border-b border-gray-700">
                              {" "}
                              <p className="font-semibold">
                                Overtime Hourly Rate:
                              </p>
                              {`${currency?.symbol} ${employee?.jobInfo?.payrollId?.overtimeHourlyRate}/hr`}
                            </div>
                            <div className=" w-full flex items-center justify-between border-b border-gray-700">
                              {" "}
                              <p className="font-semibold">Bonus:</p>{" "}
                              {`${employee?.jobInfo?.payrollId?.bonus}%`}
                            </div>
                            <div className=" w-full flex items-center justify-between border-b border-gray-700">
                              {" "}
                              <p className="font-semibold">Tax:</p>{" "}
                              {`${employee?.jobInfo?.payrollId?.tax}%`}
                            </div>
                          </>
                        ) : (
                          <div className=" col-span-2 w-full flex items-center justify-between border-b border-gray-700">
                            {" "}
                            <p className="font-semibold">
                              Payroll structure was not found for this employee:
                            </p>{" "}
                            Create payroll in edit.
                          </div>
                        )}

                        <div className=" w-full flex items-center justify-between border-b border-gray-700">
                          {" "}
                          <p className="font-semibold">Join Date:</p>{" "}
                          {formatDate(employee?.jobInfo?.joinDate)}
                        </div>
                        <div className=" w-full flex items-center justify-between border-b border-gray-700">
                          {" "}
                          <p className="font-semibold">Department:</p>
                          {employee?.jobInfo?.department}
                        </div>
                      </div>
                      <div className=" mt-4 w-full flex items-center justify-between border-b border-gray-700">
                        {" "}
                        <p className="font-semibold">Address:</p>{" "}
                        {employee.personalInfo?.address}
                      </div>
                    </TableCell>

                    <TableCell></TableCell>
                  </TableRow>
                )}
              </>
            ))}
            {filteredItems.length <= 0 && (
              <TableRow className="text-red-500 w-full">
                <TableCell colSpan={"10"} className=" ">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
