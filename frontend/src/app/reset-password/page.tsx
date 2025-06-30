"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../components/ui/Button";
import { toast } from "sonner";
import axios from "axios";
import Loader from "../components/Loder";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux"; 


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth,setCheckingAuth] = useState(true)
  const searchParams = useSearchParams();
  const token = searchParams.get("token");



const router = useRouter();
  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);

//   useEffect(() => {
//      setIsLoading(true);
//     if (!isLoggedIn) {
//         setIsLoading(false);
//       router.replace("/login");
//     } else {
//       setCheckingAuth(false);
//        setIsLoading(false);
//     //   fetchOrders();
//     }
//   }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/reset-password`, {
        newPassword: password,
        token,
      });
      toast.success("Password reset successful! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        {/* Top header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <button className="text-gray-500">←</button>
          </Link>
          <Image
            src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
            alt="Logo"
            width={85}
            height={85}
          />
          <div className="w-5" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Enter new password"
            required
          />

          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Confirm new password"
            required
          />

          <Button
            type="submit"
            className="flex items-center justify-center w-full text-xs text-center bg-black text-white p-3 rounded-md mt-4 cursor-pointer"
          >
            Reset Password
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Remembered your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;