"use client";

import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  increaseQuantity,
  decreaseQuantity,
  resetCart,
  removeFromCart,
} from "../../lib/cartSlice";
import Button from "../components/ui/Button";
import { imageOptimizer } from "next/dist/server/image-optimizer";
import axios from "axios";
import { useEffect } from "react";

const Page = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);
  const isCartEmpty = cartItems.length === 0;

  const subTotal = cartItems.reduce(
    (t: number, i: any) => t + i.price * i.quantity,
    0
  );
  const discount = 2.8;
  const totalAmount = subTotal - discount;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRemoveFromCart = (id: number, title: string) => {
    dispatch(removeFromCart(id));
    toast.success(`${title} removed from the cart!`);
  };

  const handleResetCart = () => {
    dispatch(resetCart());
    toast.success("Cart has been reset!");
  };

  const handleProceedToCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }

    try {
      // 1. Call backend to create Razorpay order
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}create-order`,
        {
          items: cartItems,
          amount: totalAmount,
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: "Blue-Berry",
        description: "Cart Checkout",
        order_id: data.data.orderId,
        handler: async function (response: any) {
          // console.log("Full Razorpay response:", response);

          const razorpay_order_id =
            response.razorpay_order_id || response.razorpayOrderId;
          const razorpay_payment_id =
            response.razorpay_payment_id || response.razorpayPaymentId;
          const razorpay_signature =
            response.razorpay_signature || response.razorpaySignature;

          if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
          ) {
            toast.error("Payment response missing required fields!");
            return;
          }

          try {
            // 3. Verify payment on backend
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}verify`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              dispatch(resetCart());
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification API error:", error);
            toast.error("Payment verification failed!");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      // 4. Open Razorpay checkout popup
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Checkout failed!");
    }
  };

  return (
    <div className="w-full  pt-20 md:pt-2 px-4 sm:px-6 lg:px-8 ">
      {isCartEmpty ? (
        /* ---- EMPTY CART ---- */
        <div className="text-center py-20">
          <div>
            <img
              src="/emptyCart.png"
              alt="Empty Cart"
              className="mx-auto mb-4 w-40 sm:w-60"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Your cart is empty!
          </h2>
          <Link
            href="/"
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* ---- CART FILLED ---- */
        <div className="flex flex-col  lg:flex-row w-full gap-6  py-6">
          {/* ====== Order Summary ====== */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full lg:w-1/3">
            <h2 className="text-lg sm:text-2xl font-semibold mb-6">
              Order Summary
            </h2>
            <div className="flex justify-between mb-3 text-gray-700 text-sm sm:text-lg">
              <span>SubTotal</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-700 text-sm sm:text-lg">
              <span>Discount</span>
              <span>${discount.toFixed(2)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-base sm:text-xl font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <Button
              className="flex items-center justify-center w-full text-xs text-center bg-black text-white p-3 rounded-md mt-4 cursor-pointer"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
            <Link href="/">
              <p className="text-center text-gray-600 mt-4 hover:underline">
                Continue Shopping
              </p>
            </Link>
          </div>

          {/* ====== Cart Table ====== */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full lg:w-2/3">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Product</h2>

            {/* headings */}
            <div className="hidden sm:grid grid-cols-4 font-semibold text-gray-700 mb-4">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            {/* items */}
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-4 items-center border-t py-4 gap-4 sm:gap-0"
              >
                {/* product */}
                <div className="flex items-center gap-4">
                  <RiDeleteBin6Line
                    size={20}
                    className="cursor-pointer text-gray-600 hover:text-red-800"
                    onClick={() => handleRemoveFromCart(item.id, item.title)}
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <span className="text-sm sm:text-base">{item.title}</span>
                </div>

                {/* price */}
                <div className="text-center text-gray-700 font-medium sm:block hidden">
                  ${item.price}
                </div>

                {/* quantity */}
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="border rounded px-2 py-1"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    –
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="border rounded px-2 py-1"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    +
                  </button>
                </div>

                {/* total */}
                <div className="text-right text-gray-700 font-medium sm:block hidden">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}

            {/* reset cart */}
            <div className="mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md w-full sm:w-auto"
                onClick={handleResetCart}
              >
                Reset Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
