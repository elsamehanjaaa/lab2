// pages/checkout/index.tsx
import React from "react";

const CheckoutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {/* Billing Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Billing Details</h3>
          <input type="text" placeholder="Full Name" className="w-full mb-4 px-4 py-2 border rounded" />
          <input type="email" placeholder="Email Address" className="w-full mb-4 px-4 py-2 border rounded" />
          <input type="text" placeholder="Phone Number" className="w-full mb-4 px-4 py-2 border rounded" />
          <input type="text" placeholder="Address" className="w-full mb-4 px-4 py-2 border rounded" />
        </div>

        {/* Order Summary */}
        <div className="border border-gray-300 p-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Your Order</h3>

          <div className="flex justify-between mb-2">
            <span>Kursi: HTML, CSS & JavaScript</span>
            <span>€70.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Kursi: React për Fillestarë</span>
            <span>€135.00</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>€205.00</span>
          </div>

          <button className="w-full mt-6 bg-black text-white py-3 rounded hover:bg-gray-800">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
