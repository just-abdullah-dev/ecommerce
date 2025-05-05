import React from "react";
import { DollarSign, FileText, Mail, User } from "lucide-react";

const InvoiceDetails = ({ invoice }) => {
  const calculateSubtotal = () => {
    return invoice.clientId.items.reduce(
      (total, item) => total + item.salePrice * item.quantity,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (invoice.tax / 100);
  const discountAmount = subtotal * (invoice.discount / 100);
  const totalAmount = subtotal + taxAmount - discountAmount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w- mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Invoice # {invoice.invoiceNo}
          </h1>
          <p className="text-gray-600 mt-1">
            Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Company Name
          </h2>
          <p className="text-gray-600">
            123 Business Street, City, State 12345
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="text-left font-semibold text-gray-600 pb-2"
                colSpan={2}
              >
                Client Information
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 pr-4 text-gray-600">Name:</td>
              <td>{`${invoice.clientId.personalInfo?.firstName} ${invoice.clientId.personalInfo?.lastName}`}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-gray-600">Email:</td>
              <td>{invoice.clientId.email}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-gray-600">About:</td>
              <td>{invoice.clientId.about}</td>
            </tr>
          </tbody>
        </table>

        <table className="w-full">
          <thead>
            <tr>
              <th
                className="text-left font-semibold text-gray-600 pb-2"
                colSpan={2}
              >
                Invoice Summary
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 pr-4 text-gray-600">Status:</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-gray-600">Subtotal:</td>
              <td>${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-gray-600">
                Tax ({invoice.tax.toFixed(2)}%):
              </td>
              <td>${taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-gray-600">
                Discount ({invoice.discount.toFixed(2)}%):
              </td>
              <td>-${discountAmount.toFixed(2)}</td>
            </tr>
            <tr className="font-semibold">
              <td className="py-1 pr-4">Total Amount:</td>
              <td>${totalAmount.toFixed(2)}</td>
            </tr>
            <tr className="text-green-600">
              <td className="py-1 pr-4">Paid Amount:</td>
              <td>${invoice.paidAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Invoice Items
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left font-semibold text-gray-600">
                Name
              </th>
              <th className="p-2 text-left font-semibold text-gray-600">
                Description
              </th>
              <th className="p-2 text-right font-semibold text-gray-600">
                Quantity
              </th>
              <th className="p-2 text-right font-semibold text-gray-600">
                Unit Price
              </th>
              <th className="p-2 text-right font-semibold text-gray-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.clientId.items.map((item) => (
              <tr key={item._id} className="border-b border-gray-200">
                <td className="p-2">{item.productId.name}</td>
                <td className="p-2">{item.productId.desc}</td>
                <td className="p-2 text-right">{item.quantity}</td>
                <td className="p-2 text-right">${item.salePrice.toFixed(2)}</td>
                <td className="p-2 text-right">
                  ${(item.quantity * item.salePrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Invoice Generated By
        </h3>
        <table className="md:w-1/2 w-full">
          <tbody>
            <tr>
              <td className="py-1 pr-4 text-gray-600">
                <User className="inline w-5 h-5 mr-2" />
                Name:
              </td>
              <td>{`${invoice.invoiceBy?.personalInfo?.firstName} ${invoice.invoiceBy?.personalInfo?.lastName}`}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-gray-600">
                <Mail className="inline w-5 h-5 mr-2" />
                Email:
              </td>
              <td>{invoice.invoiceBy?.email}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetails;
