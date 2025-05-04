import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    offerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldOffer" }],
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldProduct" }],
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"], 
      required: true,
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending", // Order received, payment processing
        "processing", // Preparing for shipment
        "shipped", // Sent to customer
        "delivered", // Received by customer
        "cancelled", // Order cancelled
        "returned", // Items returned
      ],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod"],
      required: true,
      default: "cod",
    },
    shippingAddress: { type: String, required: true },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

let Order;
try {
  Order = mongoose.model("Order");
} catch (e) {
  Order = mongoose.model("Order", orderSchema);
}

export default Order;
