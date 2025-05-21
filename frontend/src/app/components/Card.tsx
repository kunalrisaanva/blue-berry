"use client";

import React from "react";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface ProductCardProps {
  id: number;
  image: string;
  isNew?: string;
  category: string;
  rating: number;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  isNew,
  category,
  rating,
  title,
  price,
  originalPrice,
  quantity,
}) => {
  // set up redux dispatch and selected cart items
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const isIncart = cartItems.some((item: { id: number }) => item.id === id);
  // handle add to cart
  const handleAddToCart = () => {
    const newItem = {
      id,
      image,
      isNew,
      category,
      rating,
      title,
      price,
      originalPrice,
      quantity: parseInt(quantity),
    };
    if (isIncart) {
      // if item is already in cart, update quantity
      const existingItem = cartItems.find(
        (item: { id: number }) => item.id === id
      );
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + parseInt(quantity),
      };
      dispatch({ type: "cart/updateItemQuantity", payload: updatedItem });
    } else {
      // if item is not in cart, add to cart
      dispatch({ type: "cart/addToCart", payload: newItem });
    }
  };

  return (
    <div className="border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full mx-auto">
      <div className="relative p-4 flex  justify-center group">
        {isNew && (
          <span className="absolute left-4 top-4 text-xl  tracking-widest text-gray-600 flex flex-col gap-2 leading-3 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-0 origin-left">
            {isNew.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </span>
        )}
        <img
          src={image}
          alt={title}
          className="w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>

      <div className="border-t p-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{category}</span>
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-orange-400" : "text-gray-300"
                } fill-current`}
                strokeWidth={1}
              />
            ))}
          </span>
        </div>

        <h3 className="font-semibold text-gray-800">{title}</h3>

        <div className="flex justify-between items-center text-sm font-medium">
          <div>
            <span className="text-gray-900 text-base">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="line-through text-gray-400 ml-2">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-gray-500">{quantity}</span>
        </div>

        <button
          className="w-full mt-2 bg-indigo-50 hover:bg-indigo-100 text-black border border-indigo-200 rounded-xl py-2 font-medium"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
