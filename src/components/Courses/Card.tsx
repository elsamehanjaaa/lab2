"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useCart } from "@/components/ShoppingCart/CartContext";
import { useModalStore } from "@/stores/modalStore";
import { ShoppingCartIcon } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  thumbnail_url?: string;
  slug: string;
  _id: string;
}

const Card = ({ course }: { course: Course }) => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { setShowLogin } = useModalStore();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }
    addToCart({
      id: course._id,
      courseId: course._id,
      title: course.title,
      price: course.price,
      quantity: 1,
      thumbnail: course.thumbnail_url || "/images/no-thumbnail.png",
    });
  };

  const renderStars = (rating: number) => {
    const parsedRating = Number(rating);
    const isValid = !isNaN(parsedRating) && parsedRating >= 0;
    const fullStars = Math.floor(isValid ? parsedRating : 0);
    const safeFullStars = Math.min(fullStars, 5);

    return (
      <div className="flex">
        {[...Array(safeFullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300 ease-in-out w-full max-w-sm cursor-pointer">
      <Link href={`/course/${course.slug}/${course._id}`} className="block">
        <div className="relative w-full h-48 sm:h-52 md:h-60 mb-4 group rounded-xl overflow-hidden">
          <Image
            src={course.thumbnail_url || "/images/no-thumbnail.png"}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority
          />
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
          {course.title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex justify-between items-center mb-2">
          <p className="text-indigo-600 font-bold text-lg">
            €{course.price.toFixed(2)}
          </p>
          <div className="flex items-center text-xs sm:text-sm">
            {renderStars(course.rating)}
            <span className="text-gray-500 ml-1">
              (
              {!isNaN(Number(course.rating))
                ? Number(course.rating).toFixed(1)
                : "0.0"}
              )
            </span>
          </div>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
          <span className={course.status ? "text-green-600" : "text-red-600"}>
            {course.status ? "Available" : "Unavailable"}
          </span>
          <span className="text-gray-400">
            {new Date(course.created_at).toLocaleDateString()}
          </span>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
        disabled={!course.status}
        type="button"
      >
        <ShoppingCartIcon size={18} />
        Add to Cart
      </button>
    </div>
  );
};

export default Card;
