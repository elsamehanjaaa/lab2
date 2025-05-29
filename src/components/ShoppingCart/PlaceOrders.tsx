"use client"; // If it uses client-side hooks, otherwise remove if it's a server component

import React, { useEffect } from "react";
import { CheckCircle, ArrowLeft, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";

export interface OrderItem {
  id: string;
  price: number;
  thumbnail_url: string;
  title: string;
}
export interface OrderData {
  id: string;
  status: string;
  total_amount: number; // Assuming this is in cents
  currency: string;
  customer_email_at_purchase?: string;
  stripe_checkout_session_id_ref?: string;
  items: OrderItem[];
}

interface PlaceOrdersProps {
  order: OrderData;
}

const PlaceOrders: React.FC<PlaceOrdersProps> = ({ order }) => {
  const { clearCart } = useCart();

  useEffect(() => {
    if (order) {
      clearCart();
    }
  }, [order, clearCart]);
  const displayDate = new Date().toLocaleDateString();

  if (!order) {
    return <p>Loading order details or order not found...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Your order <span className="font-semibold">#{order.id}</span> has
            been successfully placed.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium break-all">{order.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{displayDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">
                  {order.status.replace(/_/g, " ").toLowerCase() || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">
                  {(order.total_amount / 100).toFixed(2)}{" "}
                  {order.currency.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          {order.items && order.items.length > 0 && (
            <div className="mb-8 text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4"
                  >
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-20 w-20 rounded object-cover"
                      />
                    )}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-700">
                        {item.title}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700">
                        {item.price.toFixed(2)} {order.currency.toUpperCase()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-4 flex flex-col">
            <button
              onClick={() =>
                alert("Receipt download functionality not yet implemented.")
              }
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Receipt
            </button>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Return to Homepage
              </Link>
              <Link
                href="/myCourses"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-green-600 hover:bg-green-700 transition duration-200"
              >
                View Enrolled Courses
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>
              A confirmation email has been sent to{" "}
              {order.customer_email_at_purchase || "your email address"}.
            </p>
            <p className="mt-1">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrders;
