// pages/cart.jsx
import React, { useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Kursi: HTML, CSS & JavaScript",
      price: 70,
      quantity: 1,
      thumbnail: "/images/course1.jpg",
    },
    {
      id: 2,
      title: "Kursi: React për Fillestarë",
      price: 135,
      quantity: 1,
      thumbnail: "/images/course2.jpg",
    },
  ]);

  const [shippingCost, setShippingCost] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  const handleShippingChange = (e) => {
    setShippingCost(parseFloat(e.target.value));
  };

  const handleQuantityChange = (id, value) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: parseInt(value) || 1 }
          : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Left - Course Items */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex gap-4 items-center">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                className="w-12 border border-gray-300 text-center rounded"
              />
              <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}

        {/* Coupon and Update Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <input
            type="text"
            placeholder="Coupon code"
            className="border border-gray-300 px-4 py-2 rounded"
          />
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Apply coupon
          </button>
        </div>
      </div>

      {/* Right - Summary */}
      <div className="space-y-6 border border-gray-200 p-6 rounded-md">
        <h3 className="text-xl font-semibold">Cart Totals</h3>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping options */}
        <div>
          <h4 className="font-medium mb-2">Shipping</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping"
                value={0}
                checked={shippingCost === 0}
                onChange={handleShippingChange}
              />
              Free Shipping
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping"
                value={10}
                checked={shippingCost === 10}
                onChange={handleShippingChange}
              />
              Flat Rate: €10.00
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping"
                value={15}
                checked={shippingCost === 15}
                onChange={handleShippingChange}
              />
              Pickup: €15.00
            </label>
          </div>
        </div>

        <div className="flex justify-between border-t pt-4 font-bold text-lg">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>

        <a href="/checkout">
          <button className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
            Proceed to Checkout
          </button>
        </a>
      </div>
    </div>
  );
}
