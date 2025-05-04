import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import User from "@/models/user";
import Store from "@/models/store";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }

    const store = await Store.findById(storeId).populate({
      path: "createdBy",
      select: "-password",
    });
    if (!store) {
      return resError("Store was not found.");
    }

    return NextResponse.json({ success: true, data: store }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 17.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { name, description, logo, address, phone, email, socialLinks } =
      await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }

    if (!name) {
      return resError("Name is required.");
    }

    let store = await Store.findOne({ email });
    if (store) {
      return resError("Email already registerd with other store.");
    }

    store = await Store.create({
      name,
      description,
      logo,
      address,
      phone,
      email,
      socialLinks,
      createdBy: authData?.data?._id,
    });

    let user = await User.findById(authData?.data?._id);
    user.storeId = store?._id;
    await user.save();

    const updatedStore = await Store.findById(store?._id).populate({
      path: "createdBy",
      select: "-password",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Store has been created successfully.",
        data: updatedStore,
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
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { name, description, logo, address, phone, email, socialLinks } =
      await req.json();

    let store = await Store.findById(authData?.data?.storeId?._id);
    if (!store) {
      return resError(
        `Store was not found against id: `,
        authData?.data?.storeId?._id
      );
    }

    store.name = name || store.name;
    store.description = description || store.description;
    store.logo = logo || store.logo;
    store.address = address || store.address;
    store.phone = phone || store.phone;
    store.email = email || store.email;
    store.socialLinks = socialLinks || store.socialLinks;

    await store.save();

    const updatedStore = await Store.findById(store?._id).populate({
      path: "createdBy",
      select: "-password",
    });

    return NextResponse.json(
      {
        success: true,
        message: " Store has been updated successfully.",
        data: updatedStore,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 20.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let company = await Store.findByIdAndDelete(authData?.data?.storeId?._id);
    if (!company) {
      return resError(
        `Store was not found against id: `,
        authData?.data?.storeId?._id
      );
    }

    // after finding store we have to delete it and it's all relative data, will implement this api later.

    return NextResponse.json({
      success: true,
      message:
        "Store Deleted. But its relevant things are still there, deelte them as well.(update api)",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
