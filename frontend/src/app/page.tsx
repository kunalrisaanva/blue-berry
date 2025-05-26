"use client";
import Slider from "@/app/components/Slider";
import Card from "@/app/components/Card";
import React, { useEffect, useState } from "react";
import Loader from "@/app/components/Loder";
import axios from "axios";

type Props = {};

function Main({}: Props) {
  // const [cartData, setCartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track errors
  const [cardsData, setcardsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        // const NEXT_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/products/all-prodcuts`
        );
        const responseData = response.data.data;
        console.log("response", responseData);
        setcardsData(responseData);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchData();
  }, []);

  //  name imageUrl price category previousprice description isnew rating inStock qty

  if (loading) {
    // Show loader while data is being fetched
    return <Loader />;
  }

  if(error) {
    // Show error message if there was an error fetching data
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="w-full ">
      <Slider />

      <div className="my-6 ">
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
