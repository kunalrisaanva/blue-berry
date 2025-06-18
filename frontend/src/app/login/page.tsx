"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { imageOptimizer } from "next/dist/server/image-optimizer";
// import { D } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/lib/authSlice";
import Loader from "../components/Loder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/login`, {
        email,
        password,
      })
      .then((response: any) => {
        if (response.status === 200) {
          setIsLoading(true);
          // console.log("response from login api ===> ",response.data.data);
          dispatch(loginSuccess(response.data.data));
          // console.log("Login successful:", response.data.data.safeUserData);
          setIsLoading(false);
          router.push("/"); // Redirect to home page after successful login
          toast.success("Login successful!");
        } else {
          // Handle error response
          const e = new Error("Login failed. Please check your credentials.");
          toast.error(e.message);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("ERROR-", e);
      })
      .finally(() => {
        setIsLoading(false);
        // setError(e instanceof Error ? e.message : String(e));
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  // ifeeldeadly@gmail.com

  // console.log(userDetails, "userDetails");

  if (isLoading) {
    return <Loader />;
  }

  // if(error) {
  //     return (
  //       <div className="min-h-screen flex justify-center items-center bg-white px-4">
  //         <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
  //           <h2 className="text-2xl font-semibold text-center mb-4">Error</h2>
  //           <p className="text-red-500 text-center">{error}</p>
  //           <Link href="/login" className="text-blue-600 hover:underline mt-4 block text-center">
  //             Go back to login
  //           </Link>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center bg-white px-4">
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

<form onSubmit={handleSubmit}>
  <Button
    onClick={handleGoogleLogin}
    type="button"
    className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
  >
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      className="h-5 w-5"
      alt="Google"
    />
    Continue with Google
  </Button>
  <div className="relative flex justify-center text-xs uppercase my-4">
    <span className="bg-white px-2 text-gray-400">or</span>
  </div>

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

  <Button
    type="submit"
    className="flex items-center justify-center w-full text-xs text-center bg-black text-white p-3 rounded-md mt-4 cursor-pointer"
  >
    Continue
  </Button>
  {/* 
  <button
    type="submit"
    className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold"
  >
    Continue
  </button> */}
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
