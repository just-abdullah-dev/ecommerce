import connectDB from "@/lib/db";
import { userManagerGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Offer from "@/models/offer";
import Category from "@/models/category";
import SoldOffer from "@/models/soldoffer";

//
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }
    const data = await SoldOffer.find({ storeId }).populate({
      path: "orderId",
      model: "Order",
    }).populate({
      path: "productIds",
      model: "SoldProduct",
      populate: {
        path: "categoryId",
        model: "Category",
      },
    });

    if (data.length == 0) {
      return resError(`No sold offer was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

