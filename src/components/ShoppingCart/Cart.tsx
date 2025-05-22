import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2Icon, MinusIcon, PlusIcon, CreditCardIcon, TruckIcon, ShoppingCartIcon, ArrowLeftIcon, CheckCircleIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

// Sample initial cart data
const initialCartItems: CartItem[] = [
  {
    id: 1,
    title: "Kursi: HTML, CSS & JavaScript",
    price: 70,
    quantity: 1,
    thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 2,
    title: "Kursi: React për Fillestarë",
    price: 135,
    quantity: 1,
    thumbnail: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
];

// Valid coupon codes and their discount percentages
const validCoupons: Record<string, number> = {
  'WELCOME10': 10,
  'SAVE20': 20,
  'STUDENT15': 15
};

const Cart: React.FC = () => {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('shipping');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * couponDiscount) / 100;
  const total = subtotal - discountAmount + shippingCost;

  // Shipping options
  const shippingOptions = [
    { id: 'free', label: 'Free Shipping', description: 'Delivery in 10-12 business days', cost: 0 },
    { id: 'standard', label: 'Standard Shipping', description: 'Delivery in 5-7 business days', cost: 10 },
    { id: 'express', label: 'Express Shipping', description: 'Delivery in 2-3 business days', cost: 15 }
  ];

  // Handle quantity change
  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Handle removing an item
  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  // Apply coupon code
  const applyCoupon = () => {
    setCouponError(null);
    setCouponApplied(false);
    setCouponDiscount(0);
    
    if (validCoupons[couponCode]) {
      setCouponDiscount(validCoupons[couponCode]);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Please try again.');
    }
  };

  // Toggle expanded sections
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0;

  const handleProceedToCheckout = () => {
  // Your checkout logic here
  console.log("Proceeding to checkout...");
  
};
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
            <div className="flex items-center mt-2 text-sm">
              <ShoppingCartIcon size={16} className="mr-2 text-indigo-600" />
              <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</span>
            </div>
          </div>

          {isCartEmpty ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
                <ShoppingCartIcon size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any courses to your cart yet.</p>
              <a 
                href="#" 
                className="inline-flex items-center text-white bg-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
              >
                <ArrowLeftIcon size={16} className="mr-2" />
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Course Items</h2>
                      <span className="text-sm text-gray-500">{cartItems.length} items</span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Course Image */}
                          <div className="w-full sm:w-32 h-32 flex-shrink-0">
                            <div className="relative h-full w-full rounded-md overflow-hidden bg-gray-100 group">
                              <img 
                                src={item.thumbnail}
                                alt={item.title} 
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          
                          {/* Course Info */}
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                  <a href="#">{item.title}</a>
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Digital Course</p>
                              </div>
                              <div className="flex items-center text-gray-900 font-medium">
                                €{item.price.toFixed(2)}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-3">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                  <button 
                                    onClick={() => item.quantity > 1 && handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                  >
                                    <MinusIcon size={14} />
                                  </button>
                                  <input 
                                    type="text"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                    className="w-12 h-8 text-center text-sm border-0 focus:outline-none focus:ring-0"
                                  />
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                  >
                                    <PlusIcon size={14} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Subtotal and Remove */}
                              <div className="flex items-center justify-between gap-4">
                                <div className="font-medium text-gray-900">
                                  €{(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button 
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                                  aria-label="Remove item"
                                >
                                  <Trash2Icon size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <a 
                        href="#" 
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center transition-colors"
                      >
                        <ArrowLeftIcon size={16} className="mr-1" />
                        Continue Shopping
                      </a>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Apply Coupon</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className={`w-full px-4 py-3 rounded-md border ${
                          couponError ? 'border-red-300 bg-red-50' : 
                          couponApplied ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      />
                      {couponError && (
                        <p className="mt-1 text-sm text-red-600">{couponError}</p>
                      )}
                      {couponApplied && (
                        <p className="mt-1 text-sm text-green-600">Coupon applied successfully!</p>
                      )}
                    </div>
                    <button 
                      onClick={applyCoupon}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!couponCode}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-5">
                  {/* Price Breakdown */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Shipping Section */}
                  <div className="border-t border-b border-gray-100 py-5">
                    <button 
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => toggleSection('shipping')}
                    >
                      <div className="flex items-center">
                        <TruckIcon size={18} className="text-indigo-600 mr-2" />
                        <span className="font-medium">Shipping</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">€{shippingCost.toFixed(2)}</span>
                        <ChevronRightIcon 
                          size={16} 
                          className={`transform transition-transform ${
                            expandedSection === 'shipping' ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                    </button>
                    
                    {expandedSection === 'shipping' && (
                      <div className="mt-4 space-y-3 pl-7">
                        {shippingOptions.map((option) => (
                          <label 
                            key={option.id}
                            className={`
                              flex items-start p-3 rounded-md cursor-pointer transition-all
                              ${shippingCost === option.cost ? 'bg-indigo-50 border-indigo-200 border' : 'hover:bg-gray-50 border border-transparent'}
                            `}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={option.cost}
                              checked={shippingCost === option.cost}
                              onChange={() => setShippingCost(option.cost)}
                              className="mr-3 mt-1 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900">{option.label}</span>
                                <span className="text-gray-900">{option.cost === 0 ? 'Free' : `€${option.cost.toFixed(2)}`}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Methods Section */}
                  <div className="border-b border-gray-100 py-5">
                    <button 
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => toggleSection('payment')}
                    >
                      <div className="flex items-center">
                        <CreditCardIcon size={18} className="text-indigo-600 mr-2" />
                        <span className="font-medium">Payment Methods</span>
                      </div>
                      <ChevronRightIcon 
                        size={16} 
                        className={`transform transition-transform ${
                          expandedSection === 'payment' ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                    
                    {expandedSection === 'payment' && (
                      <div className="mt-4 space-y-3 pl-7">
                        <p className="text-sm text-gray-600">
                          All payment options will be available at checkout
                        </p>
                        <div className="flex gap-2 mt-2">
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">€{total.toFixed(2)}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link href="/checkout">
                  <button onClick={handleProceedToCheckout} className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm flex items-center justify-center">
                    <ShoppingBag size={18} className="mr-2" />
                    Proceed to Checkout
                  </button>
                  </Link>
                  
                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <CheckCircleIcon size={14} className="text-green-500 mr-1" />
                        Secure Checkout
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon size={14} className="text-green-500 mr-1" />
                        Money-back Guarantee
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;