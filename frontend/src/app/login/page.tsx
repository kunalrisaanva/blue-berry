"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        {/* Top header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <button className="text-gray-500">←</button>
          </Link>
          <img
            src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
            alt="Logo"
            className="h-8"
          />
          <div className="w-5" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to access your account
        </p>

        <form className="w-full">
          <label className="block text-sm mb-1">Enter address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Enter your email address"
            required
          />

          <label className="block text-sm mb-1">Enter password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold"
          >
            Continue
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
