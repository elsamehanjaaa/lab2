"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, FileText, X, Lock, Palette, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path as needed
import Loading from "../Loading";
import * as authUtils from "@/utils/auth";

interface ProfileData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  theme: "light" | "dark";
  password?: string;
  role: string;
  confirmPassword?: string;
}

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [usernameExist, setUsernameExist] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "security"
  >("profile");
  const [data, setData] = useState<ProfileData>({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    role: user?.role || "",
    theme: "light",
    password: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (activeTab === "profile") {
      if (!data.username.trim()) newErrors.username = "Username is required";
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        newErrors.email = "Valid email is required";
      if (data.bio.length > 160)
        newErrors.bio = "Bio must be 160 characters or less";
    } else if (activeTab === "security") {
      if (data.password && data.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (data.password !== data.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  async function handleUsernameInput(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value;

    // Remove spaces from the username input
    const valueWithoutSpaces = rawValue.replace(/\s/g, "");
    setData({ ...data, username: valueWithoutSpaces });

    if (valueWithoutSpaces === user?.username) {
      return;
    }

    if (valueWithoutSpaces.length > 0) {
      try {
        const exists = await authUtils.checkUsername(valueWithoutSpaces);
        setUsernameExist(exists);
      } catch (err) {
        console.error("Username check failed:", err);
      }
    } else {
      setUsernameExist(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm() || !user) return;

    const payload: { [key: string]: any } = {};

    try {
      if (activeTab === "profile") {
        if (data.username !== user.username) {
          payload.username = data.username;
        }
        if (data.first_name !== user.first_name) {
          payload.first_name = data.first_name;
        }
        if (data.last_name !== user.last_name) {
          payload.last_name = data.last_name;
        }
        if (data.bio !== user.bio) {
          payload.bio = data.bio;
        }
      }

      if (Object.keys(payload).length > 0) {
        await updateProfile(payload);
      } else {
        console.log("No changes detected.");
      }

      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl  max-w-4xl shadow-lg relative p-10 flex w-3xl "
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X />
          </button>

          {/* Vertical Tabs */}
          <div className="w-1/4 pr-4 border-r border-gray-200">
            <div className="text-center mb-6">
              <User className="mx-auto h-10 w-10 text-blue-900" />
              <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
            </div>
            <nav className="space-y-2">
              <button
                className={`w-full text-left py-2 px-4 rounded-lg flex items-center gap-2 ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-5 w-5" />
                Profile
              </button>
              <button
                className={`w-full text-left py-2 px-4 rounded-lg flex items-center gap-2 ${
                  activeTab === "preferences"
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                <Palette className="h-5 w-5" />
                Preferences
              </button>
              <button
                className={`w-full text-left py-2 px-4 rounded-lg flex items-center gap-2 ${
                  activeTab === "security"
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Lock className="h-5 w-5" />
                Security
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <div className="w-3/4 pl-6">
            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === "profile" && (
                <>
                  <div className="flex flex-col">
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="flex gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-900" />
                        <input
                          id="first_name"
                          type="text"
                          placeholder="First name"
                          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent `}
                          value={data.first_name}
                          onChange={(e) =>
                            setData({ ...data, first_name: e.target.value })
                          }
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-900" />
                        <input
                          id="last_name"
                          type="text"
                          placeholder="Last name"
                          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent`}
                          value={data.last_name}
                          onChange={(e) =>
                            setData({ ...data, last_name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                      <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                          errors.username ? "border-red-500" : ""
                        }`}
                        value={data.username}
                        onChange={handleUsernameInput}
                        required
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username}
                        </p>
                      )}
                      {usernameExist ? (
                        <X
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          color="red"
                        />
                      ) : (
                        data.username.length > 3 &&
                        data.username !== user?.username && (
                          <Check
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            color="green"
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={data.email}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                        disabled // It's best practice to disable email changes or handle them in a separate flow
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                      <textarea
                        id="bio"
                        placeholder="Tell us about yourself (160 characters max)"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 resize-none h-24 ${
                          errors.bio ? "border-red-500" : ""
                        }`}
                        value={data.bio}
                        onChange={(e) =>
                          setData({ ...data, bio: e.target.value })
                        }
                        maxLength={160}
                      />
                      <p className="text-gray-500 text-sm mt-1">
                        {data.bio.length}/160 characters
                      </p>
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "preferences" && (
                <div className="relative">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={data.theme === "dark"}
                      onChange={(e) =>
                        setData({
                          ...data,
                          theme: e.target.checked ? "dark" : "light",
                        })
                      }
                    />
                    Enable Dark Mode
                  </label>
                </div>
              )}

              {activeTab === "security" && (
                <>
                  <label>Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                    <input
                      type="password"
                      placeholder="Current Password"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      value={data.password}
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
                    <br />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label>New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                      <input
                        type="password"
                        placeholder="New Password"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        value={data.password}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        value={data.confirmPassword}
                        onChange={(e) =>
                          setData({ ...data, confirmPassword: e.target.value })
                        }
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                >
                  {authLoading && <Loading show={authLoading} />}
                  {authLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
