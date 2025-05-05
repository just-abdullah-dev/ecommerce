"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import GetDataFromExcel from "@/components/Utils/GetDataFromExcel";
import Image from "next/image";

export default function BulkImport() {
  const user = useUser();
  const [assetsData, setAssetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchCustom("/company/asset/bulk-import", {
        method: "POST",
        body: JSON.stringify({ assets: assetsData }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setAssetsData([]);
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/assets";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error importing bulk assets:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          <Link href={"/dashboard/assets"}>
            <ArrowLeft stroke="#003366" size={34} />
          </Link>{" "}
          Bulk Import of Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <h1 className="font-semibold text-lg">Instructions:</h1>
        <div className=" w-full md:flex gap-3">
          <Image
            src={"/portal/assets-sample.png"}
            width={900}
            height={600}
            alt="assets-Sample-Image"
            className=" aspect-auto w-[74%] border-2 border-black"
          />
          <div className=" w-[26%] container text-sm rounded-lg shadow-lg">
            <h1 className="font-semibold">
              1. Columns Name must be same as shown.
            </h1>
            <h1 className="font-semibold">2. Required Attributes Are:</h1>
            <ul className="list-none pl-4">
              <li>i. Title</li>
              <li>ii. Total Amount</li>
              <li>iii. Quantity</li>
            </ul>
            <h1 className="font-semibold">
              3. Select this (&quot;YYYY-MM-DD&quot;) format for join date.{" "}
              <Link
                className=" font-normal text-blue-600 hover:underline"
                href="https://support.microsoft.com/en-us/office/format-a-date-the-way-you-want-8e10019e-d5d8-47a1-ba95-db95123d273e"
                target="_blank"
              >
                (see how)
              </Link>
            </h1>
            <h1 className="font-semibold">4. Rest are optionals.</h1>
          </div>
        </div>
        <GetDataFromExcel
          setData={(data) => {
            setAssetsData(data);
          }}
        />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleBulkImport}
          disabled={isLoading || assetsData.length === 0}
        >
          {isLoading ? "Importing assets..." : "Import Assets"}
        </Button>
      </CardFooter>
    </Card>
  );
}
