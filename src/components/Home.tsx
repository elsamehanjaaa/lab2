import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link for navigation

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <header className="py-8 text-center bg-blue-600 text-white">
        {/* Logo with navigation */}
        <div className="flex justify-center items-center space-x-6">
          <Link href="/home">
            <Image
              src="/path-to-your-logo.png" // Replace with your logo image path
              alt="Logo"
              width={120}
              height={30}
              className="h-full w-auto"
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="space-x-4 text-lg">
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
              Contact
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
