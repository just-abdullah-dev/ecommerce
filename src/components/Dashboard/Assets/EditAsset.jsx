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
import { toast } from "@/hooks/use-toast";
import AssetDetails from "./New/AssetDetails";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";

export default function EditAsset({ asset, onClose }) {
  const [assetDetails, setAssetDetails] = useState(asset);
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleEditAsset = async () => {
    setIsLoading(true);
    try {
      console.log(assetDetails);

      if (
        !assetDetails.title ||
        !assetDetails.desc ||
        assetDetails.totalAmount <= 1 ||
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
        method: "PUT",
        body: JSON.stringify({
          ...assetDetails,
          assetId: assetDetails?._id,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center justify-between">
          Edit Asset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <AssetDetails details={assetDetails} setDetails={setAssetDetails} />
      </CardContent>
      <CardFooter className=" flex gap-4">
        <Button
          onClick={onClose}
          className=" w-full"
          variant="destructive"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className=" w-full"
          onClick={handleEditAsset}
          disabled={isLoading}
        >
          {isLoading ? "Updating Asset..." : "Update Asset"}
        </Button>
      </CardFooter>
    </Card>
  );
}
