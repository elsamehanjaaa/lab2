"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import {
  CircleUserRound,
  User,
  ShoppingBag,
  LogOut,
  Settings,
  LayoutDashboard,
  BookUser,
  PlusSquare,
} from "lucide-react";
import LoginModal from "../Login/LoginModal";
import SignupModal from "../Login/SignupModal";
import ResetPasswordModal from "../Login/ResetPasswordModal";
import Search from "../Search/Search";
import { useModalStore } from "@/stores/modalStore";
import { useCart } from "@/components/ShoppingCart/CartContext";

import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, isLoggedIn, logout: authLogout, initialLoading } = useAuth();
  const { cartItems, clearCart } = useCart();
  const {
    showLogin,
    showSignup,
    showResetPassword,
    setShowLogin,
    setShowSignup,
    setShowResetPassword,
    closeAllModals,
  } = useModalStore();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleShowLogin() {
    closeAllModals();
    setIsMenuOpen(false);
    setShowLogin(true);
  }
  function handleShowSignup() {
    closeAllModals();
    setIsMenuOpen(false);
    setShowSignup(true);
  }
  function handleShowResetPassword() {
    closeAllModals();
    setIsMenuOpen(false);
    setShowResetPassword(true);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleUserLogout = async () => {
    try {
      await authLogout();
      clearCart();
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsDropdownOpen(false);
  };

  if (initialLoading && !user) {
    // Optionally render a slimmed-down header or a loading indicator for the user section
    // For simplicity, we can just let it render and the conditional logic below will handle it
  }

  const loggedIn = isLoggedIn();
  const currentUser = user;

  return (
    <>
      <header
        className={`py-6 w-full fixed top-0 transition-colors duration-300 z-30 backdrop-blur-md backdrop-filter bg-[#192847] ${
          isScrolled ? "shadow-md" : ""
        } text-white `}
      >
        <div className="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
          <Link href="/">
            <Image
              src="/icons/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="h-16 w-auto"
              quality={100}
            />
          </Link>

          <div className="flex-1 hidden sm:block px-4">
            <Search />
          </div>

          <nav className="hidden md:flex items-center justify-end space-x-6 text-base">
            <Link
              href="/"
              className="text-white hover:text-[#edb4a9] transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-[#edb4a9] transition-colors duration-300"
            >
              About
            </Link>
            <Link
              href="/courses"
              className="text-white hover:text-[#edb4a9] transition-colors duration-300"
            >
              Courses
            </Link>
            <Link
              href="/contactus"
              className="text-white hover:text-[#edb4a9] transition-colors duration-300"
            >
              Contact Us
            </Link>
            <Link href="/cartpage" className="text-3xl relative inline-block">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[1.25rem] h-5">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {loggedIn && currentUser ? (
              <div className="relative group">
                <button
                  onClick={handleDropdownToggle}
                  className="text-white hover:text-[#edb4a9] transition-colors duration-300 flex items-center"
                >
                  <User size={20} />
                </button>
                {isDropdownOpen && (
                  <div className="z-40 absolute right-0 mt-2 w-60 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 transform opacity-100 scale-100">
                    <div className="px-4 py-3 border-b flex items-center space-x-3">
                      <CircleUserRound size={40} className="text-blue-900" />
                      <div>
                        <h1 className="font-semibold text-sm">
                          {currentUser.username}
                        </h1>
                        <h3 className="text-xs text-gray-600">
                          {currentUser.email}
                        </h3>
                      </div>
                    </div>
                    {currentUser.isTeacher ? (
                      <Link
                        href="/instructor"
                        onClick={() => setIsDropdownOpen(false)}
                        className=" px-4 py-2 hover:bg-gray-100 transition text-sm flex items-center gap-2"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/join/instructor"
                        onClick={() => setIsDropdownOpen(false)}
                        className=" px-4 py-2 hover:bg-gray-100 transition text-sm flex items-center gap-2"
                      >
                        <PlusSquare size={16} />
                        Start Teaching
                      </Link>
                    )}
                    <Link
                      href="/myCourses"
                      onClick={() => setIsDropdownOpen(false)}
                      className=" px-4 py-2 hover:bg-gray-100 transition text-sm flex items-center gap-2"
                    >
                      <BookUser size={16} />
                      My Courses
                    </Link>
                    <hr />
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className=" px-4 py-2 hover:bg-gray-100 transition text-sm flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className=" px-4 py-2 hover:bg-gray-100 transition text-sm flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <hr />
                    <button
                      onClick={handleUserLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShowLogin}
                  className="border-2 cursor-pointer border-white px-4 py-1 rounded-lg text-white hover:bg-white hover:text-[#192847] transition duration-300"
                >
                  Log In
                </button>
                <button
                  onClick={handleShowSignup}
                  className="border-2 cursor-pointer border-white bg-white px-4 py-1 rounded-lg text-[#192847] hover:bg-transparent hover:text-white transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden text-white ml-4"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#192847] text-white px-4 pt-4 pb-6 absolute top-full left-0 w-full shadow-lg">
            {" "}
            {/* Added absolute positioning */}
            <div className="flex flex-col space-y-4">
              <Search />
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300 py-2"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300 py-2"
              >
                About
              </Link>
              <Link
                href="/courses"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300 py-2"
              >
                Courses
              </Link>
              <Link
                href="/contactus"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300 py-2"
              >
                Contact Us
              </Link>
              <Link
                href="/cartpage"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl py-2 flex items-center gap-2"
              >
                <ShoppingBag size={20} /> Cart
                {cartItems.length > 0 && (
                  <span className="text-sm bg-red-500 rounded-full px-2 py-0.5">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <hr className="border-gray-700" />

              {loggedIn && currentUser ? (
                <>
                  <div className="px-2 py-3 border-b border-gray-700 flex items-center space-x-3">
                    <CircleUserRound size={36} />
                    <div>
                      <h1 className="font-semibold text-sm">
                        {currentUser.username}
                      </h1>
                      <h3 className="text-xs text-gray-500">
                        {currentUser.email}
                      </h3>
                    </div>
                  </div>
                  {currentUser.isTeacher ? (
                    <Link
                      href="/instructor"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 hover:text-[#edb4a9] flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/join/instructor"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 hover:text-[#edb4a9] flex items-center gap-2"
                    >
                      <PlusSquare size={16} />
                      Start Teaching
                    </Link>
                  )}
                  <Link
                    href="/myCourses"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 hover:text-[#edb4a9] flex items-center gap-2"
                  >
                    <BookUser size={16} />
                    My Courses
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 hover:text-[#edb4a9] flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 hover:text-[#edb4a9] flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <hr className="border-gray-700" />
                  <button
                    onClick={handleUserLogout}
                    className="w-full text-left py-2 hover:text-[#edb4a9] text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleShowLogin}
                    className="border-2 cursor-pointer border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-[#192847] transition duration-300"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleShowSignup}
                    className="border-2 cursor-pointer border-white bg-white px-4 py-2 rounded-lg text-[#192847] hover:bg-transparent hover:text-white transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onResetPassword={handleShowResetPassword}
        />
      )}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      {showResetPassword && (
        <ResetPasswordModal
          onClose={() => setShowResetPassword(false)}
          onLogin={handleShowLogin}
        />
      )}
    </>
  );
};

export default Header;
