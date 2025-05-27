'use client';

import React from 'react';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';
  const orderDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your order has been successfully placed and is being processed.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{orderDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200">
              <Download className="h-5 w-5 mr-2" />
              Download Receipt
            </button>

            <Link 
              href="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Return to Homepage
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>A confirmation email has been sent to your email address.</p>
            <p className="mt-1">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;