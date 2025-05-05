import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputComp from "@/components/Utils/Input";

export function PayrollDetails({ details, setDetails }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Payroll Details
      </h3>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="salaryType">Salary Type</Label>
            <Select
              value={details.salaryType}
              onValueChange={(value) =>
                setDetails({ ...details, salaryType: value })
              }
            >
              <SelectTrigger className=" bg-gray-200" id="salaryType">
                <SelectValue placeholder="Select salary type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {details.salaryType === "fixed" && (
            <div>
              <Label htmlFor="salary">Salary</Label>
              <InputComp
                id="salary"
                name="salary"
                type="number"
                value={details.salary}
                onChange={handleChange}
              />
            </div>
          )}
          {details.salaryType === "hourly" && (
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate</Label>
              <InputComp
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                value={details.hourlyRate}
                onChange={handleChange}
              />
            </div>
          )}
          <div>
            <Label htmlFor="bonus">Bonus (%) e.g 10 means 10%</Label>
            <InputComp
              id="bonus"
              name="bonus"
              type="number"
              value={details.bonus}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="tax">Tax (%) e.g 6 means 6%</Label>
            <InputComp
              id="tax"
              name="tax"
              type="number"
              value={details.tax}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="overtimeHourlyRate">Overtime Hourly Rate</Label>
            <InputComp
              id="overtimeHourlyRate"
              name="overtimeHourlyRate"
              type="number"
              value={details.overtimeHourlyRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
