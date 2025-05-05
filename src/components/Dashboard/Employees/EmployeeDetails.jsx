import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputComp from "@/components/Utils/Input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForInput } from "@/lib/utils";
import useUser from "@/contexts/user";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function EmployeeDetails({ details, setDetails }) {
  const handleChangePersonalInfo = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };
  const handleChangeJobInfo = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        [name]: value,
      },
    }));
  };
  const user = useUser();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Employee Details
      </h3>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <InputComp
              id="title"
              name="title"
              value={details.personalInfo?.title}
              onChange={handleChangePersonalInfo}
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <InputComp
              id="firstName"
              name="firstName"
              value={details.personalInfo?.firstName}
              onChange={handleChangePersonalInfo}
            />
          </div>
          <div>
            <Label htmlFor="middleName">Middle Name</Label>
            <InputComp
              id="middleName"
              name="middleName"
              value={details.personalInfo?.middleName}
              onChange={handleChangePersonalInfo}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <InputComp
              id="lastName"
              name="lastName"
              value={details.personalInfo?.lastName}
              onChange={handleChangePersonalInfo}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email-random">Email</Label>
            <InputComp
              id="email-random"
              autoComplete="off"
              name="email-random"
              type="text"
              value={details.email}
              onChange={(e) => {
                setDetails((prev) => {
                  return {
                    ...prev,
                    email: e.target.value,
                  };
                });
              }}
            />
          </div>
          {/* <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={details.role}
              onValueChange={(value) => setDetails({ ...details, role: value })}
            >
              <SelectTrigger className=" bg-gray-200" id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {user?.role === "admin" && (
                  <SelectItem value="admin">Admin</SelectItem>
                )}
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              className={" w-full bg-gray-200"}
              value={details.personalInfo?.phone}
              onChange={(phone) => {
                setDetails({
                  ...details,
                  personalInfo: {
                    ...details.personalInfo,
                    phone: phone,
                  },
                });
              }}
            />
          </div>
        </div>
        <h1 className=" mt-2 text-xl font-semibold text-custom-gradient">
          Job Information
        </h1>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <InputComp
              id="employeeId"
              name="employeeId"
              type="text"
              placeholder="Left empty for auto ID"
              value={details.jobInfo?.employeeId}
              onChange={handleChangeJobInfo}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <InputComp
              id="department"
              name="department"
              type="text"
              placeholder="e.g: Admin, HR, etc"
              value={details.jobInfo?.department}
              onChange={handleChangeJobInfo}
            />
          </div>
          <div>
            <Label htmlFor="jobRole">Job Role</Label>
            <InputComp
              id="jobRole"
              name="jobRole"
              type="text"
              placeholder="e.g: Jnr Engineer, etc"
              value={details.jobInfo?.jobRole}
              onChange={handleChangeJobInfo}
            />
          </div>
          <div>
            <Label htmlFor="joinDate">Join Date</Label>
            <InputComp
              id="joinDate"
              name="joinDate"
              type="date"
              value={formatDateForInput(details.jobInfo?.joinDate)}
              onChange={handleChangeJobInfo}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            className="bg-gray-200"
            value={details.personalInfo?.address}
            onChange={handleChangePersonalInfo}
          />
        </div>
      </div>
    </div>
  );
}