import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String }, 
    images: [{ type: String }],
    videos: [{ type: String }],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    subCategory: { type: String },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    discount: { type: Number },
  },
  { timestamps: true }
);

let Product;
try {
  Product = mongoose.model("Product");
} catch (e) {
  Product = mongoose.model("Product", productSchema);
}

export default Product;