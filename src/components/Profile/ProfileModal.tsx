"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, FileText, X, Lock, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path as needed
import Loading from "../Loading";

interface ProfileData {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  theme: "light" | "dark";
  password?: string;
  confirmPassword?: string;
}

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "security"
  >("profile");
  const [data, setData] = useState<ProfileData>({
    username: user?.username || "",
    displayName: "",
    email: user?.email || "",
    bio: "",
    theme: "light",
    password: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Lock scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Validate form inputs based on active tab
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (activeTab === "profile") {
      if (!data.username.trim()) newErrors.username = "Full name is required";
      if (!data.displayName.trim())
        newErrors.displayName = "Display name is required";
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      if (activeTab === "profile") {
        formData.append("username", data.username);
        formData.append("displayName", data.displayName);
        formData.append("email", data.email);
        formData.append("bio", data.bio);
        if (imageFile) {
          formData.append("profilePicture", imageFile);
        }
      } else if (activeTab === "preferences") {
        formData.append("theme", data.theme);
      } else if (activeTab === "security" && data.password) {
        formData.append("password", data.password);
      }

      await updateProfile(formData);
      router.refresh();
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
                  {/* Profile picture upload section */}
                  {/* <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Image
                        src={previewImage}
                        alt="Profile Picture"
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                      />
                      <label
                        htmlFor="profile-picture"
                        className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                      >
                        <Camera className="h-5 w-5" />
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div> */}
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm text-center">
                      {errors.profilePicture}
                    </p>
                  )}

                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                        errors.username ? "border-red-500" : ""
                      }`}
                      value={data.username}
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                      }
                      required
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                    <input
                      type="text"
                      placeholder="Your Display Name"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                        errors.displayName ? "border-red-500" : ""
                      }`}
                      value={data.displayName}
                      onChange={(e) =>
                        setData({ ...data, displayName: e.target.value })
                      }
                      required
                    />
                    {errors.displayName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.displayName}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      value={data.email}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
                    <textarea
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
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
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
