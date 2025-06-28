"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "../components/Loder";
import axios from "axios";

const Page = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
      fetchOrders();
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");

      console.log("order token -->", token);

      const { data } = await axios.get(`http://localhost:1111/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth || loading) return <Loader />;

  return (
    <div className="my-10   pt-24 sm:px-6 lg:px-8">
      <div className="w-full rounded-md border border-gray-300 shadow-sm p-4 sm:p-6 bg-white">
        <h1 className="text-xl sm:text-3xl font-semibold text-black mb-6">
          Order List
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className=" w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600 text-xs sm:text-sm font-medium">
                  <th className="px-4 py-2">Order No.</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={i}
                    className="bg-gray-50 hover:bg-gray-100 text-xs sm:text-sm cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    <td className="px-4 py-2">
                      {order.order_number ||
                        order.razorpay_order_id?.slice(-10)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(
                        order.date || order.created_at
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {order.customer_name || "N/A"}
                    </td>
                    <td className="px-4 py-2">{order.email || "N/A"}</td>
                    <td className="px-4 py-2">${order.amount}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "paid"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Order Details
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Order No:</strong>{" "}
                {selectedOrder.order_number || selectedOrder.razorpay_order_id}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Customer:</strong>{" "}
                {selectedOrder.customer_name || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {selectedOrder.email || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total:</strong> ${selectedOrder.amount}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
