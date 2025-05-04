
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Document, Model, Schema, model, Types } from "mongoose";

// Define the interface for the User document
interface IUser extends Document {
    name: string;
    email: string;
  password: string;
  storeId?: Types.ObjectId;
  role: "manager" | "admin" | "inventory" | "sales";
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
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "inventory", "sales"],
      required: true,
    },
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
  return sign({ id: this._id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return compare(enteredPassword, this.password);
};

// Create the model if not exist
let User: IUserModel;
try {
  User = model<IUser, IUserModel>("User");
} catch (e) {
  User  = model<IUser, IUserModel>("User", userSchema);
}

export default User;