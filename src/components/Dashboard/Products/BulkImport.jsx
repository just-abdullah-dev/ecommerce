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
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchCustom("/product/bulk-import", {
        method: "POST",
        body: JSON.stringify({ products: productsData }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setProductsData([]);
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/products";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error importing bulk products:", error);
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
          <Link href={"/dashboard/products"}>
            <ArrowLeft stroke="#003366" size={34} />
          </Link>{" "}
          Bulk Import of Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <h1 className="font-semibold text-lg">Instructions:</h1>
        <div className=" w-full md:flex gap-3">
          <Image
            src={"/portal/products-sample.png"}
            width={900}
            height={600}
            alt="products-Sample-Image"
            className=" aspect-auto w-[74%] border-2 border-black"
          />
          <div className=" w-[26%] container text-sm rounded-lg shadow-lg">
            <h1 className="font-semibold">
              1. Columns Name must be same as shown.
            </h1>
            <h1 className="font-semibold">2. Required Attributes Are:</h1>
            <ul className="list-none pl-4">
              <li>i. Name</li>
              <li>ii. Price</li>
            </ul>
            <h1 className="font-semibold">3. Rest are optionals.</h1>
          </div>
        </div>
        <GetDataFromExcel
          setData={(data) => {
            setProductsData(data);
          }}
        />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleBulkImport}
          disabled={isLoading || productsData.length === 0}
        >
          {isLoading ? "Importing products..." : "Import Products"}
        </Button>
      </CardFooter>
    </Card>
  );
}
