import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    tags: [{ type: String }],
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    actualPrice: { type: Number },
    discount: { type: Number },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let Offer;
try {
  Offer = mongoose.model("Offer");
} catch (e) {
  Offer = mongoose.model("Offer", offerSchema);
}

export default Offer;