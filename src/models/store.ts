import mongoose from "mongoose";


const socialLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },     
    slug: { type: String, required: true },    
    url: { type: String, required: true },      
  },
  { _id: false } 
);

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    socialLinks: [socialLinkSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

let Store;
try {
  Store = mongoose.model("Store");
} catch (e) {
  Store = mongoose.model("Store", storeSchema);
}

export default Store;