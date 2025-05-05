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
import { ClientDetails } from "./ClientDetails";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";

export default function AddClient() {
  const user = useUser();
  const [clientDetails, setClientDetails] = useState({
    email: "",
    about: "",
    personalInfo: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      phone: "",
      avatar: "",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!clientDetails.email || !clientDetails.personalInfo.firstName) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }
      const body = {
        ...clientDetails,
        companyId: user?.companyId,
        ...clientDetails.personalInfo,
      };
      const response = await fetchCustom("/client", {
        method: "POST",
        body: JSON.stringify(body),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setClientDetails({});
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/dashboard/clients";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
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
          <Link href={"/dashboard/clients"}>
            <ArrowLeft stroke="#003366" size={34} />
          </Link>{" "}
          Add Client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <ClientDetails details={clientDetails} setDetails={setClientDetails} />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleAddClient}
          disabled={isLoading}
        >
          {isLoading ? "Adding Client..." : "Add Client"}
        </Button>
      </CardFooter>
    </Card>
  );
}
