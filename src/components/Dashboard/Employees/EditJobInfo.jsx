"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import useUser from "@/contexts/user";
import { Label } from "@/components/ui/label";
import { fetchCustom, formatDateForInput } from "@/lib/utils";
import InputComp from "@/components/Utils/Input";
import { Textarea } from "@/components/ui/textarea";
import { PenBoxIcon } from "lucide-react";

export default function EditJobInfo({ jobInfo }) {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(jobInfo);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (!details?.employeeId) {
        toast({
          variant: "destructive",
          description: "First name cannot be left empty",
        });
        return;
      }
      const response = await fetchCustom("/user/job-info", {
        method: "PUT",
        body: JSON.stringify({
          ...details,
          jobInfoId: details?._id,
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
      console.error("Error updating user job info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between w-full relative">
        <h3 className="text-base md:text-xl font-semibold text-custom-gradient">
          Edit Job Information
        </h3>
      </div>
      <div
        className={`${
          isEditing
            ? "pointer-events-auto opacity-100"
            : "opacity-75 pointer-events-none "
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <InputComp
              id="employeeId"
              name="employeeId"
              value={details?.employeeId}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <InputComp
              id="department"
              name="department"
              value={details?.department}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="jobRole">Job Role</Label>
            <InputComp
              id="jobRole"
              name="jobRole"
              value={details?.jobRole}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="joinDate">Join Date</Label>
            <InputComp
              id="joinDate"
              name="joinDate"
              type="date"
              value={formatDateForInput(details?.joinDate)}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <Button className="w-full mt-6" onClick={handleEdit} disabled={isLoading}>
        {isLoading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}
