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
import { useRouter } from "next/navigation";

const Page = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const isCartEmpty = cartItems.length === 0;
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const router = useRouter();

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

  const checkoutHandler = () => {
    // Handle checkout logic here
    console.log("working checkout handler", isAuthenticated);
    if (!isAuthenticated) {
      toast.error("Please log in first to proceed to checkout.");
      // router.push("/login");
      return;
    }
    // toast.success("Proceeding to checkout...");
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
            <Button className="flex items-center justify-center w-full text-xs text-center bg-black text-white p-3 rounded-md mt-4 cursor-pointer" onClick={checkoutHandler}>
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
