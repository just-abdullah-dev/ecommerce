import connectDB from "@/lib/db";
import { userManagerGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Offer from "@/models/offer";
import Category from "@/models/category";
import Customer from "@/models/customer";

//
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }
    // add auth guard here
    const data = await Customer.find().select("-password");

    if (data.length == 0) {
      return resError(`No customer was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

//
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userManagerGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const {
      title,
      description,
      slug,
      images,
      videos,
      actualPrice,
      discount,
      productIds,
      isActive,
    } = await req.json();

    if (!title || !slug || !actualPrice) {
      return resError("title, totalPrice and slug are required.");
    }

    let offer = await Offer.findOne({ slug });
    if (offer) {
      return resError("This slug is already in use.");
    }

    offer = await Offer.create({
      title,
      description,
      slug,
      images,
      videos,
      actualPrice,
      discount,
      productIds,
      isActive,
      storeId: authData?.data?.storeId?._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "offer has been created.",
        data: offer,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

//
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userManagerGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const {
      title,
      description,
      slug,
      images,
      videos,
      actualPrice,
      discount,
      productIds,
      isActive,
      tags,
      _id,
    } = await req.json();

    let offer = await Offer.findById(_id);
    if (!offer) {
      return resError(`offer was not found against id: `, _id);
    }

    offer.title = title || offer.title;
    offer.description = description || offer.description;
    offer.slug = slug || offer.slug;
    offer.images = images || offer.images;
    offer.videos = videos || offer.videos;
    offer.actualPrice = actualPrice || offer.actualPrice;
    offer.productIds = productIds || offer.productIds;
    offer.tags = tags || offer.tags;
    offer.discount = discount || offer.discount;
    offer.isActive = isActive === undefined ? offer.isActive : isActive;

    await offer.save();

    const updatedoffer = await Offer.findById(offer?._id);

    return NextResponse.json(
      {
        success: true,
        message: "offer has been updated.",
        data: updatedoffer,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

//
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userManagerGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    if (!_id) {
      return resError("offer ID (_id) required in search params.");
    }
    let offer = await Offer.findByIdAndDelete(_id);
    if (!offer) {
      return resError(`offer was not found against id: `, _id);
    }
    return NextResponse.json({
      success: true,
      message: "offer Deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
