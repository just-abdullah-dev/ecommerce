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
      asset: "Vehicle",
      cost: 20000,
      acquisitionDate: "2020-01-01",
      depreciation: 5000,
    },
  ],
};

export function FixedAssetListing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixed Asset Listing</CardTitle>
        <CardDescription>List of fixed assets with details</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Acquisition Date</TableHead>
              <TableHead>Depreciation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.details.map((asset) => (
              <TableRow key={asset.asset}>
                <TableCell>{asset.asset}</TableCell>
                <TableCell>${asset.cost.toFixed(2)}</TableCell>
                <TableCell>{asset.acquisitionDate}</TableCell>
                <TableCell>${asset.depreciation.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
