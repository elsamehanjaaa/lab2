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
    const res = await fetch("http://localhost:5000/auth/logout", {
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
      className={`py-6 w-full fixed top-0 transition-colors duration-300 z-50 backdrop-blur-md backdrop-filter bg-white/30 ${
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
        <nav className="space-x-5 text-lg ml-auto flex">
          <Link href="/home" className="hover:text-yellow-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-yellow-300">
            About
          </Link>
          <Link href="/blog" className="hover:text-yellow-300">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-yellow-300">
            Contact Us
          </Link>
          {isLoggedIn && user ? (
            <div className="flex flex-col items-end">
              <div className="cursor-pointer" onClick={handleDropdown}>
                <User />
              </div>
              <div
                className={`${
                  isDropdownOpen ? "block" : "hidden"
                } absolute bg-white text-black z-10 rounded-lg shadow-lg mt-8 w-56`}
              >
                <span className="w-full h-9 flex justify-center items-center">
                  {user}
                </span>
                <hr className="mb-2" />
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Settings
                </Link>
                <div
                  className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link
                href="/login"
                className="border-2 border-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#edb4a9]"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="border-2 bg-white px-4 py-2 rounded-lg border-white hover:bg-transparent text-[#edb4a9] hover:text-white"
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
