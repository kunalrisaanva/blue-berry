"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

const forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/forgot-password`,
        { email }
      );

      toast.success(res.data.message || "Reset link sent to your email.");
      setEmail("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email to receive a password reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Go back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default forgotpassword;
