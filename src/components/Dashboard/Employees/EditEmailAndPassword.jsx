"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import useUser from "@/contexts/user";
import { Label } from "@/components/ui/label";
import { fetchCustom } from "@/lib/utils";
import InputComp from "@/components/Utils/Input";

export default function EditEmailAndPassword({
  _id,
  email = "",
  isSubAccount,
  isAddSubAccount = false,
  setStep = () => {},
}) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState(email);
  const [password, setPassword] = useState("");

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (!emailData && !isSubAccount) {
        toast({
          variant: "destructive",
          description: "Email cannot be left empty",
        });
        return;
      }
      const response = await fetchCustom("/user", {
        method: "PUT",
        body: JSON.stringify({
          userId: _id,
          email: emailData,
          password,
        }),
        token: user?.token,
      });

      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        setStep(3);
        toast({
          variant: "custom",
          description: "Sub Account Has Been Created.",
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base md:text-xl font-semibold text-custom-gradient">
        {isSubAccount
          ? `${isAddSubAccount ? "Create" : "Edit"} Password`
          : "Edit Email"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {!isSubAccount ? (
          <div>
            <Label htmlFor="email">Email</Label>
            <InputComp
              id="email"
              name="email"
              type="email"
              value={emailData}
              onChange={(e) => {
                setEmailData(e.target.value);
              }}
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="password">Password</Label>
            <InputComp
              id="password"
              name="password"
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        )}
        <Button
          className="w-full mt-6"
          onClick={handleEdit}
          disabled={isLoading}
        >
          {isLoading
            ? "Updating..."
            : isSubAccount
            ? `${isAddSubAccount ? "Create" : "Update"} Password`
            : "Update Email"}
        </Button>
      </div>
    </div>
  );
}
