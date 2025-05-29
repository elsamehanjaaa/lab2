import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { session_id } = router.query; // Get session_id from URL query parameters
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    // This effect runs when router.isReady changes or session_id from router.query changes.
    if (router.isReady) {
      // Ensure router.query is populated
      if (session_id) {
        // Optional: You might make an API call here to your backend to:
        // 1. Verify the session_id.
        // 2. Fetch order details.
        // 3. Confirm fulfillment status (though webhook is primary for fulfillment).
        // For now, we just display a success message.
        setMessage(`Payment Successful! Thank you for your purchase`);
        setIsLoading(false);
        // Example: clearCart(); // If you have a clearCart function from CartContext
      } else {
        // This case handles if router is ready but session_id is missing from query.
        setMessage(
          "Payment session ID not found. If you made a payment, please contact support."
        );
        setIsLoading(false);
      }
    }
  }, [session_id, router.isReady]); // Dependencies for the effect

  return (
    <div className="container mx-auto p-4 text-center min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        Payment Successful!
      </h1>
      {isLoading ? (
        <p className="text-lg text-gray-700">Verifying your payment...</p>
      ) : (
        <p className="text-lg text-gray-700 mb-6">{message}</p>
      )}
      {/* Links to other pages */}
      <Link href="/myCourses" legacyBehavior>
        <a className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md">
          Go to My Courses
        </a>
      </Link>
      <Link href="/" legacyBehavior>
        <a className="mt-4 text-indigo-600 hover:text-indigo-800">
          Back to Homepage
        </a>
      </Link>
    </div>
  );
}
