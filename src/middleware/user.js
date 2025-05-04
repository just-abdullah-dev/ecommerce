import User from "@/models/user";
const { verify } = require("jsonwebtoken");

export const userAuthGuard = async (req) => {
  try {
    const headers = req.headers;
    const token = headers.get("authorization").split(" ")[1];
    const { id } = verify(token, process.env.JWT_SECRET);
    const data = await User.findById(id)
      .select("-password")
      .populate({
        path: "storeId",
      });
    return { success: true, message: "Token verified", data };
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userAdminGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "admin") {
        console.log("verified - user is admin.");
        return {
          success: true,
          message: "Token verified - User is Admin",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not an admin",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userManagerGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "manager" || authData?.data?.role === "admin") {
        return {
          success: true,
          message: "Token verified - User is Manager",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a Manager",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};


export const userSalesGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "sales" ||
        authData?.data?.role === "manager" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is Sales Member",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a Sales Member",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};
