import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter hook
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import LoginModal from "../Login/LoginModal";
import SignupModal from "../Login/SignupModal";
import ResetPasswordModal from "../Login/ResetPasswordModal";
import Search from "../Search/Search";
import { fetchUser } from "@/utils/fetchUser";
import { handleLogout } from "@/utils/handleLogout";

const Header = () => {
  const router = useRouter(); // Use useRouter to access the route
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | undefined>(undefined);

  // State for modals
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // State for dropdown (when user is logged in)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleShowLogin() {
    closeAllModals();
    setShowLogin(true);
  }

  function handleShowSignup() {
    closeAllModals();
    setShowSignup(true);
  }

  function handleShowResetPassword() {
    closeAllModals();
    setShowResetPassword(true);
  }

  function closeAllModals() {
    setShowResetPassword(false);
    setShowLogin(false);
    setShowSignup(false);
  }

  // Listen for scroll to add a shadow or style changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Fetch user info based on token
  useEffect(() => {
    const getTokenFromCookies = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; access_token=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
    };

    const token = getTokenFromCookies();
    if (!token) return;

    const getUser = async () => {
      const result = await fetchUser();
      setUser(result.user.username);
      setIsLoggedIn(true);
    };

    // Poll user data every second (could also use another approach)
    const interval = setInterval(getUser, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle logout
  const handleUserLogout = async () => {
    const res = await handleLogout();
    if (res.ok) {
      setIsLoggedIn(false);
      setUser(undefined);
    }
  };

  // Handle profile dropdown
  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close the user dropdown if it's open
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`py-6 w-full fixed top-0 transition-colors duration-300 z-10 backdrop-blur-md backdrop-filter bg-[#192847] ${
          isScrolled ? "shadow-md" : ""
        } text-white `}
      >
        <div className="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
          {/* Logo */}
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

          {/* Search (always visible; adjust if you want to hide on mobile) */}
          <div className="flex-1 hidden sm:block px-4">
            <Search />
          </div>

          {/* Desktop Nav (hidden on mobile) */}
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

            {/* If logged in, show profile dropdown */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  className="text-white hover:text-pink-600 transition-colors duration-300"
                  onClick={handleDropdown}
                >
                  <User />
                </button>
                {isDropdownOpen && (
                  <div className="z-30 absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-2 border-b text-center font-medium">
                      {user}
                    </div>
                    <Link
                      href="/myCourses"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      My Courses
                    </Link>
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
                      onClick={handleUserLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* If not logged in, show login and signup buttons */
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShowLogin}
                  className="border-2 cursor-pointer border-white px-4 py-1 rounded-lg text-white hover:bg-white hover:text-[#edb4a9] transition duration-300"
                >
                  Log In
                </button>
                <button
                  onClick={handleShowSignup}
                  className="border-2 cursor-pointer border-white bg-white px-4 py-1 rounded-lg text-[#edb4a9] hover:bg-transparent hover:text-white transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button (hamburger) - visible only on mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white ml-4"
            aria-label="Toggle Menu"
          >
            {/* Simple "hamburger" icon */}
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

        {/* Mobile Nav (shown when isMenuOpen is true, hidden on md and up) */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#192847] text-white px-4 pt-4 pb-6">
            <div className="flex flex-col space-y-4">
              <Search />

              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300"
              >
                About
              </Link>
              <Link
                href="/courses"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300"
              >
                Courses
              </Link>
              <Link
                href="/contactus"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#edb4a9] transition-colors duration-300"
              >
                Contact Us
              </Link>

              {isLoggedIn && user ? (
                <>
                  <button
                    onClick={handleDropdown}
                    className="flex items-center gap-2"
                  >
                    <User />
                    <span>{user}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="bg-white text-black rounded-lg p-2 space-y-2">
                      <Link
                        href="/myCourses"
                        className="block px-2 py-1 hover:bg-gray-100 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Courses
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-2 py-1 hover:bg-gray-100 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-2 py-1 hover:bg-gray-100 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleUserLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      handleShowLogin();
                      setIsMenuOpen(false);
                    }}
                    className="border-2 cursor-pointer border-white px-4 py-1 rounded-lg text-white hover:bg-white hover:text-[#edb4a9] transition duration-300"
                  >
                    Log In
                  </button>

                  <button
                    onClick={() => {
                      handleShowSignup();
                      setIsMenuOpen(false);
                    }}
                    className="border-2 cursor-pointer border-white bg-white px-4 py-1 rounded-lg text-[#edb4a9] hover:bg-transparent hover:text-white transition duration-300"
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
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      {showResetPassword && (
        <ResetPasswordModal
          onClose={() => setShowResetPassword(false)}
          onLogin={handleShowLogin}
        />
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onResetPassword={handleShowResetPassword}
        />
      )}
    </>
  );
};

export default Header;
