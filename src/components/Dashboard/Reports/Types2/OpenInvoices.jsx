"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpenInvoices() {
  const openInvoicesData = {
    details: [
      {
        invoiceNo: 101,
        client: "Client A",
        amount: 1000,
        dueDate: "2024-01-15",
      },
      {
        invoiceNo: 102,
        client: "Client B",
        amount: 500,
        dueDate: "2024-01-20",
      },
    ],
  };

  return (
    <div className="space-y-4 container bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Open Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {openInvoicesData.details.map((invoice, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Open Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            $
            {openInvoicesData.details
              .reduce((sum, invoice) => sum + invoice.amount, 0)
              .toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
