import mongoose from "mongoose";

const soldProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    price: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: String },
    tags: [{ type: String }],
    discount: { type: Number },
  },
  { timestamps: true }
);

let SoldProduct;
try {
  SoldProduct = mongoose.model("SoldProduct");
} catch (e) {
  SoldProduct = mongoose.model("SoldProduct", soldProductSchema);
}

export default SoldProduct;
