import { useState } from "react";
import { useRouter } from "next/router";
import * as authUtils from "@/utils/auth";

export default function SetNewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await authUtils.resetPassword(password); // Assumes this utility exists
      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => router.push("/?showLogin=true"), 2000); // Redirect to a login page
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-50 absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
            Set a New Password
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Create a strong password to protect your account.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
