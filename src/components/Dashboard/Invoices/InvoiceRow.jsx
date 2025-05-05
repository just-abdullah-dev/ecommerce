import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit3, Trash2 } from "lucide-react";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceModal from "./New/InvoiceModal";
import useCurrency from "@/hooks/useCurrency";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";
import { Button } from "@/components/ui/button";

const InvoiceRow = ({ invoice, isOpen, toggleOpen, handleDelete }) => {
  const [isEdit, setIsEdit] = useState(false);
  const currency = useCurrency();
  return (
    <>
      <tr className="border-b hover:bg-gray-300/50 duration-200 transition-all">
        <td className="p-2">{invoice?.invoiceNo}</td>
        <td className="p-2">{`${invoice?.clientId.personalInfo?.firstName} ${invoice?.clientId?.personalInfo?.lastName}`}</td>
        <td className="p-2">{invoice?.items.length}</td>
        <td className="p-2">
          <span
            className={`${
              invoice?.status === "paid"
                ? " text-green-500 "
                : " text-orange-500 "
            } font-medium`}
          >
            {invoice?.status.toUpperCase()}
          </span>
        </td>
        <td className="p-2">{`${invoice?.invoiceBy?.personalInfo?.firstName}`}</td>
        <td className="p-2">
          {currency?.symbol}&nbsp;{invoice?.totalAmount.toFixed(2)}
        </td>
        <td className="p-2">
          {new Date(invoice?.issueDate).toLocaleDateString()}
        </td>
        <td className="p-2">
          {new Date(invoice?.dueDate).toLocaleDateString()}
        </td>
        <td className="p-2">
          <a className=" cursor-pointer hover:underline" onClick={toggleOpen}>
            Preview
          </a>
        </td>
        <td className="p-2 flex items-center gap-4">
          <div className=" cursor-pointer" onClick={() => setIsEdit(true)}>
            <Edit3 size={20} />
          </div>
          <ConfirmationDialog
            trigger={
              <Button title={"Delete invoice"} variant="outline" size="icon">
                <Trash2 className="h-8 w-8 text-red-600" />
              </Button>
            }
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete."
            onConfirm={() => handleDelete(invoice?._id)}
          />
        </td>
      </tr>
      {(isOpen || isEdit) && (
        <tr>
          <td colSpan={9}>
            <InvoiceModal
              invoice={invoice}
              onClose={toggleOpen}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default InvoiceRow;
