import connectDB from "@/lib/db";
import { userManagerGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Product from "@/models/product";
import Category from "@/models/category";

//
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }
    const data = await Product.find({ storeId }).populate("categoryId");

    if (data.length == 0) {
      return resError(`No product was found.`);
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
      price,
      stock,
      categoryId,
      subCategory,
      tags,
      isPublished,
      discount,
    } = await req.json();

    if (!title || !slug || !price) {
      return resError("title, price and slug are required.");
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return resError("Category was not found against given id.");
    }

    let product = await Product.findOne({ slug });
    if (product) {
      return resError("This slug is already in use.");
    }

    product = await Product.create({
      title,
      description,
      slug,
      images,
      videos,
      price,
      stock,
      categoryId,
      subCategory,
      tags,
      isPublished,
      discount,
      storeId: authData?.data?.storeId?._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product has been created.",
        data: product,
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
      price,
      stock,
      categoryId,
      subCategory,
      tags,
      isPublished,
      discount,
      _id,
    } = await req.json();

    let product = await Product.findById(_id);
    if (!product) {
      return resError(`product was not found against id: `, _id);
    }
    if (product.categoryId !== categoryId && categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return resError("Category was not found against given id.");
      }
      product.categoryId = categoryId;
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.slug = slug || product.slug;
    product.images = images || product.images;
    product.videos = videos || product.videos;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.tags = tags || product.tags;
    product.discount = discount || product.discount;
    product.subCategory = subCategory || product.subCategory;
    product.isPublished = isPublished === undefined ? product.isPublished: isPublished;
    

    await product.save();

    const updatedproduct = await Product.findById(product?._id);

    return NextResponse.json(
      {
        success: true,
        message: "Product has been updated.",
        data: updatedproduct,
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
      return resError("product ID (_id) required in search params.");
    }
    let product = await Product.findByIdAndDelete(_id);
    if (!product) {
      return resError(`product was not found against id: `, _id);
    }
    return NextResponse.json({
      success: true,
      message: "product Deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
