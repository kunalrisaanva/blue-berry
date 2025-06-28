"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Slider from "@/app/components/Slider";
import Card from "@/app/components/Card";
import Loader from "@/app/components/Loder";
import { googleLoginSuccess } from "@/lib/authSlice";

function Main() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardsData, setCardsData] = useState<any[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Flag to track if Google login is done
  const [googleLoginDone, setGoogleLoginDone] = useState(false);
  // Flag to track if product fetch is done
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/products/all-prodcuts`
        );
        setCardsData(res.data.data);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Something went wrong while loading products.");
      } finally {
        setProductsLoaded(true);
      }
    };

    fetchProducts();
  }, []);

  // Handle Google OAuth token once
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setGoogleLoginDone(true);
      return;
    }

    const handleGoogleLogin = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(googleLoginSuccess({ token, ...res.data.data }));
      } catch (err) {
        console.error("Google login failed:", err);
        setError("Google login failed. Please try again.");
      } finally {
        setGoogleLoginDone(true);
        router.replace("/"); // Clean URL after login
      }
    };

    handleGoogleLogin();
  }, [searchParams, dispatch, router]);

  // When both Google login and products are done, stop loading
  useEffect(() => {
    if (googleLoginDone && productsLoaded) {
      setLoading(false);
    }
  }, [googleLoginDone, productsLoaded]);

  if (loading) return <Loader />;

  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="w-full mt-24 md:mt-2 p-2">
      <Slider />

      <div className="my-6">
        <h1 className="text-2xl font-semibold text-gray-600">
          Day of the <span className="text-[#7688db]"> Deal</span>
        </h1>
        <p className="text-sm text-gray-500 font-thin">
          Don’t wait. The time will never be just right.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cardsData.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            image={item.imageurl}
            isNew={item.isnew}
            category={item.category}
            rating={item.rating}
            title={item.name}
            price={item.previousprice}
            originalPrice={item.price}
            quantity={item.qty}
          />
        ))}
      </div>
    </div>
  );
}

export default Main;
