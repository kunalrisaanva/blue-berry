"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Loader from "../components/Loder";
import { toast } from "sonner";
import Router, { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null); // State to track errors

  // interface FormData {
  //     email: string;
  //     password: string;
  // }

  const submithandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/register`,
        formData
      )
      .then((response) => {
        console.log("Signup successful:", response.data);
        // Handle successful signup, e.g., redirect to login or dashboard

        router.push("/login");

        toast.success("Signup successful!");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        toast.error(
          error.response?.data?.message || "An error occurred during signup."
        );
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request is complete
      });

    // setFormData({
    //   email: "",
    //   password: "",
    // });
  };

  // todo  password toggler working but add icon and make button
  const [showPassword, setShowPassword] = React.useState(true);

  const passwordToggleHandler = () => {
    // Toggle the visibility of the password
    // This will switch between showing and hiding the password
    // add icon
    setShowPassword(!showPassword);
  };

  if (loading) {
    // Show loader while data is being fetched
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex  justify-center ">
      <div className="bg-white p-6 rounded-2xl shadow-lg  w-[28rem] my-[5rem]">
        {/* <!-- Top Row: Back Button and Centered Icon --> */}
        <div className="relative flex items-center justify-center mb-6">
          {/* <!-- Back Button (left) --> */}

          <Link href={"/"} className="absolute left-0">
            <button className=" text-gray-600  shadow-md  p-2 rounded-full  hover:shadow-lg transition ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-arrow-left h-5 w-5 text-tech_dark"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </button>
          </Link>

          {/* <!-- Center Icon --> */}
          <div className="text-2xl text-blue-600 font-bold ">
            <img
              src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
              alt="brand-logo"
              className="h-8"
            />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold">Welcome Back</h1>

        <p className="text-center text-gray-600 text-sm">
          Sign in to access your account
        </p>

        <div className="bg-white shadow-2xl mt-[5rem] rounded p-3 h-[20rem] inset-shadow-2xs">
          <div className="flex items-center justify-center gap-2 mt-[2rem] border hover:bg-gray-50 border-gray-200 rounded-md p-2">
            <img
              src="https://img.clerk.com/static/google.svg?width=160"
              alt="google image"
              className="h-10px"
            />
            <button className="text-xs text-gray-600">
              Continue With Google
            </button>
          </div>

          {/*  or option */}
          <div className="flex items-center justify-center mt-4 gap-2">
            <div className="flex-grow h-px bg-gray-200"></div>
            <div className="text-gray-500 text-sm px-2">or</div>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          <form onSubmit={submithandler} className="flex flex-col">
            <span className="text-xs mt-2">Enter address</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email address"
              className="mt-2 p-2 border border-gray-300 rounded-md "
            />

            <span className="text-xs mt-2">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your Password"
              className="mt-2 p-2 border border-gray-300 rounded-md "
            />
            <button
              type="submit"
              className="text-xs bg-black text-white p-3 rounded-md mt-4 cursor-pointer"
            >
              Continue
            </button>
          </form>

          <div className="flex-grow h-px bg-gray-200 mt-7"></div>

          <p className="text-sm text-gray-500 text-center mt-2">
            Don’t have an account?
            <Link href={"/login"}>
              <span className="text-black">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
