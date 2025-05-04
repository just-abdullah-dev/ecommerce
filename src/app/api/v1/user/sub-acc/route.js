import connectDB from "@/lib/db";
import {
  userAdminGuard
} from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import User from '@/models/user';


// 
export async function PUT(req) {
  try {
    await connectDB();
    const { email, role, _id } = await req.json();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let user = await User.findById(_id);
    if (!user) {
      return resError("User was not found.");
    }

    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Updated Sub-Account.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}