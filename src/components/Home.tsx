import React from "react";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <header className="py-8 text-center bg-blue-600 text-white">
        <h1 className="text-4xl font-bold">Welcome to My Website</h1>
        <p className="mt-2 text-lg">This is a simple home page built with Next.js and TypeScript.</p>
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
