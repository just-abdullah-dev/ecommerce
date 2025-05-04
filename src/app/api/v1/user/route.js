import connectDB from "@/lib/db";
import {
  userAdminGuard,
  userAuthGuard,
} from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import User from '@/models/user';

//
export async function GET(req) {
  try {
    await connectDB();
    // admin gaurd
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const data = await User.find()
      .select("-password")
      .populate({
        path: "storeId",
        populate: {
          path: "createdBy",
        },
      });

    if (data.length == 0) {
      return resError(`Users not found.`);
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

    let { email, password, name, storeId, role } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }
    if (password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    if (!name) {
      return resError("Name cannot be empty.");
    }

    let user = await User.findOne({ email });
    if (user) {
      return resError("Email already registerd.");
    }

    user = await User.create({
        name,
      email,
      password,
      role: role ? "admin" : role,
      storeId: storeId ? storeId : null
    });
   

    return NextResponse.json(
      {
        success: true,
        message: "Account Created Successfully.",
        data: {
          ...user?._doc,
          password: null,
          token: await user.generateJWT(),
        },
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
    const { password, name, _id } = await req.json();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (password && password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    let user = await User.findById(_id);
    if (!user) {
      return resError("User was not found.");
    }

    user.password = password || user.password;
    user.name = name || user.name;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Updated.",
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
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { _id } = await req.json(); //means _id

    let user = await User.findByIdAndDelete(_id);
    if (!user) {
      return resError(`User was not found against id: ` + employeeId);
    }

    return NextResponse.json({
      success: true,
      message: "Deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
