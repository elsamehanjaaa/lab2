// src/pages/payment-cancel.tsx
import React from "react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto p-4 text-center min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Payment Cancelled
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Your payment was not completed. Your cart has been saved.
      </p>
      <Link href="/cartpage" legacyBehavior>
        {/* Or your cart page, assuming 'cartpage' exists */}
        <a className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md">
          Return to Cart
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
