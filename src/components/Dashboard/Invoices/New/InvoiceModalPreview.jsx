"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import DisplayPDF from "./DisplayPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useCurrency from "@/hooks/useCurrency";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";

export default function InvoiceModalPreview({
  invoice,
  onClose,
  onConfirm,
  prevFileName,
}) {
  const currency = useCurrency();
  const { company } = useCompany();
  const targetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const calculateSubtotal = () => {
    return invoice?.items.reduce(
      (total, item) => total + item?.salePrice * item?.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (invoice?.tax / 100);
  const discountAmount = subtotal * (invoice?.discount / 100);
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleConfirm = async () => {
    setIsLoading(true);

    const element = targetRef.current;
    if (!element) return;

    const scale = 2; // lower = more compressed, but less quality

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.7); // use JPEG + compression
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    const blob = pdf.output("blob");
    const file = new File([blob], `invoice.pdf`, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/aws-s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data?.success) {
        if (prevFileName) {
          await handleDelete(prevFileName);
        }
        onConfirm(data?.fileName);
      } else {
        toast({
          variant: "destructive",
          description: "Error: " + data?.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // const handleConfirm = async () => {
  //   setIsLoading(true);
  //   await fetch("assets/bg.png")
  //     .then((res) => res.blob())
  //     .then(async (blob) => {
  //       const file = new File([blob], "bg.png", {
  //         type: "image/png",
  //       });

  //       const formData = new FormData();
  //       formData.append("file", file);

  //       const response = await fetch("/api/aws-s3-upload", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       const data = await response.json();
  //       console.log(data);
  //       if (data?.success) {
  //         if (prevFileName) {
  //           await handleDelete(prevFileName);
  //         }
  //         onConfirm(data?.fileName);
  //       } else {
  //         toast({
  //           variant: "destructive",
  //           description: "Error: " + data?.message,
  //         });
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setIsLoading(false);
  //     });
  // };

  const handleDelete = async (fileName) => {
    try {
      const response = await fetch("/api/aws-s3-upload", {
        method: "DELETE",
        body: JSON.stringify({ fileName }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogContent className="w-full md:max-w-4xl max-h-screen overflow-auto scale-[0.8] ">
        <DialogHeader>
          <DialogTitle className="text-custom-gradient db-title">
            Invoice Preview
          </DialogTitle>
        </DialogHeader>
          <Button className="absolute top-10 right-10" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? "Please wait..." : "Confirm"}
          </Button>
        <div
          ref={targetRef}
          className="space-y-4 bg-white p-8 pointer-events-none"
          style={{
            width: 
            "210mm",
            // "210mm",
            height: 
            "297mm",
            // "297mm"
          }}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Invoice</h2>
            {/* <Image
              src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${company?.logo}`}
              alt="Company Logo"
              width={50}
              height={50}
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

            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {formatDate(invoice?.dueDate)}
            </p>
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
                  <td className="border p-2">{item?.name}</td>
                  <td className="border p-2">{item?.desc}</td>
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

            <div>
              <span
                className={`px-3 py-2 rounded-lg  ${
                  invoice?.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {invoice?.status.toUpperCase()}
              </span>
            </div>
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

        {/* <DisplayPDF targetRef={targetRef} /> */}
      </DialogContent>
    </Dialog>
  );
}
