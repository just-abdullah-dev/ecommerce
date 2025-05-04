import connectDB from "@/lib/db";
import { userManagerGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Offer from "@/models/offer";
import Category from "@/models/category";
import SoldProduct from "@/models/soldproduct";

//
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }
    const data = await SoldProduct.find({ storeId }).populate({
      path: "orderId",
      model: "Order",
    });

    if (data.length == 0) {
      return resError(`No sold product was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}
