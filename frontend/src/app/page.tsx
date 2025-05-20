import Slider from "@/app/components/Slider";
import Card from "@/app/components/Card";
import React from "react";

type Props = {};

function Main({}: Props) {
  const mock = [
    {
      id: 1,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/64b28c4017655b91d357ea6e3fae81f16bef2fdb-800x800.jpg?w=500&h=500",
      isNew: "New",
      category: "Snacks",
      rating: 4,
      title: "Black Pepper Spice Pack",
      price: 53,
      originalPrice: 57,
      quantity: "1",
    },
    {
      id: 2,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/b8711520534c9f381b2712548d41c6423ad3c9cc-800x800.jpg?w=500&h=500",
      isNew: "New",
      category: "Snacks",
      rating: 4,
      title: "Chilli Flakes Pack",
      price: 24,
      originalPrice: 34,
      quantity: "1",
    },
    {
      id: 3,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/d9f04ef79971536d48b7d3883152a3ec33b4821c-800x800.jpg?w=500&h=500",
      isNew: "HOT",
      category: "Snacks",
      rating: 4,
      title: "Crunchy Banana Chips",
      price: 5,
      originalPrice: 10,
      quantity: "1",
    },
    {
      id: 4,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/d9f04ef79971536d48b7d3883152a3ec33b4821c-800x800.jpg?w=500&h=500",
      isNew: "HOT",
      category: "Snacks",
      rating: 4,
      title: "Crunchy Banana Chips",
      price: 5,
      originalPrice: 10,
      quantity: "1",
    },
    {
      id: 5,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/d9f04ef79971536d48b7d3883152a3ec33b4821c-800x800.jpg?w=500&h=500",
      isNew: "HOT",
      category: "Snacks",
      rating: 4,
      title: "Crunchy Banana Chips",
      price: 5,
      originalPrice: 10,
      quantity: "1",
    },
    {
      id: 6,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/d9f04ef79971536d48b7d3883152a3ec33b4821c-800x800.jpg?w=500&h=500",
      isNew: "HOT",
      category: "Snacks",
      rating: 4,
      title: "Crunchy Banana Chips",
      price: 5,
      originalPrice: 10,
      quantity: "1",
    },
    {
      id: 7,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/d9f04ef79971536d48b7d3883152a3ec33b4821c-800x800.jpg?w=500&h=500",
      isNew: "HOT",
      category: "Snacks",
      rating: 4,
      title: "Crunchy Banana Chips",
      price: 5,
      originalPrice: 10,
      quantity: "1",
    },
    {
      id: 8,
      image:
        "https://cdn.sanity.io/images/szo9br23/production/d9f04ef79971536d48b7d3883152a3ec33b4821c-800x800.jpg?w=500&h=500",
      isNew: "HOT",
      category: "Snacks",
      rating: 4,
      title: "Crunchy Banana Chips",
      price: 5,
      originalPrice: 10,
      quantity: "1",
    },
  ];
  return (
    <div className="px-22">
      {/* <div className="py-10 p-2"> */}
        <Slider />
      {/* </div> */}

      <div className="my-6">
        <h1 className="text-2xl font-semibold text-gray-600">
          Day of the <span className="text-[#7688db]"> Deal</span>
        </h1>
        <p className="text-sm text-gray-500 font-thin">
          Don’t wait. The time will never be just right.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mock.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            isNew={item.isNew}
            category={item.category}
            rating={item.rating}
            title={item.title}
            price={item.price}
            originalPrice={item.originalPrice}
            quantity={item.quantity}
          />
        ))}
      </div>
    </div>
  );
}

export default Main;
