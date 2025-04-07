import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import LoginModal from "../Login/LoginModal";
import SignupModal from "../Login/SignupModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
    const getTokenFromCookies = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; access_token=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
    };

    const token = getTokenFromCookies();
    if (!token) return;
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
        setUser("");
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
      setUser(undefined);
    }
  };

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <header
        className={`py-6 w-full fixed top-0 transition-colors duration-300 z-10 backdrop-blur-md backdrop-filter bg-[#74a0ff] ${
          isScrolled ? "shadow-md" : ""
        } text-white `}
      >
        <div className="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
          <Link href="/">
            <Image
              src="/icons/30786f1e-5c02-4f02-8365-671e26262182.png"
              alt="Logo"
              width={60} // më e vogël
              height={60}
              className="h-10 w-auto" // ose mund të bësh `h-8` për edhe më të vogël
            />
          </Link>
          <nav className="flex items-center justify-end space-x-6 text-base">
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
              className="text-white hover:text-[#edb4a9]  transition-colors duration-300"
            >
              Courses
            </Link>
            <Link
              href="/contactus"
              className="text-white hover:text-[#edb4a9]  transition-colors duration-300"
            >
              Contact Us
            </Link>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  className="text-white hover:text-pink-600  transition-colors duration-300"
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
                <button
                  onClick={() => setShowLogin(true)}
                  className="border-2 cursor-pointer border-white px-4 py-1 rounded-lg text-white hover:bg-white hover:text-[#edb4a9] transition duration-300"
                >
                  Log In
                </button>

                <button
                  onClick={() => setShowSignup(true)}
                  className="border-2 cursor-pointer border-white bg-white px-4 py-1 rounded-lg text-[#edb4a9] hover:bg-transparent hover:text-white transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Header;
