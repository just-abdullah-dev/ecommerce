import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputComp from "@/components/Utils/Input";
import { formatDateForInput } from "@/lib/utils";

export default function InvoiceDetails({ details, setDetails }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (["tax", "discount"].includes(name)) {
      const num = parseFloat(value);
      updatedValue = isNaN(num) ? null : Math.abs(num);
    }

    setDetails({ ...details, [name]: updatedValue });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Invoice Details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <InputComp
            id="issueDate"
            name="issueDate"
            type="date"
            value={formatDateForInput(details.issueDate)}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <InputComp
            id="dueDate"
            name="dueDate"
            type="date"
            value={formatDateForInput(details.dueDate)}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="tax">Tax (%)</Label>
          <InputComp
            id="tax"
            name="tax"
            type="number"
            value={details.tax}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <InputComp
            id="discount"
            name="discount"
            type="number"
            value={details.discount}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          className=" bg-gray-200"
          id="notes"
          name="notes"
          value={details.notes}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
