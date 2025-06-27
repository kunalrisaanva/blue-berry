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

  const handleRemoveFromCart = (id: number, title: string) => {
    dispatch(removeFromCart(id));
    toast.success(`${title} removed from the cart!`);
  };

  const handleResetCart = () => {
    dispatch(resetCart());
    toast.success("Cart has been reset!");
  };

  return (
    <div className="w-full pt-20 px-4 sm:px-6 lg:px-8">
      {isCartEmpty ? (
        <div className="text-center py-20">
          <img
            src="/emptyCart.png"
            alt="Empty Cart"
            className="mx-auto mb-4 w-40 sm:w-60"
          />
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
        <div className="flex flex-col-reverse lg:flex-row gap-6 py-6">
          {/* Order Summary */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full lg:w-1/2">
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
            <Button className="w-full text-xs sm:text-sm bg-black text-white p-3 rounded-md mt-4">
              Proceed to Checkout
            </Button>
            <Link href="/">
              <p className="text-center text-gray-600 mt-4 hover:underline">
                Continue Shopping
              </p>
            </Link>
          </div>

          {/* Cart Table */}
          <div className="p-4 sm:p-6 rounded-xl shadow-sm w-full bg-amber-400">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Product</h2>

            {/* Headings */}
            <div className=" flex justify-end  font-semibold text-gray-700 mb-4 bg-amber-600">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-center">Total</span>
            </div>

            {/* Items */}
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-start gap-5 items-center border-t "
              >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <RiDeleteBin6Line
                    size={18}
                    className="cursor-pointer text-gray-600 hover:text-red-800"
                    onClick={() => handleRemoveFromCart(item.id, item.title)}
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded object-cover"
                  />
                  <span className="text-sm sm:text-base">{item.title}</span>
                </div>

                {/* Price */}
                <div className="hidden sm:block text-center text-gray-700 font-medium">
                  ${item.price}
                </div>

                {/* Quantity Controls */}
                <div className="flex justify-start sm:justify-center items-center gap-2">
                  <button
                    className="border rounded px-2 py-1 text-sm"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    –
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="border rounded px-2 py-1 text-sm"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="hidden sm:block text-right text-gray-700 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* Reset Cart */}
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
