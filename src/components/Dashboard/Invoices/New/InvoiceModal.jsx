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
import { Download, Printer, X } from "lucide-react";
import { fetchCustom, formatDate, formatDateForInput } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/contexts/user";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import InvoiceModalPreview from "./InvoiceModalPreview";

export default function InvoiceModal({
  invoice,
  onClose,
  setIsEdit,
  isEdit = false,
}) {
  const currency = useCurrency();
  const { company } = useCompany();
  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${invoice?.invoiceNo}.pdf`,
  });
  
    const [invoicePreviewData, setInvoicePreviewData] = useState(null);
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState(invoice?.status);
  const [dueDate, setDueDate] = useState(invoice?.dueDate);

  const calculateSubtotal = () => {
    return invoice?.items.reduce(
      (total, item) => total + item?.salePrice * item?.quantity,
      0,
    );
  };
  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (invoice?.tax / 100);
  const discountAmount = subtotal * (invoice?.discount / 100);
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleUpdateInvoice = async (fileName) => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/client/invoice", {
        method: "PUT",
        token: user?.token,
        body: JSON.stringify({
          invoiceId: invoice?._id,
          status: status,
          paidAmount: status === "paid" ? totalAmount : invoice?.paidAmount,
          dueDate: dueDate,
          fileName
        }),
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/invoices";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    }
    setIsLoading(false);
  };

  const handleUpdate = async ()=>{
    setInvoicePreviewData({
      ...invoice,
      status: status,
      paidAmount: status === "paid" ? totalAmount : invoice?.paidAmount,
      dueDate: dueDate,
    });

  }

  if(invoicePreviewData !== null ){
    return <InvoiceModalPreview
    prevFileName={invoice?.fileName}

              onConfirm={(name) => {
                setInvoicePreviewData(null);
                handleUpdateInvoice(name);
              }}
              invoice={invoicePreviewData}
              onClose={() => {
                setInvoicePreviewData(null);
              }}
            />
  }

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
      <DialogContent className="w-full md:max-w-4xl max-h-screen overflow-auto scale-[0.8]">
        <DialogHeader>
          <DialogTitle className="text-custom-gradient db-title">
            {isEdit ? "Update Invoice" : "Invoice Preview"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-end space-x-2 absolute top-10 right-10">
          <Button onClick={() => toPDF()}>
            PDF <Download />
          </Button>
          {isEdit && (
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating Invoice..." : "Update Invoice"}
            </Button>
          )}
        </div>
        <div
          ref={targetRef}
          className="space-y-4 bg-white p-8"
          style={{ width: "210mm", height: "297mm" }}
        >
          <div className="flex justify-between items-start relative">
            <h2 className="text-2xl font-bold">
              {" "}
              {isEdit && "Editing"} Invoice
            </h2>
            {/* <Image
              src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${company?.logo}`}
              alt="Company Logo"
              width={100}
              height={50}
              className=" absolute top-10 right-10"
            /> */}
          </div>
          <div>
            <h1 className="font-semibold text-xl">
              Invoice # {invoice?.invoiceNo}
            </h1>
          </div>

          <div className="text-left">
            <p>
              <span className="font-semibold">Issue Date:</span>{" "}
              {formatDate(invoice?.issueDate)}
            </p>
            {isEdit ? (
              <div className="flex items-center gap-2">
                <p>Due Date:</p>
                <Input
                  type="date"
                  value={formatDateForInput(dueDate)}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            ) : (
              <p>
                <span className="font-semibold">Due Date:</span>{" "}
                {formatDate(dueDate)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-lg">Billed By</h3>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {company?.legalName} ({company?.displayName})
              </p>
              <p>
                <span className="font-semibold">Email:</span> {company?.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {company?.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {company?.address}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Billed To</h3>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {invoice?.clientId?.personalInfo.title}{" "}
                {invoice?.clientId?.personalInfo.firstName}{" "}
                {invoice?.clientId?.personalInfo.middleName}{" "}
                {invoice?.clientId?.personalInfo.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {invoice?.clientId?.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {invoice?.clientId?.personalInfo.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {invoice?.clientId?.personalInfo.address}
              </p>
            </div>
          </div>
          <h1 className="text-lg font-semibold mt-4">Items</h1>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Rate</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item?.productId?.name}</td>
                  <td className="border p-2">{item?.productId?.desc}</td>
                  <td className="border p-2 text-right">{item?.quantity}</td>
                  <td className="border p-2 text-right">
                    {currency?.symbol}&nbsp;{item?.salePrice.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    {currency?.symbol}&nbsp;
                    {(item?.quantity * item?.salePrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right">
            <p>
              Subtotal: {currency?.symbol}&nbsp;{subtotal.toFixed(2)}
            </p>
            <p>
              Tax ({invoice?.tax}%): {currency?.symbol}&nbsp;
              {taxAmount.toFixed(2)}
            </p>
            <p>
              Discount ({invoice?.discount}%): {currency?.symbol}&nbsp;
              {discountAmount.toFixed(2)}
            </p>
            <p className="text-xl font-bold">
              Total: {currency?.symbol}&nbsp;{totalAmount.toFixed(2)}
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
                  <SelectItem value="pending">Pending</SelectItem>
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
                  {status.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Additional Notes</h3>
            <p>{invoice?.notes}</p>
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
