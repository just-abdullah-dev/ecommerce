import connectDB from "@/lib/db";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Store from "@/models/store";
import Category from "@/models/category";
import Product from "@/models/product";
import Offer from "@/models/offer";
import Customer from "@/models/customer";
import Order from "@/models/order";
import SoldProduct from "@/models/soldproduct";
import Review from "@/models/review";

//
export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }

    if (password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return resError("Email is not registered.");
    }
    if (await user.comparePassword(password)) {
      const user2 = await User.findOne({ email })
        .select("-password")
        .populate({
          path: "storeId",
          populate: {
            path: "createdBy",
            select: "-password",
          },
        });
      return NextResponse.json(
        {
          success: true,
          data: {
            ...user2?._doc,
            token: await user.generateJWT(),
          },
        },
        { status: 200 }
      );
    } else {
      return resError("Invalid Password!");
    }
  } catch (error) {
    return resError(error?.message);
  }
}
