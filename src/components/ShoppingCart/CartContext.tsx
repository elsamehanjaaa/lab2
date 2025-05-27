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
  clearCart: () => void;
}

// Kuponat valide
const validCoupons: Record<string, number> = {
  'WELCOME10': 10,
  'SAVE20': 20,
  'STUDENT15': 15,
};

// Krijo context me vlerat fillestare
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
  handleRemoveItem: () => {},
  clearCart: () => {},
});

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

  // Llogaritjet
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * couponDiscount) / 100;
  const total = subtotal - discountAmount + shippingCost;

  // Ngarko të dhënat nga localStorage në fillim
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      };

      const savedShippingCost = localStorage.getItem('shippingCost');
      if (savedShippingCost) setShippingCost(Number(savedShippingCost));

      const savedCouponCode = localStorage.getItem('couponCode');
      if (savedCouponCode) setCouponCodeState(savedCouponCode);

      const savedCouponDiscount = localStorage.getItem('couponDiscount');
      if (savedCouponDiscount) setCouponDiscount(Number(savedCouponDiscount));

      const savedCouponApplied = localStorage.getItem('couponApplied');
      if (savedCouponApplied) setCouponApplied(savedCouponApplied === 'true');
    } catch (error) {
      console.error('Gabim gjatë ngarkimit nga localStorage:', error);
    }
  }, []);

  // Ruaj të dhënat në localStorage kur ndryshojnë
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('shippingCost', shippingCost.toString());
    localStorage.setItem('couponCode', couponCode);
    localStorage.setItem('couponDiscount', couponDiscount.toString());
    localStorage.setItem('couponApplied', couponApplied.toString());
  }, [cartItems, shippingCost, couponCode, couponDiscount, couponApplied]);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  const updateShippingCost = (cost: number) => {
    setShippingCost(cost);
  };

  const setCouponCode = (code: string) => {
    setCouponCodeState(code);
  };

  const applyCoupon = () => {
    setCouponError(null);
    setCouponApplied(false);
    setCouponDiscount(0);

    if (validCoupons[couponCode]) {
      setCouponDiscount(validCoupons[couponCode]);
      setCouponApplied(true);
    } else {
      setCouponError('Kodi i kuponit nuk është valid.');
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
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
        handleRemoveItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook për të përdorur kontekstin
export const useCart = () => useContext(CartContext);
