import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "@/components/ShoppingCart/CartContext";
import { ShoppingCartIcon } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useAuth } from "@/contexts/AuthContext";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  thumbnail_url?: string;
  slug: string;
  _id: string;
}

interface NavProps {
  course: Course;
  alreadyEnrolled: boolean;
}

const Nav: React.FC<NavProps> = ({ course, alreadyEnrolled }) => {
  const { isLoggedIn } = useAuth();
  const { setShowLogin } = useModalStore();
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);
  const { addToCart } = useCart();

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
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-all bg-[#201c24] text-white px-6 py-4 backdrop-blur-md w-full ${
        showNav ? "shadow-md" : ""
      } sticky top-[100px] z-40`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {course && (
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-semibold">{course.title}</h1>
            <div className="flex items-center mt-2">
              {/* Star Rating Logic Here */}
            </div>
          </div>
        )}

        {alreadyEnrolled ? (
          <Link
            href={`/learn/${course?.slug}/${course?._id}`}
            className="bg-white text-[#201c24] font-bold py-2 px-4 rounded transition-all duration-300 hover:bg-[#e9ada4] hover:text-white"
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

export default Nav;
