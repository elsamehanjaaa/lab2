import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";

const AccountSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: user?.id,
    name: user?.username,
    email: user?.email,
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Updated data:", formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  if (!user || !formData.id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Loading user...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">Account Settings</h2>

        {success && (
          <div className="bg-green-900/50 text-green-300 px-4 py-3 rounded-lg mb-4 text-center">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full bg-gray-700 text-white border-gray-600 hover:bg-gray-600/70 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full bg-gray-700 text-white border-gray-600 hover:bg-gray-600/70 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <hr className="border-gray-600" />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              className="w-full bg-gray-700 text-white border-gray-600 hover:bg-gray-600/70 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full bg-gray-700 text-white border-gray-600 hover:bg-gray-600/70 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
