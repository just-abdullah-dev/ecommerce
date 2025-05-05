"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import useUser from "@/contexts/user";
import { Label } from "@/components/ui/label";
import { fetchCustom } from "@/lib/utils";
import InputComp from "@/components/Utils/Input";

export default function EditEmailAndAbout({ _id, email }) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState(email);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (!emailData) {
        toast({
          variant: "destructive",
          description: "Email cannot be left empty",
        });
        return;
      }
      const response = await fetchCustom("/client", {
        method: "PUT",
        body: JSON.stringify({
          clientId: _id,
          email: emailData,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base md:text-xl font-semibold text-custom-gradient">
        Edit Email
      </h3>

      <div className="grid grid-cols-2 gap-4">
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

        <Button
          className="w-full mt-6"
          onClick={handleEdit}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Email"}
        </Button>
      </div>
    </div>
  );
}
