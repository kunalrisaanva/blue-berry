import React from "react";
import { PiShoppingCartSimpleDuotone, PiUserDuotone } from "react-icons/pi";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 shadow-md w-full">
      {/* Logo */}
      <div className="flex md:justify-center justify-start w-full md:w-auto">
        <img
          src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
          alt="Logo"
          className="h-10"
        />
      </div>

      {/* Search Box */}
      <div className="w-full md:w-[50rem]">
        <input
          type="search"
          className="h-[3rem] w-full rounded border border-neutral-300 bg-transparent px-3 py-[0.25rem] text-base text-neutral-700 outline-none transition duration-200 ease-in-out focus:border-blue-500 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-400"
          placeholder="Search for products"
        />
      </div>

      {/* Cart & Login */}
      <div className="flex gap-3 w-full md:w-auto  md:justify-center">
        <button className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100">
          <PiShoppingCartSimpleDuotone size={20} color="blue" />
          <span className="hidden sm:inline">Cart</span>
        </button>
        <button className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100">
          <PiUserDuotone size={20} color="blue" />
          <span className="hidden sm:inline">Login</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
