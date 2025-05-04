import connectDB from "@/lib/db";
import { userManagerGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Product from "@/models/product";
import Review from "@/models/review";
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
    const data = await Review.find()
      .populate({
        path: "productId",
        model: "Product",
        populate: {
          path: "categoryId",
          model: "Category",
        },
      })
      .populate({
        path: "customerId",
        model: "Customer",
        select: "-password",
      });

    if (data.length == 0) {
      return resError(`No review was found.`);
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

    const {
      storeId,
      productId,
      customerId,
      comment,
      rating,
      images,
      videos,
    } = await req.json();

    if (!comment || rating < 0 || rating > 5) {
      return resError("comment and rating required.");
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return resError("customer was not found against given id.");
    }

    let product = await Product.findById(productId);
    if (!product) {
      return resError("product was not found against given id.");
    }
    const review = await Review.create({
      storeId, productId, customerId, comment, rating, images, videos,
    });
    product.reviews.push(review._id);
    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Thanks for your feedback!",
        data: review,
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

    const {
      comment,
      rating,
      images,
      videos,
      _id,
    } = await req.json();

    let review = await Review.findById(_id);
    if (!review) {
      return resError(`review was not found against id: `, _id);
    }
    

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    review.images = images || review.images;
    review.videos = videos || review.videos;
    await review.save();

    const updatedreview = await Review.findById(review?._id);

    return NextResponse.json(
      {
        success: true,
        message: "Review has been updated.",
        data: updatedreview,
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
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    if (!_id) {
      return resError("review ID (_id) required in search params.");
    }
    let review = await Review.findByIdAndDelete(_id);
    if (!review) {
      return resError(`review was not found against id: `, _id);
    }
    return NextResponse.json({
      success: true,
      message: "review has been removed.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
