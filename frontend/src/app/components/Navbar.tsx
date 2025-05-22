// "use client";
import React from "react";
import { PiShoppingCartSimpleDuotone, PiUserDuotone } from "react-icons/pi";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import SearchBar from "./ui/SearchBar";
// import Imageπ from "next/image";

type Props = {};

const Navbar = (props: Props) => {
  // get cart items from redux store
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartItemCount = cartItems.length;
  // get total price from redux store

  // const router = useRouter()

  return (
    <nav className="p-4 shadow-md  flex flex-row justify-center   ">
      <div className=" flex flex-col md:flex-row w-[1300px]  gap-4 p-2  ">
        {/* Logo */}
        <div className="w-auto ">
          <Link href="/">
            <img
              src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
              alt="Logo"
              className="h-8"
            />
          </Link>
        </div>

        {/* Search Box */}
        <div className=" flex-1 ">
          <SearchBar
            onSearch={(query: string) => console.log("Search query:", query)}
          />
        </div>

        {/* Cart & Login */}
        <div className="flex gap-3 w-full md:w-auto  md:justify-center">
          <Link href="/cart">
            <button className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100 cursor-pointer">
              <PiShoppingCartSimpleDuotone size={20} color="blue" />
              <span className="hidden sm:inline">Cart {cartItemCount}</span>
            </button>
          </Link>
          <button className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100 cursor-pointer">
            <PiUserDuotone size={20} color="blue" />
            <Link href={"/login"} className="hidden sm:inline">
              <span className="hidden sm:inline">Login</span>
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
