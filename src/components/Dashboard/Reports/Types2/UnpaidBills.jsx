"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = {
  details: [
    {
      billNo: 201,
      vendor: "Vendor X",
      amount: 300,
      dueDate: "2024-01-10",
    },
  ],
};

export function UnpaidBills() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unpaid Bills</CardTitle>
        <CardDescription>List of unpaid bills</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill No</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.details.map((bill) => (
              <TableRow key={bill.billNo}>
                <TableCell>{bill.billNo}</TableCell>
                <TableCell>{bill.vendor}</TableCell>
                <TableCell>${bill.amount.toFixed(2)}</TableCell>
                <TableCell>{bill.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
