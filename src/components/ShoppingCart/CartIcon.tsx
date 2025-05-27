'use client'

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from './CartContext';

const CartIcon: React.FC = () => {
  const { cartItems } = useCart();

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cartpage">
      <div className="relative p-2 cursor-pointer group">
        <ShoppingCart 
          className="text-gray-700 group-hover:text-indigo-600 transition-colors" 
          size={24}
        />
        {totalItems > 0 && (
          <div className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
            {totalItems}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;