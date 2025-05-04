import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    tags: [{ type: String }],
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldProduct" }],
    actualPrice: { type: Number },
    discount: { type: Number },
  },
  { timestamps: true }
);

let SoldOffer;
try {
  SoldOffer = mongoose.model("SoldOffer");
} catch (e) {
  SoldOffer = mongoose.model("SoldOffer", offerSchema);
}

export default SoldOffer;
