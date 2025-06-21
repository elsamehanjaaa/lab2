"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useCart } from "@/components/ShoppingCart/CartContext";
import { useModalStore } from "@/stores/modalStore";
import { ShoppingCartIcon, Star } from "lucide-react";
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

const Card = ({
  course,
  alreadyEnrolled,
}: {
  course: Course;
  alreadyEnrolled: boolean;
}) => {
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
      <div className="flex items-center">
        {[...Array(safeFullStars)].map((_, i) => (
          <Star key={i} className="text-yellow-400 fill-current" size={16} />
        ))}
      </div>
    );
  };

  return (
    // Added 'border' and 'border-slate-200' for a visible outline
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-102">
      <Link
        href={`/course/${course.slug}/${course._id}`}
        className="flex flex-grow flex-col p-4"
      >
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={course.thumbnail_url || "/images/no-thumbnail.png"}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        <div className="flex flex-grow flex-col">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
            {course.title}
          </h2>

          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {course.description}
          </p>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-indigo-600">
                €{course.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-1">
                {renderStars(course.rating)}
                <span className="text-xs text-gray-500">
                  {!isNaN(Number(course.rating))
                    ? `(${Number(course.rating).toFixed(1)})`
                    : "(0.0)"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span
                className={`font-medium ${
                  course.status ? "text-green-600" : "text-red-600"
                }`}
              >
                {course.status ? "Available" : "Unavailable"}
              </span>
              <span className="text-gray-400">
                {new Date(course.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-2">
        {alreadyEnrolled ? (
          <Link
            href={`/learn/${course?.slug}/${course?._id}`}
            className="w-36 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            Go to Course
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-36 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            disabled={!course.status}
            type="button"
          >
            <ShoppingCartIcon size={18} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
