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
  const discount = 7.65;
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
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            toast.error("Payment response missing required fields!");
            return;
          }

          try {
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
            console.error("Verification error:", error);
            toast.error("Payment verification failed!");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed!");
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 pt-30 md:pt-4 pb-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
        🛍️ Shopping Cart
      </h1>

      {isCartEmpty ? (
        // <div className="text-center py-24">
        //   <img
        //     src="/emptyCart.png"
        //     alt="Empty Cart"
        //     className="mx-auto mb-6 w-44 sm:w-60"
        //   />
        //   <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        //   <Link
        //     href="/"
        //     className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        //   >
        //     Start Shopping
        //   </Link>
        // </div>
        <div className="text-center py-24">
  <h2 className="text-3xl font-semibold mb-2">🛒 Oops! Your cart is empty</h2>
  <p className="text-gray-600 mb-6 text-base">
    Looks like you haven’t added anything yet. Let’s fix that! 💙
  </p>
  <Link
    href="/"
    className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
  >
    🛍️ Start Shopping
  </Link>
</div>

      ) : (
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="text-sm sm:text-base text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span>SubTotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>₹{discount}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToCheckout}
              className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
            >
              Proceed to Checkout
            </Button>
            <Link href="/" className="block text-center text-sm mt-4 text-gray-500 hover:underline">
              Continue Shopping
            </Link>
          </div>

          {/* Cart Items */}
          <div className="w-full lg:w-2/3 bg-white rounded-xl border shadow-sm p-6">
            <div className="hidden sm:grid grid-cols-4 font-semibold text-gray-600 border-b pb-2 mb-4">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 border-t py-4"
              >
                <div className="flex items-center gap-3 sm:col-span-1">
                  <RiDeleteBin6Line
                    className="text-gray-500 hover:text-red-600 cursor-pointer"
                    size={18}
                    onClick={() => handleRemoveFromCart(item.id, item.title)}
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>

                <div className="text-center sm:col-span-1 text-gray-700 hidden sm:block">
                  ₹{item.price}
                </div>

                <div className="flex justify-center items-center gap-2 sm:col-span-1">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    –
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    +
                  </button>
                </div>

                <div className="text-right text-gray-700 font-medium sm:col-span-1 hidden sm:block">
                  ₹{(item.price * item.quantity)}
                </div>

                <div className="block sm:hidden text-center text-sm text-gray-500">
                  Total: ₹{(item.price * item.quantity)}
                </div>
              </div>
            ))}

            <div className="mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md w-full sm:w-autoc cursor-pointer"
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
