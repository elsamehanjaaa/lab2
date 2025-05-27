'use client'

import React from 'react';
import {
  ShoppingBag, 
  Trash2Icon, 
  MinusIcon, 
  PlusIcon,
  ShoppingCartIcon, 
  ArrowLeftIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/ShoppingCart/CartContext';
import { useRouter } from 'next/router';

const CartPage: React.FC = () => {
  const {
    cartItems,
    handleRemoveItem,
    handleQuantityChange,
    shippingCost,
    couponCode,
    setCouponCode,
    applyCoupon,
    couponDiscount,
    couponApplied,
    couponError,
    subtotal,
    discountAmount,
    total
  } = useCart();

  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <ShoppingCartIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg mb-6">Your cart is currently empty.</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
              <ArrowLeftIcon className="inline mr-2" size={16} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm transition-all hover:shadow-md">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image 
                      src={item.thumbnail} 
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 px-4">
                    <h2 className="font-medium line-clamp-1">{item.title}</h2>
                    <p className="text-indigo-600 font-semibold">€{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                  <div className="px-4 font-semibold">€{(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)} 
                    className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2Icon size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon & Summary */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-3">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button 
                    onClick={applyCoupon} 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-600 mt-2 text-sm">{couponError}</p>}
                {couponApplied && <p className="text-green-600 mt-2 text-sm">Coupon applied successfully! {couponDiscount}% off your order.</p>}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-€{discountAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>€{shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                   onClick={() => router.push('/checkout')}
                   className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4 transition-all transform hover:scale-[1.02]">
                    <ShoppingBag className="inline mr-2" size={18} /> Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;