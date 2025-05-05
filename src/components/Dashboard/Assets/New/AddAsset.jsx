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
import AssetDetails from "./AssetDetails";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";

export default function AddAsset() {
  const [assetDetails, setAssetDetails] = useState({
    title: "",
    desc: "",
    totalAmount: 0,
    date: "",
    quantity: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();

  const handleAddAsset = async () => {
    setIsLoading(true);
    try {
      if (
        !assetDetails.title ||
        !assetDetails.desc ||
        assetDetails.totalAmount <= 0 ||
        assetDetails.quantity <= 0 ||
        !assetDetails.date
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/company/asset", {
        method: "POST",
        body: JSON.stringify(assetDetails),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
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
      console.error("Error creating asset:", error);
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
          Add Asset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <AssetDetails details={assetDetails} setDetails={setAssetDetails} />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleAddAsset}
          disabled={isLoading}
        >
          {isLoading ? "Adding Asset..." : "Add Asset"}
        </Button>
      </CardFooter>
    </Card>
  );
}
