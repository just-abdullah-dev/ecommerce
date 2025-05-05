"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2Icon, PenBoxIcon } from "lucide-react";
import InputComp from "@/components/Utils/Input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies, fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";
import { toast } from "@/hooks/use-toast";
import Loading from "@/components/Utils/Loading";
import { useCompany } from "@/contexts/company";
import ShowError from "@/components/Utils/ShowError";
import Image from "next/image";
import UploadFileToAWS from "@/components/Utils/UploadFileToAWS";

export default function CompanyDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { company, updateCompany, deleteCompany } = useCompany();
  const user = useUser();

  useEffect(() => {
    if (user?.companyId) {
      setCompanyData(company);
      setIsCreating(false);
      setIsEditing(false);
    } else {
      if (company?._id) {
        setCompanyData(company);
        setIsCreating(false);
        setIsEditing(false);
      } else {
        setIsCreating(true);
        setIsEditing(false);
      }
    }
  }, [user, company]);

  if (!isCreating && !isEditing && !companyData) {
    return <Loading />;
  }

  // if (isCreating && !user?.subscriptionId) {
  //   return <ShowError error={"Buy a subscription plan first :)"} />;
  // }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetchCustom("/company", {
        method: isCreating ? "POST" : "PUT",
        body: JSON.stringify(companyData),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        console.log(data?.data);
        updateCompany(data?.data);
        if (isEditing) {
          setIsEditing(false);
        } else {
          window.location.reload();
        }
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
        console.error(data?.message);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    try {
      alert("made changes to company delete API");
      return;
      setIsLoading(true);
      const response = await fetchCustom("/company", {
        method: "DELETE",
        body: JSON.stringify({ companyId: company?._id }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsEditing(false);
        setIsCreating(true);
        console.log(data);
        deleteCompany();
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
        console.error(data?.message);
      }
    } catch (error) {
      console.error("Error deleting company details:", error);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className=" relative">
        <CardTitle className="text-xl text-custom-gradient">
          Company Details
        </CardTitle>
        {isCreating && <p>Enter your company details</p>}
        {user?.role === "admin" && !isCreating && (
          <Button
            variant={isEditing ? "destructive" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className=" absolute top-3 right-3 w-20"
          >
            {isEditing ? "" : "Edit"}
            {isEditing ? "Cancel" : <PenBoxIcon />}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div
            className={`${
              !isEditing && !isCreating
                ? "pointer-events-none opacity-70"
                : "pointer-events-auto opacity-100"
            } w-full flex items-center justify-between py-4`}
          >
            {/* {!isLoading ? ( */}
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${companyData?.logo}`}
              width={200}
              height={200}
              className=" aspect-square rounded-full mx-auto border border-black"
              alt="logo"
              // onLoad={() => {
              //   if (!isLoading) {
              //     setIsLoading(true);
              //   }
              // }}
              // onLoadingComplete={() => setIsLoading(false)}
              // onError={() => setIsLoading(false)}
            />
            {/* ) : (
              <div>Loading...</div>
            )} */}
            <UploadFileToAWS
              prevFileName={companyData?.logo}
              setFileName={(fileName) => {
                setCompanyData((prev) => {
                  return {
                    ...prev,
                    logo: fileName,
                  };
                });
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <InputComp
                id="displayName"
                name="displayName"
                value={companyData?.displayName}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="legalName">Legal Name</Label>
              <InputComp
                id="legalName"
                name="legalName"
                value={companyData?.legalName}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <InputComp
                id="type"
                name="type"
                value={companyData?.type}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="ein">EIN</Label>
              <InputComp
                id="ein"
                name="ein"
                value={companyData?.ein}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="ssn">SSN</Label>
              <InputComp
                id="ssn"
                name="ssn"
                value={companyData?.ssn}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                className=" bg-gray-200"
                id="address"
                name="address"
                value={companyData?.address}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput
                className={" w-full bg-gray-200 disabled:opacity-65"}
                value={companyData?.phone}
                disabled={!isEditing && !isCreating}
                onChange={(phone) => {
                  setCompanyData((prev) => {
                    return {
                      ...prev,
                      phone: phone,
                    };
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <InputComp
                id="email"
                name="email"
                value={companyData?.email}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={companyData?.currencyCode}
                onValueChange={(value) => {
                  setCompanyData((prev) => ({ ...prev, currencyCode: value }));
                }}
              >
                <SelectTrigger
                  disabled={!isEditing && !isCreating}
                  className="w-full"
                >
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center">
                        <span className="mr-2">{currency?.symbol}&nbsp;</span>
                        <span>{currency.name}</span>
                        <span className="ml-auto text-gray-500">
                          ({currency.code})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(isEditing || isCreating) && (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2Icon className=" animate-spin" />
              ) : isCreating ? (
                "Create"
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className=" my-6 flex flex-col items-start gap-4 ">
        <AlertDialog>
          <h1 className=" font-semibold text-lg text-red-500 ">
            Delete Company & all of it's data
          </h1>
          <AlertDialogTrigger asChild>
            <Button
              disabled={user?.role !== "admin"}
              variant="destructive"
              className=" mx-auto w-56"
            >
              Delete Company
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                company account and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} variant="destructive">
                Delete Company
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
