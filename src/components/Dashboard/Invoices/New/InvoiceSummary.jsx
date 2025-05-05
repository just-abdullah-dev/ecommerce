import useCurrency from "@/hooks/useCurrency";

export default function InvoiceSummary({ items, tax, discount }) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0,
  );
  const taxAmount = subtotal * (tax / 100);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + taxAmount - discountAmount;

  const currency = useCurrency();
  return (
    <div className="space-y-2 max-w-xl ">
      <h3 className="text-xl font-semibold text-custom-gradient">Summary</h3>
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>
          +{currency?.symbol}&nbsp;{subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Tax ({tax}%):</span>
        <span>
          +{currency?.symbol}&nbsp;{taxAmount.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Discount ({discount}%):</span>
        <span>
          -{currency?.symbol}&nbsp;{discountAmount.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-xl font-bold">
        <span>Total:</span>
        <span>
          {currency?.symbol}&nbsp;{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
