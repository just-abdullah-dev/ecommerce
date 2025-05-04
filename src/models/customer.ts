import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Document, Model, Schema, model, Types } from "mongoose";

// Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  googleId: string;
  password: string;
  isAccountCreated: boolean;
  storeId?: Types.ObjectId;
  generateJWT(): Promise<string>;
  comparePassword(enteredPassword: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the interface for the User model (static methods would go here)
interface IUserModel extends Model<IUser> {}

// Create the schema
const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    googleId: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    isAccountCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

// Method to generate JWT
userSchema.methods.generateJWT = async function (): Promise<string> {
  return sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return compare(enteredPassword, this.password);
};

// Create the model
let Customer: IUserModel;
try {
  Customer = model<IUser, IUserModel>("Customer");
} catch (e) {
  Customer  = model<IUser, IUserModel>("Customer", userSchema);
}

export default Customer;
