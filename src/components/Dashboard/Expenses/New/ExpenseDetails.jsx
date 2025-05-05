import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputComp from "@/components/Utils/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateForInput } from "@/lib/utils";

export default function ExpenseDetails({ details, setDetails }) {
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value) => {
    setDetails((prev) => ({ ...prev, type: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Expense Details
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <InputComp
            id="title"
            name="title"
            value={details.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={handleTypeChange} value={details.type}>
            <SelectTrigger className="w-full bg-gray-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bill">Bill</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="totalAmount">Total Amount</Label>
          <InputComp
            id="totalAmount"
            name="totalAmount"
            type="number"
            value={details.totalAmount}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <InputComp
            id="date"
            name="date"
            type="date"
            value={formatDateForInput(details.date)}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="from">From Date</Label>
          <InputComp
            id="from"
            name="from"
            type="date"
            value={formatDateForInput(details.from)}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="to">To Date</Label>
          <InputComp
            id="to"
            name="to"
            type="date"
            value={formatDateForInput(details.to)}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="desc">Description</Label>
        <Textarea
          id="desc"
          name="desc"
          className="bg-gray-200"
          value={details.desc}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
