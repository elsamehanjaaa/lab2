import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useCart } from "@/components/ShoppingCart/CartContext"; // Make sure path is correct

// Define the shape of a course
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
  const { addToCart } = useCart();

  const renderStars = (rating: number) => {
    return Array.from({ length: Math.floor(rating) }, (_, i) => (
      <span key={i} className="text-yellow-500 mr-1">★</span>
    ));
  };

  const handleAddToCart = () => {
    if (typeof addToCart === "function") {
      addToCart(course);
    } else {
      console.error("addToCart is not a function. Check your CartContext setup.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300 ease-in-out w-full max-w-sm">
      <Link href={`/course/${course.slug}/${course._id}`}>
        <div className="relative w-full h-48 sm:h-52 md:h-60 mb-4 cursor-pointer">
          <Image
            src={course.thumbnail_url || "/images/no-thumbnail.png"}
            alt={course.title}
            fill
            className="rounded-t-xl object-cover"
            sizes="(max-width: 640px) 100vw,
                   (max-width: 768px) 50vw,
                   33vw"
          />
        </div>
      </Link>

      <h2 className="text-lg sm:text-xl font-bold mb-2">{course.title}</h2>
      <p className="text-gray-600 text-sm sm:text-base mb-3">{course.description}</p>

      <p className="text-xs sm:text-sm text-gray-500 mb-1">
        <strong>Price:</strong> ${course.price}
      </p>

      <div className="flex items-center text-xs sm:text-sm mb-2">
        {renderStars(course.rating)}
        <span className="text-gray-500 ml-1">({course.rating})</span>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 mb-1">
        <strong>Status:</strong> {course.status ? "Available" : "Unavailable"}
      </p>

      <p className="text-xs sm:text-sm text-gray-400 mb-4">
        <strong>Created:</strong> {new Date(course.created_at).toLocaleDateString()}
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200"
      >
        Shto në shportë
      </button>
    </div>
  );
};

export default Card;
