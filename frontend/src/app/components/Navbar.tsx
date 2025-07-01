"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Badge from "@mui/material/Badge";
import { PiShoppingCartSimpleDuotone, PiUserDuotone } from "react-icons/pi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "@/lib/authSlice";
import SearchBar from "./ui/SearchBar";
import Profile from "@/app/components/Profile";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import Loader from "../components/Loder";
import Button from "./ui/Button";
// import { RootState } from "@/lib/store"; // Optional for proper Redux typing

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const cartItems = useSelector((state: any) => state.cart.items);
  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);

  const [cartItemCount, setCartItemCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCartItemCount(cartItems.length);
  }, [cartItems]);

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

  const handleLogin = () => router.push("/login");

  const handleLogout = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("authToken");
      dispatch(Logout());
      toast.success("Logged out successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
      setShowDropdown(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md min-h-[4.5rem] flex flex-row justify-center">
        <div className="flex flex-col md:flex-row w-[1300px] gap-4 p-2 md:items-center">
          {/* Logo */}
          <div className="w-auto">
            <Link href="/">
              <Image
                src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="flex-1">
            <SearchBar
              onSearch={(query: string) => console.log("Search query:", query)}
            />
          </div>

          {/* Cart & Profile/Login */}
          <div className="flex gap-3 w-full md:w-auto md:justify-center items-center relative">
            {/* Cart */}
            <Link href="/cart">
              <Badge badgeContent={cartItemCount} color="secondary">
                <button className="bg-white h-[3rem] w-24 flex items-center justify-center gap-2 text-black rounded shadow-md hover:bg-gray-100 cursor-pointer">
                  <PiShoppingCartSimpleDuotone size={24} color="blue" />
                </button>
              </Badge>
            </Link>

            {/* Profile or Login */}
            {isLoggedIn ? (
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
                          href="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign out
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-[#6D7FDA] h-[3rem] w-24 flex items-center justify-center gap-2 text-white rounded shadow-md hover:bg-[#5a6bc4] cursor-pointer"
              >
                <FaSignInAlt size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
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
