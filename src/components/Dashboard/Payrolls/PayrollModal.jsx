"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePDF } from "react-to-pdf";
import Image from "next/image";
import { Download } from "lucide-react";
import { formatDate, formatDateForInput } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useCurrency from "@/hooks/useCurrency";
import { toast } from "@/hooks/use-toast";
import useUser from "@/contexts/user";
import ShowError from "@/components/Utils/ShowError";

export default function PayrollModal({
  payroll,
  onClose,
  setIsEdit,
  isEdit = false,
}) {
  const currency = useCurrency();
  const { toPDF, targetRef } = usePDF({
    filename: `payroll-${payroll?._id}.pdf`,
  });
  if (!payroll) {
    return <ShowError error={"Set the payroll data"} />;
  }
  const user = useUser();
  //left this cause run payroll edit I want to not add it in platfrom
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState(payroll?.status);
  const [fromDate, setFromDate] = useState(payroll?.from);
  const [toDate, setToDate] = useState(payroll?.to);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (
        !payroll?.title ||
        !payroll?.type ||
        !payroll?.totalAmount ||
        !payroll?.date ||
        !payroll?.from ||
        !payroll?.to
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/company/expense", {
        method: "PUT",
        body: JSON.stringify({
          ...payroll,
          payrollId: payroll?._id,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating run payroll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        if (isEdit) {
          setIsEdit(false);
        } else {
          onClose();
        }
      }}
    >
      <DialogContent className=" max-w-[90vw] md:max-w-4xl max-h-[calc(100vh-10vw)] md:max-h-screen overflow-auto ">
        <DialogHeader>
          <DialogTitle className="text-custom-gradient db-title">
            {isEdit ? "Update Payroll" : "Payroll Preview"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-x-2 absolute top-10 right-4">
          <Button onClick={() => toPDF()}>
            PDF <Download />
          </Button>
        </div>
        <div
          ref={targetRef}
          className="space-y-4 bg-white p-8"
          style={{ width: "210mm", height: "297mm" }}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">
              {isEdit && "Editing"} Payroll
            </h2>
            <Image
              src="/assets/logo.png"
              alt="Company Logo"
              width={100}
              height={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Employee Information</h3>
              <p>
                {payroll?.employeeId?.personalInfo?.firstName}{" "}
                {payroll?.employeeId?.personalInfo?.lastName}
              </p>
              <p>Email: {payroll?.employeeId?.email}</p>
              <p>Role: {payroll?.employeeId?.role}</p>
            </div>
            <div>
              <h3 className="font-semibold">Payroll Details</h3>
              <p>
                Salary Type:{" "}
                <span className=" font-semibold ">
                  <span className={` font-medium`}>
                    {payroll?.salaryType
                      ? payroll?.salaryType.toUpperCase()
                      : ""}
                  </span>
                </span>
              </p>
              {isEdit ? (
                <>
                  <div className="flex items-center gap-2">
                    <p>From:</p>
                    <Input
                      type="date"
                      value={formatDateForInput(fromDate)}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <p>To:</p>
                    <Input
                      type="date"
                      value={formatDateForInput(toDate)}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-auto"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>From: {formatDate(fromDate)}</p>
                  <p>To: {formatDate(toDate)}</p>
                </>
              )}
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Base Salary</td>
                <td className="border p-2 text-right">
                  {currency?.symbol}&nbsp;
                  {payroll?.salaryType === "fixed"
                    ? payroll?.salary.toFixed(2)
                    : `${payroll?.hourlyRate} X ${
                        payroll?.noOfWorkingHours
                      } hrs = ${currency?.symbol} ${(
                        payroll?.hourlyRate * payroll?.noOfWorkingHours
                      ).toFixed(2)}`}
                </td>
              </tr>
              {payroll?.overtimeHours > 0 && (
                <tr>
                  <td className="border p-2">
                    Overtime ({payroll?.overtimeHours} hours)
                  </td>
                  <td className="border p-2 text-right">
                    {currency?.symbol}&nbsp;{payroll?.overtimeHourlyRate} X{" "}
                    {payroll?.overtimeHours} hrs = {currency?.symbol}&nbsp;
                    {(
                      payroll?.overtimeHourlyRate * payroll?.overtimeHours
                    ).toFixed(2)}
                  </td>
                </tr>
              )}
              <tr>
                <td className="border p-2">Bonus({payroll?.bonus}%)</td>
                <td className="border p-2 text-right">
                  {currency?.symbol}&nbsp;
                  {payroll?.salaryType === "fixed"
                    ? ((payroll?.bonus / 100) * payroll?.salary).toFixed(2)
                    : (
                        (payroll?.bonus / 100) *
                        (payroll?.hourlyRate * payroll?.noOfWorkingHours +
                          payroll?.overtimeHourlyRate * payroll?.overtimeHours)
                      ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Tax({payroll?.tax}%)</td>
                <td className="border p-2 text-right text-red-500">
                  -{currency?.symbol}&nbsp;
                  {payroll?.salaryType === "fixed"
                    ? ((payroll?.tax / 100) * payroll?.salary).toFixed(2)
                    : (
                        (payroll?.tax / 100) *
                        (payroll?.hourlyRate * payroll?.noOfWorkingHours +
                          payroll?.overtimeHourlyRate * payroll?.overtimeHours)
                      ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-right">
            <p className="text-xl font-bold">
              Total Amount: {currency?.symbol}&nbsp;
              {payroll?.totalAmount ? payroll?.totalAmount.toFixed(2) : 0}
            </p>
          </div>

          <div className="flex gap-3 items-center font-semibold">
            <div>Status:</div>
            {isEdit ? (
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div>
                <span
                  className={`px-3 py-2 rounded-lg  ${
                    status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {status && status.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold">Additional Notes</h3>
            <p>{payroll?.notes}</p>
          </div>

          <p className="text-sm text-gray-500">
            This is an electronically generated document, no signature is
            required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
