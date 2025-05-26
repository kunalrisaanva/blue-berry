"use client";
import React, { useState, useRef, useEffect } from "react";
import Badge from "@mui/material/Badge";
import { PiShoppingCartSimpleDuotone, PiUserDuotone } from "react-icons/pi";
import Link from "next/link";
import { useSelector } from "react-redux";
import SearchBar from "./ui/SearchBar";
import Profile from "@/app/components/Profile";

const Navbar = () => {
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartItemCount = cartItems.length;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="p-4 shadow-md flex flex-row justify-center">
        <div className="flex flex-col md:flex-row w-[1300px] gap-4 p-2">
          {/* Logo */}
          <div className="w-auto">
            <Link href="/">
              <img
                src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
                alt="Logo"
                className="h-8"
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="flex-1">
            <SearchBar
              onSearch={(query: string) => console.log("Search query:", query)}
            />
          </div>

          {/* Cart & Profile */}
          <div className="flex gap-3 w-full md:w-auto md:justify-center items-center relative">
            {/* Cart */}
            <Link href="/cart">
              <Badge badgeContent={cartItemCount} color="secondary">
                <button className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100 cursor-pointer">
                  <PiShoppingCartSimpleDuotone size={20} color="blue" />
                </button>
              </Badge>
            </Link>

            {/* Profile with Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100 cursor-pointer"
              >
                <PiUserDuotone size={20} color="blue" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          alert("Signing out...");
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <Profile onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

export default Navbar;
