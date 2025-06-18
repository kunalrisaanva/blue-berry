"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity } from "@/lib/cartSlice"; // Import Redux actions
import Loader from "@/app/components/Loder";
import { toast } from "sonner"; // Import toast for notifications
import axios from "axios"; // Import axios
import { TbTruckDelivery } from "react-icons/tb";
import { TbBasketQuestion } from "react-icons/tb";
import { FcShare } from "react-icons/fc";
import { FaCodeCompare } from "react-icons/fa6";

const ProductPage: React.FC = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const cartItems = useSelector((state: any) => state.cart.items); // Get cart items from Redux store

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://blue-berry.onrender.com/api/v1/products/product`,
          {
            params: { id }, // Pass the product ID as a query parameter
          }
        );
        setProduct(response.data.data[0]); // Assuming the API response has a `data` array
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  // Check if the product is already in the cart
  const cartItem = cartItems.find((item: any) => item.id === product.id);

  const handleAddToCart = () => {
    const newItem = {
      id: product.id,
      image: product.imageurl,
      title: product.name,
      price: product.price,
      quantity: 1, // Default quantity
    };

    dispatch(addToCart(newItem));
    toast.success(`${product.name} added to the cart!`);
  };

  return (
    <div className="py-6 mt-20 font-sans">
      <div className="mx-auto bg-white rounded-2xl shadow-md p-6 md:flex gap-10">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
          <div className="overflow-hidden rounded-xl">
            <img
              src={product.imageurl}
              alt={product.name}
              className="rounded-xl w-full transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-medium">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center text-sm text-gray-600">
            <div className="text-red-500 mr-2">
              {"★".repeat(product.rating)} {"☆".repeat(5 - product.rating)}
            </div>
            <span>({product.reviewsCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span className="text-gray-900">${product.price}</span>
            {product.previousPrice && (
              <span className="line-through text-gray-400">
                ${product.previousPrice}
              </span>
            )}
            <span className="ml-auto text-sm text-gray-500">
              {product.weight}
            </span>
          </div>

          {/* Stock status */}
          <div
            className={`${
              product.inStock
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } px-3 py-1 w-fit rounded-md text-sm font-medium`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>

          {/* Viewers */}
          <p className="text-sm text-gray-700">
            <span className="bg-black text-white px-2 py-0.5 rounded font-bold mr-1">
              {product.viewers}
            </span>
            People are viewing this right now
          </p>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Add to Cart or Quantity Controls */}
          {cartItem ? (
            <div className="flex justify-center items-center gap-2">
              <button
                className="border rounded px-2 py-1"
                onClick={() => dispatch(decreaseQuantity(cartItem.id))}
              >
                –
              </button>
              <span>{cartItem.quantity}</span>
              <button
                className="border rounded px-2 py-1"
                onClick={() => dispatch(increaseQuantity(cartItem.id))}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add to cart
            </button>
          )}
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
