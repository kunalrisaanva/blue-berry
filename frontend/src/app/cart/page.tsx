"use client";

import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  resetCart,
  removeFromCart,
} from "../../lib/cartSlice";

const Page = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const isCartEmpty = cartItems.length === 0;

  const subTotal = cartItems.reduce(
    (t: number, i: any) => t + i.price * i.quantity,
    0
  );
  const discount = 2.8;
  const totalAmount = subTotal - discount;

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-4 md:px-16 py-10">
      {isCartEmpty ? (
        /* ---- EMPTY CART ---- */
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Your cart is empty!</h2>
          <Link
            href="/"
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* ---- CART FILLED ---- */
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ====== Order Summary ====== */}
          <div className="bg-white p-6 rounded-xl shadow-sm w-full lg:w-1/3">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-3 text-gray-700 text-lg">
              <span>SubTotal</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-700 text-lg">
              <span>Discount</span>
              <span>${discount.toFixed(2)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
              Proceed to Checkout
            </button>
            <Link href="/">
              <p className="text-center text-gray-600 mt-4 hover:underline">
                Continue Shopping
              </p>
            </Link>
          </div>

          {/* ====== Cart Table ====== */}
          <div className="bg-white p-6 rounded-xl shadow-sm w-full lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4">Product</h2>

            {/* headings */}
            <div className="grid grid-cols-4 font-semibold text-gray-700 mb-4">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            {/* items */}
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className="grid grid-cols-4 items-center border-t py-4"
              >
                {/* product */}
                <div className="flex items-center gap-4">
                  <RiDeleteBin6Line
                    size={20}
                    className="cursor-pointer  text-gray-600 hover:text-red-800"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <span>{item.title}</span>
                </div>

                {/* price */}
                <div className="text-center text-gray-700 font-medium">
                  ${item.price.toFixed(2)}
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
                <div className="text-right text-gray-700 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* reset cart */}
            <div className="mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
                onClick={() => dispatch(resetCart())}
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
