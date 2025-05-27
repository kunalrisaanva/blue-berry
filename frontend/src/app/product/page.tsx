import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { TbBasketQuestion } from "react-icons/tb";
import { FcShare } from "react-icons/fc";
import { FaCodeCompare } from "react-icons/fa6";

const ProductPage: React.FC = () => {
  return (
    <div className="bg-gray-50 py-6 font-sans ">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 md:flex gap-10">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
          <div className="overflow-hidden rounded-xl">
            <img
              src="https://cdn.sanity.io/images/szo9br23/production/c91a6cd06c0a9e6b5c657f80a409414e5d23e18b-800x800.jpg?w=1000&h=1000"
              alt="Chilli Flakes Pack"
              className="rounded-xl w-full transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-medium">Fresh Mango Slice Juice</h1>

          {/* Ratings */}
          <div className="flex items-center text-sm text-gray-600">
            <div className="text-red-500 mr-2">★★★★☆</div>
            <span>(25 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span className="text-gray-900">$28.00</span>
            <span className="line-through text-gray-400">$30.00</span>
            <span className="ml-auto text-sm text-gray-500">250g</span>
          </div>

          {/* Stock status */}
          <div className="bg-green-100 text-green-700 px-3 py-1 w-fit rounded-md text-sm font-medium">
            In Stock
          </div>

          {/* Viewers */}
          <p className="text-sm text-gray-700">
            <span className="bg-black text-white px-2 py-0.5 rounded font-bold mr-1">
              20
            </span>
            People are viewing this right now
          </p>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eaque
            nesciunt voluptatem consequuntur maiores eos, excepturi quidem alias
            dolore optio, rem eum suscipit fugit.
          </p>

          {/* Add to Cart */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Add to cart
          </button>

          {/* Options */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
            <span className="flex items-center  hover:text-red-400 gap-2">
              <FaCodeCompare size={20} /> Compare color
            </span>
            <span className="flex items-center  hover:text-red-400 gap-2">
              <TbBasketQuestion size={25} /> Ask a question
            </span>
            <span className="flex items-center  hover:text-red-400 gap-2">
              <TbTruckDelivery size={25} />
              Delivery & Return
            </span>
            <span className="flex items-center  hover:text-red-400 gap-2">
              <FcShare size={25} /> Share
            </span>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className=" border rounded-sm hover:border-blue-400 p-4 text-center">
              <div className="font-bold text-lg">Free Shipping</div>
              <p className="text-sm text-gray-500">
                Free shipping over order $120
              </p>
            </div>
            <div className="border rounded-b-sm p-4  hover:border-blue-400 text-center">
              <div className="font-bold text-lg">Flexible Payment</div>
              <p className="text-sm text-gray-500">
                Pay with Multiple Credit Cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
