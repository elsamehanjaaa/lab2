import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link for navigation

const Home: React.FC = () => {
  return (
    <div>
      {/* Full Width Header Section */}
      <header className="py-9 bg-blue-600 text-white w-full">
        {/* Logo and Navigation */}
        <div className="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
          {/* Logo on the left */}
          <Link href="/home">
            <Image
              src="/path-to-your-logo.png" // Replace with your logo image path
              alt="Logo"
              width={120}
              height={30}
              className="h-full w-auto"
            />
          </Link>

          {/* Navigation Menu on the right */}
          <nav className="space-x-5 text-lg ml-auto">
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
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="py-12 text-center">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg">
          We are a team of developers passionate about building user-friendly web applications. Our goal is to provide high-quality solutions that meet the needs of our clients.
        </p>
      </main>

      {/* Footer Section */}
      <footer className="py-6 text-center bg-gray-800 text-white">
        <p>&copy; 2025 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
