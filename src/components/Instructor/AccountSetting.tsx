import React, { useState } from "react";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    name: "Elsa Mehanja",
    email: "elsa@example.com",
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

    // validate passwords
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Saving settings:", formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow mx-auto">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>

      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            className="mt-1 w-full px-3 py-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            className="mt-1 w-full px-3 py-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <hr className="my-4" />

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            name="password"
            className="mt-1 w-full px-3 py-2 border rounded"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="mt-1 w-full px-3 py-2 border rounded"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
