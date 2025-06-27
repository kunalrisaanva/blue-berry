"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState<"profile" | "security">(
    "profile"
  );
  const [showResetForm, setShowResetForm] = useState(false);
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const user = useSelector((state: any) => state.auth.user);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please enter both passwords");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Password changed successfully!");
        setShowResetForm(false);
        setcurrentPassword("");
        setNewPassword("");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-md shadow-2xl w-full max-w-4xl h-[90vh] md:h-[700px] flex flex-col md:flex-row relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
        >
          &times;
        </button>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6 bg-white/60 backdrop-blur-sm rounded-t-md md:rounded-l-md">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage your account info.
          </p>
          <ul className="space-y-3 flex flex-col gap-4">
            <li
              className={`flex items-center space-x-2 cursor-pointer ${
                selectedTab === "profile"
                  ? "text-black font-medium"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setSelectedTab("profile")}
            >
              <span>👤</span>
              <span>Profile</span>
            </li>
            <li
              className={`flex items-center space-x-2 cursor-pointer ${
                selectedTab === "security"
                  ? "text-black font-medium"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setSelectedTab("security")}
            >
              <span>🛡️</span>
              <span>Settings</span>
            </li>
          </ul>
          <div className="mt-8 md:absolute bottom-4 left-6 text-xs text-gray-400">
            Secured by{" "}
            <span className="font-semibold text-gray-600">Future Nodes</span>
            <br />
            <span className="text-orange-500 font-medium">
              Development mode
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto">
          {selectedTab === "profile" ? (
            <>
              <h3 className="text-lg font-semibold mb-4">Profile details</h3>
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://placehold.co/40x40"
                    alt="Profile"
                    className="rounded-full w-10 h-10"
                  />
                  <span className="font-medium">kunal jangra</span>
                  <a href="#" className="ml-auto text-blue-500 text-sm">
                    Update profile
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email addresses
                </label>
                <div className="flex items-center justify-between">
                  <span>{user?.email}</span>
                  <span className="text-xs text-white bg-gray-400 rounded px-2 py-0.5">
                    Primary
                  </span>
                </div>
                <button className="mt-2 text-blue-500 text-sm">
                  + Add email address
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connected accounts
                </label>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
                    className="w-5 h-5"
                    alt="Google"
                  />
                  <span>Google • kunalrisaanva12@gmail.com</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">Settings</h3>

              {/* Reset Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change password
                </label>
                {showResetForm ? (
                  <div className="space-y-3 mt-2">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setcurrentPassword(e.target.value)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowResetForm(false)}
                        className="text-gray-500 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="text-blue-500 text-sm hover:underline mt-1"
                    onClick={() => setShowResetForm(true)}
                  >
                    Reset Password
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change email
                </label>
                <button className="text-blue-500 text-sm hover:underline">
                  Update Email
                </button>
              </div>

              {/* 2FA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Two-factor authentication
                </label>
                <button className="text-blue-500 text-sm hover:underline">
                  Enable 2FA
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
