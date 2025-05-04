import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String }, 
  },
  { timestamps: true }
);

let Category;
try {
  Category = mongoose.model("Category");
} catch (e) {
  Category = mongoose.model("Category", categorySchema);
}

export default Category;