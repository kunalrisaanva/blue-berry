'use client';
import React, { useState } from 'react';



type ProfileProps = {
  onClose: () => void;
};


const Page: React.FC<ProfileProps> = ({ onClose }) => {


  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-md shadow-2xl w-full max-w-4xl h-[700px] flex relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Sidebar */}
        <div className="w-1/3 border-r p-6 bg-white/60 backdrop-blur-sm rounded-md">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <p className="text-sm text-gray-500 mb-4">Manage your account info.</p>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2 text-black font-medium">
              <span>👤</span><span>Profile</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-black cursor-pointer">
              <span>🛡️</span><span>Security</span>
            </li>
          </ul>
          <div className="absolute bottom-4 left-6 text-xs text-gray-400">
            Secured by <span className="font-semibold text-gray-600">Clerk</span><br />
            <span className="text-orange-500 font-medium">Development mode</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Profile details</h3>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <img src="https://placehold.co/40x40" alt="Profile" className="rounded-full w-10 h-10" />
              <span className="font-medium">kunal jangra</span>
              <a href="#" className="ml-auto text-blue-500 text-sm">Update profile</a>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email addresses</label>
            <div className="flex items-center justify-between">
              <span>kunalrisaanva12@gmail.com</span>
              <span className="text-xs text-white bg-gray-400 rounded px-2 py-0.5">Primary</span>
            </div>
            <button className="mt-2 text-blue-500 text-sm">+ Add email address</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connected accounts</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png" className="w-5 h-5" alt="Google" />
                <span>Google • kunalrisaanva12@gmail.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
