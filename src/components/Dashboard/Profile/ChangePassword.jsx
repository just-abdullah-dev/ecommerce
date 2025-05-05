"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import useUser from "@/contexts/user";
import { Label } from "@/components/ui/label";
import { fetchCustom } from "@/lib/utils";
import InputComp from "@/components/Utils/Input";

export default function ChangePassword({ onClose }) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (!password) {
        toast({
          variant: "destructive",
          description: "Password cannot left empty.",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          description: "Password must match.",
        });
        return;
      }
      const response = await fetchCustom("/user", {
        method: "PUT",
        body: JSON.stringify({
          userId: user?._id,
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
        onClose();
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
        Change Password
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password</Label>
          <InputComp
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <InputComp
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button className="w-full" onClick={handleEdit} disabled={isLoading}>
          {isLoading ? "Updating..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
}
