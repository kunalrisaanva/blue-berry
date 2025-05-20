"use client"
import Link from "next/link";
import React, { useState } from "react";
import Button from "../components/ui/Button";
import Image from "next/image";

const page = () => {


    const [isCartEmpty,setIsCartEmpty] = useState(false);




  return (
    <div className="">



        {isCartEmpty ? (
            <>
                {/* Content for empty cart */}

                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {/* Shopping Bag Icon */}
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 00.293 1.414l1.414 1.414a1 1 0 001.414 0L9 17m0 0h6m-6 0a1 1 0 001 1h4a1 1 0 001-1m-6 0V9a4 4 0 118 0v8"
        />
      </svg>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty!</h2>

      {/* Subheading */}
      <p className="text-gray-500 mb-6">
        Looks like you haven’t added anything to your cart yet. Explore our products and find something you love!
      </p>

      {/* Start Shopping Button */}
      <Link href="/">
        <button className="bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition">
          Start Shopping
        </button>
      </Link>
    </div>
            </>
        ) : (
            <div className="mt-4 w-full h-[30rem] bg-gray-50 px-22">
            <div className="flex items-center gap-2 ">
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
                className="lucide lucide-shopping-bag h-6 w-6 text-primary"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            
              <h3 className="text-black text-2xl font-semibold">Shoping Cart</h3>
            </div>
            
            <div className="flex  mt-4 gap-8">
              <div className=" h-[20rem] w-[28rem] bg-white p-6 border border-gray-250 rounded ">
                <h4 className="text-black text-2xl font-semibold">Order Summary</h4>
                <div className="flex items-center justify-between mt-4">
                  <h5>Sub Total</h5>
                  <h5>$30.50</h5>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <h5>Discount</h5>
                  <h5>$2.80</h5>
                </div>
            
                {/* line */}
                <div className="w-full h-[1px] bg-gray-200 mt-4"></div>
                {/* totoal */}
                <div className="flex items-center justify-between mt-4">
                  <h3>Total</h3>
                  <h3>$90.00</h3>
                </div>
                {/* button import */}
                <Button className="flex items-center justify-center w-full text-xs text-center bg-black text-white p-3 rounded-md mt-4 cursor-pointer">
                  Proceed to Checkout
                </Button>
                <Link href={"/"}>
                  <p className="text-xs text-black flex justify-center mt-3 hover:underline">
                    Continue To Shoping
                  </p>
                </Link>
                {/* </div> */} 
              </div>
            
              {/* right side products */}
            
              <div className="h-[15rem] w-full bg-white pt-6 border border-gray-250 rounded ">
                 
                 
                 <div className="flex text-black font-bold">
            
                  <div className="pl-3">
                 <h4 className="">Products</h4>
            
                  </div>
            
                  <div className="flex items-center justify-center w-full gap-20">
                 <h4>Price</h4>
                 <h4>Quantity</h4>
                 <h4>Total</h4>
            
                  </div>
            
            
               
            
                 </div>
            
            
            
                 {/* line */}
            
                 <div className="w-full h-[1px] bg-gray-200 mt-4"></div>
            
              {/* product deatils */}
            
                 <div className="px-3 py-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash2 w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            
            
                  <div className="h-[3rem] w-[3rem] border border-gray-400 rounded">
                      {/* <Image src={"https://cdn.sanity.io/images/szo9br23/production/b8711520534c9f381b2712548d41c6423ad3c9cc-800x800.jpg"} width={5} height={5} alt="product-image"/> */}
                      {/* <img src="https://cdn.sanity.io/images/szo9br23/production/b8711520534c9f381b2712548d41c6423ad3c9cc-800x800.jpg" alt="product-list" className="h-12" /> */}
                  </div>
            
                  <p>Chilli Flakes Pack</p>
                  <div className="flex items-center pl-30">
            
                  <p className="text-gray-500 font-bold text-sm">$28.00</p>
            
                  <div className="flex items-center gap-2 px-2 pl-15">
            
                  <Button className="bg-white px-2 border border-gray-300 rounded ">-</Button>
                  <p className="text-gray-500 text-sm">1</p>
                  <Button className="bg-white px-2 border border-gray-300 rounded">+</Button>
            
                  </div>
                  <p className="pl-18 text-gray-500 font-bold text-sm">$28.00</p>
            
                  </div>
            
            
            
            
            
                  
                  </div>
            
                 <div className="w-full h-[1px] bg-gray-200 mt-10"></div>
            
                 <Button className="text-white bg-red-500 hover:bg-red-400 px-3 py-1 rounded mt-3 mx-3 font-semibold" onClick={() => setIsCartEmpty(true)}> Reset Cart </Button>
            
            
              </div>
            </div>
            </div>
        )}





    </div>

  
  );
};

export default page;
