"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ItemList from "./ItemList";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceModal from "./InvoiceModal";
import InvoiceModalPreview from "./InvoiceModalPreview";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchCustom, formatDate } from "@/lib/utils";
import useUser from "@/contexts/user";
import { toast } from "@/hooks/use-toast";
import { AllClients } from "../../Clients/AllClients";

export default function CreateInvoice() {
  const [items, setItems] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    tax: 0,
    discount: 0,
    status: "pending",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoicePreviewData, setInvoicePreviewData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [bodyData, setBodyData] = useState({});

  const handleCreateInvoice = async () => {
    setIsLoading(true);
    try {
      // Create invoice
      const subtotal = items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
      const taxAmount = subtotal * (invoiceDetails.tax / 100);
      const discountAmount = subtotal * (invoiceDetails.discount / 100);
      const totalAmount = subtotal + taxAmount - discountAmount;

      const invoiceDataForPreview = {
        ...invoiceDetails,
        items,
        clientId: selectedClient,
      };

      console.log(invoiceDataForPreview);
      setInvoicePreviewData(invoiceDataForPreview);
      const body = {
        ...invoiceDetails,
        items,
        clientId: selectedClient?._id,
        paidAmount: invoiceDetails?.status === "paid" ? totalAmount : 0,
      };
      setBodyData(body);
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoiceReq = async (body) => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/client/invoice", {
        method: "POST",
        body: JSON.stringify(body),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        setInvoiceData(data?.data);
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          <Link href={"/dashboard/invoices"}>
            <ArrowLeft stroke="#003366" size={34} />
          </Link>{" "}
          Create Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        {selectedClient ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={selectedClient?._id}>
                  <TableCell>
                    {[
                      selectedClient?.personalInfo?.title,
                      selectedClient.personalInfo?.firstName,
                      selectedClient.personalInfo?.middleName,
                      selectedClient.personalInfo?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell className=" hover:underline">
                    <Link href={`mail:${selectedClient.email}`}>
                      {selectedClient.email}
                    </Link>
                  </TableCell>
                  <TableCell className=" hover:underline">
                    <Link href={`tel:${selectedClient.personalInfo?.phone}`}>
                      {selectedClient.personalInfo?.phone}
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>On Board Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedClient.personalInfo?.address}</TableCell>
                  <TableCell>{`${formatDate(
                    selectedClient?.personalInfo?.joinDate
                  )}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <h1 className=" text-lg md:text-2xl flex items-center justify-between ">
              <span className="text-custom-gradient font-semibold">
                Select Client
              </span>{" "}
              <span className=" text-base">OR</span>{" "}
              <Link
                href={"/dashboard/clients/new"}
                className=" hover:underline"
              >
                <Button>Create new client</Button>
              </Link>
            </h1>
            <AllClients
              isSelectClient={true}
              setSelectedClient={setSelectedClient}
            />
          </>
        )}
        {selectedClient && (
          <>
            <ItemList items={items} setItems={setItems} />
            <InvoiceDetails
              details={invoiceDetails}
              setDetails={setInvoiceDetails}
            />
            <InvoiceSummary
              items={items}
              tax={invoiceDetails.tax}
              discount={invoiceDetails.discount}
            />{" "}
          </>
        )}
      </CardContent>
      <CardFooter>
        {selectedClient && (
          <Button
            className=" w-full"
            onClick={handleCreateInvoice}
            disabled={isLoading}
          >
            {isLoading ? "Creating Invoice..." : "Create Invoice"}
          </Button>
        )}
      </CardFooter>
      {invoicePreviewData !== null && (
        <InvoiceModalPreview
          onConfirm={(name) => {
            setInvoicePreviewData(null);
            const body = {
              ...bodyData,
              fileName: name,
            };
            setBodyData(body);
            createInvoiceReq(body);
          }}
          invoice={invoicePreviewData}
          onClose={() => {
            setInvoicePreviewData(null);
          }}
        />
      )}
      {invoiceData !== null && (
        <InvoiceModal
          invoice={invoiceData}
          onClose={() => {
            setInvoiceData(null);
            window.location.href = "/dashboard/invoices";
          }}
        />
      )}
    </Card>
  );
}
