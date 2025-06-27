'use client';
import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loder';

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
   const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);


  
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login"); // Redirect if not logged in
    } else {
      setCheckingAuth(false); // Allow render if authenticated
    }
  }, [isLoggedIn, router]);


  if (checkingAuth) return <Loader />;
  

  return (
    <div className="my-10 px-6">
      <div className="w-full rounded-md border border-gray-300 shadow-sm p-6 bg-white">
        <h1 className="text-3xl font-semibold text-black mb-6">Order List</h1>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-600 text-sm font-medium">
                <th className="px-4 py-2">Order Number</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((item, i) => (
                <tr
                  key={i}
                  className="bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <td className="px-4 py-2">9bbfdf05cf</td>
                  <td className="px-4 py-2">5/10/2025</td>
                  <td className="px-4 py-2">Kunal Risaanva</td>
                  <td className="px-4 py-2">kunalrisaanva12@gmail.com</td>
                  <td className="px-4 py-2">$28.00</td>
                  <td className="px-4 py-2">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60   bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative"
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
              <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
              <p className="text-sm text-gray-600 mb-2">
                Order Number: <span className="font-medium">9bbfdf05cf</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Customer: <span className="font-medium">Kunal Risaanva</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Email: <span className="font-medium">kunalrisaanva12@gmail.com</span>
              </p>
              <p className="text-sm text-gray-600">
                Total: <span className="font-medium">$28.00</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
