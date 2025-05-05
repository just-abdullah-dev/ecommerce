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

export default function IncomeDetails({ details, setDetails }) {
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  // const handleTypeChange = (value) => {
  //   setDetails((prev) => ({ ...prev, type: value }));
  // };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Income Details
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* <div>
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={handleTypeChange} value={details.type}>
            <SelectTrigger className="w-full bg-gray-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

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
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          className="bg-gray-200"
          value={details.notes}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
