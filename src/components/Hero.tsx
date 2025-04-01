import React from "react";

const Hero = () => {
  return (
    <div
      className="flex flex-col px-80 justify-center h-screen bg-gradient-to-r  text-white text-center p-4"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover", // Ensures the image covers the full screen width
        backgroundPosition: "left", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents tiling
      }}
    >
      <div className="w-[500px] flex flex-col justify-center items-start">
        <h1 className="text-6xl font-bold py-6 text-left">
          Online learning course
        </h1>
        <h3 className="text-xl font-semibold py-4 text-left">
          Build skills with courses, certificates, and degrees online from world
          class universities and companies.
        </h3>
        <button className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:cursor-pointer transition duration-300 ease-in-out mt-4">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
