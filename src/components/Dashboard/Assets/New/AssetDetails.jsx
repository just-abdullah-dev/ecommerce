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

export default function AssetDetails({ details, setDetails }) {
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value) => {
    setDetails((prev) => ({ ...prev, type: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Asset Details
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
          <Label htmlFor="quantity">Quantity</Label>
          <InputComp
            id="quantity"
            name="quantity"
            value={details.quantity}
            onChange={handleChange}
          />
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
          <Label htmlFor="date">Purchase Date</Label>
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
