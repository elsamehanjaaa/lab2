'use client'

import React, { useState } from 'react';
import { CreditCardIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/ShoppingCart/CartContext';
import { useRouter } from 'next/router'; 

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutComponent: React.FC = () => {
  const { cartItems, subtotal, shippingCost, discountAmount, total } = useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) 
      errors.cardNumber = "Card number must be 16 digits";
    if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) 
      errors.expiryDate = "Expiry date must be in MM/YY format";
    if (!formData.cvv.trim()) errors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(formData.cvv)) errors.cvv = "CVV must be 3 or 4 digits";
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
   setTimeout(() => {
  console.log('Order submitted:', { formData, items: cartItems, total });
  setIsSubmitting(false);
  router.push('/placeorder'); // Redirect here
}, 1500);
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
        <div className="mb-8">
          <Link 
            href="/cartpage"
            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center text-sm font-medium transition-colors"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Cart
          </Link>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="mb-6 text-gray-600">Add some items to your cart before checking out.</p>
            <Link 
              href="/"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border ${formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                        required
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-6">
                    <TruckIcon size={20} className="text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border ${formErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                        required
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.country && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.postalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.postalCode && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-6">
                    <CreditCardIcon size={20} className="text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold">Payment Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-2 rounded-md border ${formErrors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                        required
                      />
                      {formErrors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className={`w-full px-4 py-2 rounded-md border ${formErrors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-colors`}
                          required
                        />
                        {formErrors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Order Button (Mobile) */}
                <div className="lg:hidden">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600 font-medium">-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-base font-medium pt-4 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button (Desktop) */}
                <button 
                  onClick={() => router.push('/placeorder')}
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="hidden lg:block w-full mt-8 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                  <ShieldCheckIcon size={16} className="text-green-500 mr-2" />
                  Secure Checkout
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CheckCircleIcon size={14} className="text-green-500 mr-1" />
                      Money-back Guarantee
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon size={14} className="text-green-500 mr-1" />
                      Secure Payment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutComponent;