import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    <div>
      <h3 className="text-xl font-semibold mb-4">Company</h3>
      <ul>
        <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Support</h3>
      <ul>
        <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
      <div className="flex space-x-4">
        <a href="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  </div>

  <div className="mt-8 text-center text-gray-400">
    <p>&copy; 2025 Your Company Name. All rights reserved.</p>
  </div>
</footer>

  );
};

export default Footer;
