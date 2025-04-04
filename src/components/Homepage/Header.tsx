import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("http://localhost:5000/auth/protected", {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setUser(result.user.username);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    const interval = setInterval(getUser, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const res = await fetch("http://localhost:3000/auth/logout", {
      method: "post",
      credentials: "include",
    });
    if (res.ok) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header
      className={`py-6 w-full fixed top-0 transition-colors duration-300 z-50 backdrop-blur-md backdrop-filter bg-[#8ae0ea] ${
        isScrolled ? "shadow-md" : ""
      } text-white `}
    >
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
      <div className="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
        <Link href="/">
          <Image
            src="/icons/logo.webp"
            alt="Logo"
            width={120}
            height={30}
            className="h-full w-auto"
          />
        </Link>
        <nav className="flex items-center justify-end space-x-6 text-base">
      <Link
        href="/"
        className="text-white hover:text-yellow-300 transition-colors duration-300"
      >
        Home
      </Link>
      <Link
        href="/about"
        className="text-white hover:text-yellow-300 transition-colors duration-300"
      >
        About
      </Link>
      <Link
        href="/courses"
        className="text-white hover:text-yellow-300 transition-colors duration-300"
      >
        Courses
      </Link>
      <Link
        href="/contact"
        className="text-white hover:text-yellow-300 transition-colors duration-300"
      >
        Contact Us
      </Link>

      {isLoggedIn && user ? (
        <div className="relative">
          <button
            className="text-white hover:text-yellow-300 transition-colors duration-300"
            onClick={handleDropdown}
          >
            <User />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden z-10">
              <div className="px-4 py-2 border-b text-center font-medium">
                {user}
              </div>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 transition"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 hover:bg-gray-100 transition"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="border-2 border-white px-4 py-1 rounded-lg text-white hover:bg-white hover:text-[#edb4a9] transition duration-300"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="border-2 border-white bg-white px-4 py-1 rounded-lg text-[#edb4a9] hover:bg-transparent hover:text-white transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
      </div>
    </header>
  );
};

export default Header;
