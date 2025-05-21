import React, { createContext, useContext, useState, ReactNode } from "react";

interface Course {
  _id: string;
  title: string;
  price: number;
  thumbnail_url?: string;
  quantity?: number;
}

interface CartContextType {
  cart: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Course[]>([]);

  const addToCart = (course: Course) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === course._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === course._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...course, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
