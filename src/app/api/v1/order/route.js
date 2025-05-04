import connectDB from "@/lib/db";
import { userManagerGuard, userSalesGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Order from "@/models/order";
import Category from "@/models/category";
import Customer from "@/models/customer";
import Offer from "@/models/offer";
import Product from "@/models/product";
import SoldProduct from "@/models/soldproduct";
import SoldOffer from "@/models/soldoffer";
import sendMail from "@/utils/sendMail";

//
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
      return resError("Store ID (storeId) required in search params.");
    }
    const orderId = searchParams.get("orderId");
    console.log("orderId", orderId);

    let data;
    if (orderId) {
      data = await Order.findById(orderId)
        .populate({
          path: "customerId",
          select: "-password",
          model: "Customer",
        })
        .populate({
          path: "offerIds",
          model: "SoldOffer",
          populate: {
            path: "productIds",
            model: "SoldProduct",
            populate: {
              path: "categoryId",
              model: "Category",
            },
          },
        })
        .populate({
          path: "productIds",
          model: "SoldProduct",
        });
    } else {
      data = await Order.find({ storeId }).populate({
        path: "customerId",
        select: "-password",
        model: "Customer",
      });
    }

    if (data.length == 0) {
      return resError(`No order was found.`);
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
      customerId,
      customer,
      // {
      //   name,
      //   email,
      //   googleId, if using google
      //   phone,
      //   address
      // }
      offerIds,
      productIds,
      paymentStatus,
      paymentMethod,
      shippingAddress,
      totalAmount,
    } = await req.json();

    if (!shippingAddress) {
      return resError("Shipping Address is required.");
    }
    let customerData = null;
    if (customerId) {
      customerData = await Customer.findById(customerId);
      if (!customerData) {
        return resError(`Customer was not found against id: `, customerId);
      }
    } else {
      let pw = generatePassword();
      customerData = await Customer.create({ ...customer, password: pw });
      await sendMailToCustomerAbtAccount({ ...customerData?._doc, password: pw });
      pw = "";
    }

    let calculateTotalAmount = 0;

    const offerPromises =
      offerIds && offerIds.length > 0
        ? offerIds.map(
            async (id) =>
              await Offer.findById(id).populate({
                path: "productIds",
                model: "Product",
                populate: {
                  path: "categoryId",
                  model: "Category",
                },
              })
          )
        : [];

    const productPromises =
      productIds && productIds.length > 0
        ? productIds.map(
            async (id) =>
              await Product.findById(id).populate({
                path: "categoryId",
                model: "Category",
              })
          )
        : [];

    const offerResults = await Promise.all(offerPromises);

    for (const item of offerResults) {
      if (!item) {
        return resError("Offer not found.");
      }

      calculateTotalAmount +=
        item.actualPrice - (item.actualPrice * item.discount) / 100;
    }

    const results = await Promise.all(productPromises);

    for (const item of results) {
      if (!item) {
        return resError("product not found.");
      }

      calculateTotalAmount += item.price - (item.price * item.discount) / 100;
    }

    // ✅ This runs *after* all promises are fully resolved and processed
    if (totalAmount !== calculateTotalAmount) {
      return resError("Total amount is not matching with calculated amount.");
    }

    let order = await Order.create({
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalAmount: calculateTotalAmount,
      customerId: customerData?._id,
      storeId,
    });

    let soldOffers = [];

    const offerResults2 = await Promise.all(offerPromises);

    for (const item of offerResults2) {
      if (!item) return resError("Offer not found.");

      let soldProducts = await Promise.all(
        item.productIds.map(async (product) => {
          const productFor = await Product.findById(product?._id);
          productFor.stock -= 1;
          await productFor.save();

          const soldProduct = await SoldProduct.create({
            ...product?._doc,
            _id: undefined,
            orderId: order?._id,
            discount: item.discount,
            productId: product._id,
          });

          return soldProduct._id;
        })
      );

      const soldOffer = await SoldOffer.create({
        ...item?._doc,
        _id: undefined,
        orderId: order?._id,
        productIds: soldProducts,
        offerId: item._id,
      });

      soldOffers.push(soldOffer._id);
    }

    order.offerIds = soldOffers;

    // --------------------------------

    let soldProducts = [];

    const productResults = await Promise.all(productPromises);
    for (const item of productResults) {
      if (!item) return resError("Product not found.");

      const productFor = await Product.findById(item?._id);
      productFor.stock -= 1;
      await productFor.save();

      const soldProduct = await SoldProduct.create({
        ...item?._doc,
        _id: undefined,
        orderId: order?._id,
        productId: item._id,
      });

      soldProducts.push(soldProduct._id);
    }

    order.productIds = soldProducts;

    await order.save();

    const updatedOrder = await Order.findById(order?._id)
      .populate({
        path: "customerId",
        select: "-password",
        model: "Customer",
      })
      .populate({
        path: "offerIds",
        model: "SoldOffer",
        populate: {
          path: "productIds",
          model: "SoldProduct",
          populate: {
            path: "categoryId",
            model: "Category",
          },
        },
      })
      .populate({
        path: "productIds",
        model: "SoldProduct",
      });

    await sendMailToCustomerAbtOrder(updatedOrder);

    return NextResponse.json(
      {
        success: true,
        message: "order has been created.",
        data: updatedOrder,
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
      _id,
      paymentStatus,
      orderStatus
    } = await req.json();

    let order = await Order.findById(_id);
    if (!order) {
      return resError(`order was not found against id: `, _id);
    }

    order.paymentStatus = paymentStatus || order.paymentStatus;
    order.orderStatus = orderStatus || order.orderStatus;

    await order.save();

    const updatedorder = await Order.findById(order?._id)
    .populate({
      path: "customerId",
      select: "-password",
      model: "Customer",
    })
    .populate({
      path: "offerIds",
      model: "SoldOffer",
      populate: {
        path: "productIds",
        model: "SoldProduct",
        populate: {
          path: "categoryId",
          model: "Category",
        },
      },
    })
    .populate({
      path: "productIds",
      model: "SoldProduct",
    });
    await sendMailToCustomerAbtOrder(updatedorder);

    return NextResponse.json(
      {
        success: true,
        message: "order has been updated.",
        data: updatedorder,
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
      return resError("order ID (_id) required in search params.");
    }
    let order = await Order.findByIdAndDelete(_id);
    if (!order) {
      return resError(`order was not found against id: `, _id);
    }
    order.offerIds.forEach(async (offerId) => {
      await SoldOffer.findByIdAndDelete(offerId);
    });
    order.productIds.forEach(async (productId) => {
      await SoldProduct.findByIdAndDelete(productId);
    });

    return NextResponse.json({
      success: true,
      message: "order Deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}

async function sendMailToCustomerAbtAccount(customer) {
  const subject = "🎉 Account Created Successfully";

  const message = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; color: #333;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color: #4CAF50;">Welcome, ${customer.name}!</h2>
        <p>Your account has been <strong>successfully created</strong>. 🎉</p>
        
        <p style="margin-top: 20px;"><strong>Here are your login credentials:</strong></p>
        <p>Email: <span style="color: #555;">${customer.email}</span><br>
        Password: <span style="color: #555;">${customer.password}</span></p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

        <p>If you have any questions or need support, feel free to contact us.</p>
       <p>Email: <a href="mailto:${process.env.STORE_SUPPORT_EMAIL}" style="color: #4CAF50; text-decoration: none;">${process.env.STORE_SUPPORT_EMAIL}</a></p>


      <p style="margin-top: 30px;">Best regards,<br><strong>${process.env.STORE_NAME}</strong></p>
      </div>
    </div>
  `;

  await sendMail(customer.email, subject, message);
  console.log("Email sent to customer about account creation:", customer.email);
}

async function sendMailToCustomerAbtOrder(order) {
  let subject = "";
  let message = "";

  const formatProducts = (products) => {
    if (!products || products.length === 0) return "";
    
    return `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Product</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Price</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Discount</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; vertical-align: top;">
                <strong>${product.title}</strong>
                ${product.images?.[0] ? `<br><img src="${product.images[0]}" alt="${product.title}" style="max-width: 80px; max-height: 80px; margin-top: 5px;">` : ''}
              </td>
              <td style="padding: 12px; border: 1px solid #ddd; vertical-align: top;">${product.description || '-'}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; vertical-align: top;">${product.price}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; vertical-align: top;">${product.discount || 0}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; vertical-align: top;">
                ${product.price - (product.price * (product.discount || 0) / 100)}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  };

  const formatOffers = (offers) => {
    if (!offers || offers.length === 0) return "";
    
    return offers.map(offer => `
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0; color: #4CAF50;">${offer.title}</h3>
        <p>${offer.description || ''}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; width: 120px;"><strong>Actual Price:</strong></td>
            <td style="padding: 8px;">${offer.actualPrice}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Discount:</strong></td>
            <td style="padding: 8px;">${offer.discount || 0}%</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Final Price:</strong></td>
            <td style="padding: 8px;">
              ${offer.actualPrice - (offer.actualPrice * (offer.discount || 0) / 100)}
            </td>
          </tr>
        </table>
        
        ${offer.productIds && offer.productIds.length > 0 ? `
          <h4 style="margin-bottom: 10px;">Included Products:</h4>
          ${formatProducts(offer.productIds)}
        ` : ''}
      </div>
    `).join("");
  };

  const baseTemplate = (content) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 800px; margin: 0 auto;">
      ${content}
      <p style="margin-top: 30px;">Best regards,<br><strong>${process.env.STORE_NAME}</strong></p>
      <p>If you have any questions, contact us at <a href="mailto:${process.env.STORE_SUPPORT_EMAIL}" style="color: #4CAF50; text-decoration: none;">${process.env.STORE_SUPPORT_EMAIL}</a></p>
    </div>
  `;

  const orderDetailsSection = `
    <div style="margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="margin-top: 0;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; width: 150px;"><strong>Order ID:</strong></td>
          <td style="padding: 8px;">${order?._id}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Order Status:</strong></td>
          <td style="padding: 8px;">${order?.orderStatus}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Order Date:</strong></td>
          <td style="padding: 8px;">${new Date(order?.createdAt).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Payment Method:</strong></td>
          <td style="padding: 8px;">${order?.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Payment Status:</strong></td>
          <td style="padding: 8px;">${order?.paymentStatus}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Total Amount:</strong></td>
          <td style="padding: 8px;">${order?.totalAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Shipping Address:</strong></td>
          <td style="padding: 8px;">${order?.shippingAddress}</td>
        </tr>
      </table>
    </div>
  `;

  switch (order?.orderStatus) {
    case "pending":
      subject = "Your Order Is Being Processed";
      message = baseTemplate(`
        <h2 style="color: #FFA500;">⏳ Your Order Is Being Processed</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>We've received your order and it's currently being processed. We'll notify you once it's ready for shipment.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
      `);
      break;

    case "processing":
      subject = "Your Order Is Being Prepared for Shipment";
      message = baseTemplate(`
        <h2 style="color: #2196F3;">📦 Your Order Is Being Prepared</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>Your order is now being prepared for shipment. Our team is carefully packaging your items to ensure they arrive in perfect condition.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
        <p style="background-color: #e7f3fe; padding: 10px; border-left: 4px solid #2196F3;">
          <strong>Next Step:</strong> Your order will be shipped within 1-2 business days.
        </p>
      `);
      break;

    case "shipped":
      subject = "Your Order Has Been Shipped!";
      message = baseTemplate(`
        <h2 style="color: #4CAF50;">🚚 Your Order Is On The Way!</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
        <p style="background-color: #e8f5e9; padding: 10px; border-left: 4px solid #4CAF50;">
          <strong>Estimated Delivery:</strong> Within 3-5 business days.
        </p>
      `);
      break;

    case "delivered":
      subject = "Your Order Has Been Delivered";
      message = baseTemplate(`
        <h2 style="color: #4CAF50;">🎉 Your Order Has Arrived!</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>We're happy to inform you that your order has been successfully delivered.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
        <p>We hope you're satisfied with your purchase. If you have any questions or need assistance, please don't hesitate to contact us.</p>
      `);
      break;

    case "cancelled":
      subject = "Your Order Has Been Cancelled";
      message = baseTemplate(`
        <h2 style="color: #F44336;">❌ Order Cancelled</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>Your order has been cancelled as per your request.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
        <p style="background-color: #ffebee; padding: 10px; border-left: 4px solid #F44336;">
          <strong>Note:</strong> If this cancellation was unexpected or you need any assistance, please contact our support team.
        </p>
      `);
      break;

    case "returned":
      subject = "Your Order Return Has Been Processed";
      message = baseTemplate(`
        <h2 style="color: #9C27B0;">🔄 Order Return Processed</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>We've processed the return for your order. The refund (if applicable) will be processed according to your original payment method.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
        <p>If you have any questions about your return or refund, please contact our support team.</p>
      `);
      break;

    default:
      subject = "Update Regarding Your Order";
      message = baseTemplate(`
        <h2 style="color: #333;">Your Order Status Has Changed</h2>
        <p>Dear ${order?.customerId?.name},</p>
        <p>There has been an update to your order status.</p>
        ${orderDetailsSection}
        ${order?.offerIds?.length > 0 ? `<h3>Offers</h3>${formatOffers(order.offerIds)}` : ''}
        ${order?.productIds?.length > 0 ? `<h3>Products</h3>${formatProducts(order.productIds)}` : ''}
      `);
  }

  await sendMail(order?.customerId?.email, subject, message);
  console.log(`Email sent to ${order?.customerId?.email} about order status: ${order?.orderStatus}`);
}


function generatePassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+{}[]<>?";

  const allChars = upper + lower + digits + symbols;
  let password = "";

  // Ensure at least one character from each category
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the result to avoid predictable positions
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}