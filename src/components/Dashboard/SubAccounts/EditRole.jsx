"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import useUser from "@/contexts/user";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCustom } from "@/lib/utils";

export default function EditRole({ _id, role, isAddSubAccount = false, setStep=()=>{} }) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [roleData, setRoleData] = useState(role);

  const handleEditRole = async () => {
    setIsLoading(true);
    try {
      if (!roleData) {
        toast({
          variant: "destructive",
          description: "Select any role please!",
        });
        return;
      }
      const response = await fetchCustom("/user/role", {
        method: "PUT",
        body: JSON.stringify({
          userId: _id,
          role: roleData,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        if(isAddSubAccount){
          setStep(2);
        }
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating employee role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base md:text-xl font-semibold text-custom-gradient">
        {isAddSubAccount ? "Select Role" : "Edit Role"}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            value={roleData}
            onValueChange={(value) => setRoleData(value)}
          >
            <SelectTrigger className=" bg-gray-200" id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full"
          onClick={handleEditRole}
          disabled={isLoading}
        >
          {isLoading ? "Updating Role..." : "Update Role"}
        </Button>
      </div>
    </div>
  );
}
