import React from "react";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen flex  justify-center bg-gray-100">
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
          Sign in to access your account{" "}
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


        <form action="" className="flex flex-col">

            <span className="text-xs mt-2">Enter address</span>
            <input type="email"  placeholder="Enter your email address" className="mt-2 p-1 border border-gray-300 rounded-md placeholder:p-1"/>
          <button className="text-xs bg-black text-white p-3 rounded-md mt-4">
              Continue
            </button>

        </form>
        </div>

        

        {/* <!-- Login Form --> */}
        {/* <form className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded-md" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded-md" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Login
        </button>
      </form> */}
      </div>
    </div>
  );
};

export default Login;
