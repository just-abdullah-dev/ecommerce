import connectDB from "@/lib/db";
import {
  userManagerGuard,
} from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Category from "@/models/category";
import Product from "@/models/product";

//
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }
    const data = await Category.find({ storeId });

    if (data.length == 0) {
      return resError(`No category was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 17.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userManagerGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { name, description, slug } = await req.json();

    if (!name || !slug) {
      return resError("Name and slug are required.");
    }

    
    let category = await Category.findOne({ slug });
    if (category) {
      return resError("This slug is already in use.");
    }



    category = await Category.create({
      name,
      description,
      slug,
      storeId: authData?.data?.storeId?._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category has been created.",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 18.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userManagerGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { name, description, slug, _id } =
      await req.json();

    let category = await Category.findById(_id);
    if (!category) {
      return resError(
        `category was not found against id: `,
        _id
      );
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.slug = slug || category.slug;

    await category.save();

    const updatedCategory = await Category.findById(category?._id)

    return NextResponse.json(
      {
        success: true,
        message: " Category has been updated.",
        data: updatedCategory,
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
      return resError("Category ID (_id) required in search params.");
    }
    const products = await Product.find({categoryId: _id});
    if(products.length > 0) {
      return resError("This category contains products first assign another OR create new category for them.");
    }
    let category = await Category.findByIdAndDelete(_id);
    if (!category) {
      return resError(
        `Category was not found against id: `,
        _id
      );
    }
    return NextResponse.json({
      success: true,
      message:
        "Category Deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
