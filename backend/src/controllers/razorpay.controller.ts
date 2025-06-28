import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../dbConnection/db";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { items, amount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new ApiError(400, "Cart items are required"));
    }

    if (!amount || amount <= 0) {
      return next(new ApiError(400, "Invalid total amount"));
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Store order in database
    await db.query(
      `INSERT INTO orders (razorpay_order_id, amount, status)
     VALUES ($1, $2, $3)`,
      [order.id, amount, "created"]
    );

    // Optional: Save cart items to another table if needed
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (razorpay_order_id, product_id, title, quantity, price)
       VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.id, item.title, item.quantity, item.price]
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: order.id,
          amount: options.amount,
          currency: options.currency,
        },
        "Order created"
      )
    );
  }
);

const verifyPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("Received from frontend 2:", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    // const body = `${razorpay_order_id.trim()}|${razorpay_payment_id.trim()}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
      .update(body)
      .digest("hex");

    console.log("Computed expected signature:", expectedSignature);

    if (expectedSignature !== razorpay_signature) {
      return next(new ApiError(400, "Signature mismatch"));
    }

    await db.query(
      `UPDATE orders 
     SET razorpay_payment_id = $1, status = $2 
     WHERE razorpay_order_id = $3`,
      [razorpay_payment_id, "paid", razorpay_order_id]
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { success: true }, "Payment verified"));
  }
);

const getMyOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await db.query(
      `SELECT o.razorpay_order_id, o.amount, o.status, o.created_at,
            o.razorpay_payment_id
     FROM orders o
     ORDER BY o.created_at DESC`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, result.rows, "Orders fetched successfully"));
  }
);

export { createOrder, verifyPayment, getMyOrders };
