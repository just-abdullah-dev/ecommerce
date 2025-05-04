import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    rating: { type: Number },
    comment: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

let Review;
try {
  Review = mongoose.model("Review");
} catch (e) {
  Review = mongoose.model("Review", reviewSchema);
}

export default Review;