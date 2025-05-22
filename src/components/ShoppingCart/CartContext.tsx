import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartContextType {
  cartItems: CartItem[];
  shippingCost: number;
  couponCode: string;
  couponDiscount: number;
  couponApplied: boolean;
  couponError: string | null;
  subtotal: number;
  discountAmount: number;
  total: number;
  updateCart: (items: CartItem[]) => void;
  updateShippingCost: (cost: number) => void;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  handleQuantityChange: (id: number, quantity: number) => void;
  handleRemoveItem: (id: number) => void;
}

// Valid coupon codes and their discount percentages
const validCoupons: Record<string, number> = {
  'WELCOME10': 10,
  'SAVE20': 20,
  'STUDENT15': 15
};

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  shippingCost: 0,
  couponCode: '',
  couponDiscount: 0,
  couponApplied: false,
  couponError: null,
  subtotal: 0,
  discountAmount: 0,
  total: 0,
  updateCart: () => {},
  updateShippingCost: () => {},
  setCouponCode: () => {},
  applyCoupon: () => {},
  handleQuantityChange: () => {},
  handleRemoveItem: () => {}
});

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

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [couponCode, setCouponCodeState] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * couponDiscount) / 100;
  const total = subtotal - discountAmount + shippingCost;

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        setCartItems(initialCartItems);
      }
    } else {
      setCartItems(initialCartItems);
    }
    
    // Load other cart state from localStorage
    const savedShippingCost = localStorage.getItem('shippingCost');
    if (savedShippingCost) setShippingCost(Number(savedShippingCost));
    
    const savedCouponCode = localStorage.getItem('couponCode');
    if (savedCouponCode) setCouponCodeState(savedCouponCode);
    
    const savedCouponDiscount = localStorage.getItem('couponDiscount');
    if (savedCouponDiscount) setCouponDiscount(Number(savedCouponDiscount));
    
    const savedCouponApplied = localStorage.getItem('couponApplied');
    if (savedCouponApplied) setCouponApplied(savedCouponApplied === 'true');
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('shippingCost', shippingCost.toString());
    localStorage.setItem('couponCode', couponCode);
    localStorage.setItem('couponDiscount', couponDiscount.toString());
    localStorage.setItem('couponApplied', couponApplied.toString());
  }, [cartItems, shippingCost, couponCode, couponDiscount, couponApplied]);

  // Update cart items
  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  // Update shipping cost
  const updateShippingCost = (cost: number) => {
    setShippingCost(cost);
  };

  // Set coupon code
  const setCouponCode = (code: string) => {
    setCouponCodeState(code);
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingCost,
        couponCode,
        couponDiscount,
        couponApplied,
        couponError,
        subtotal,
        discountAmount,
        total,
        updateCart,
        updateShippingCost,
        setCouponCode,
        applyCoupon,
        handleQuantityChange,
        handleRemoveItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);