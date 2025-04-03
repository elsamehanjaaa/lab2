import React from "react";
import Link from "next/link";
import { BookOpenIcon, UserIcon, ClockIcon } from "@heroicons/react/outline";
import Block from "./Block"; // ose rruga e saktë: "../components/Blocks"

const Hero = () => {
  // Kategoritë
  const categories = [
    { title: "ChatGPT", learners: "4M+" },
    { title: "Data Science", learners: "7M+" },
    { title: "Python", learners: "47.7M+" },
    { title: "Machine Learning", learners: "8M+" },
    { title: "Deep Learning", learners: "2M+" },
    { title: "AI", learners: "4M+" },
    { title: "Statistics", learners: "1M+" },
    { title: "NLP", learners: "811,403" },
  ];

  // Kurset
  const courses = [
    {
      image: "/images/course1.png",
      title: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
      rating: 4.5,
      reviews: "45,903",
      price: "€9.99",
      oldPrice: "€54.99",
      bestSeller: true,
    },
    {
      image: "/images/course2.png",
      title: "The Complete AI-Powered Copywriting Course & ChatGPT...",
      rating: 4.3,
      reviews: "1,816",
      price: "€9.99",
      oldPrice: "€48.99",
    },
    {
      image: "/images/course3.png",
      title: "ChatGPT, DeepSeek, Grok and 30+ More AI Marketing Assistants",
      rating: 4.5,
      reviews: "533",
      price: "€10.99",
      oldPrice: "€48.99",
    },
    {
      image: "/images/course4.png",
      title: "Mastering SEO With ChatGPT: Ultimate Beginner's Guide",
      rating: 4.4,
      reviews: "284",
      price: "€10.99",
      oldPrice: "€10.99",
    },
  ];

  // Logot e kompanive
  const brandLogos = [
    "/images/volkswagen.png",
    "/images/samsung.png",
    "/images/cisco.png",
    "/images/vimeo.png",
    "/images/pg.png",
    "/images/hpe.png",
    "/images/citi.png",
    "/images/ericsson.png",
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="flex flex-col lg:px-40 md:px-20 px-6 justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[600px] flex flex-col justify-center items-start mt-16 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-extrabold py-6 text-left leading-tight">
            Online learning course
          </h1>
          <h3 className="text-lg md:text-xl font-medium py-4 text-left">
            Build skills with courses, certificates, and degrees online from
            world-class universities and companies.
          </h3>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition duration-300 ease-in-out mt-4">
            Get Started
          </button>
        </div>
      </div>

      {/* --- 3 Blocks Section: poshtë Hero-s, sipër kategorive --- */}
      <div className="bg-gray-100 py-12">
        {/* Rresht me 3 Block */}
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-8">
          <Block
            icon={BookOpenIcon}
            title="60+ UX Courses"
            description="The automated process all your website tasks."
          />
          <Block
            icon={UserIcon}
            title="Expert Instructors"
            description="The automated process all your website tasks."
          />
          <Block
            icon={ClockIcon}
            title="Life time access"
            description="The automated process all your website tasks."
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-6 md:px-20 py-8 bg-gray-50">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow-sm hover:shadow-md font-medium transition transform hover:-translate-y-0.5"
            >
              {cat.title}{" "}
              <span className="text-sm text-gray-500">
                ({cat.learners} learners)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-6 md:px-20 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transform transition hover:-translate-y-1"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-gray-800">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center text-sm mb-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold mr-2">{course.rating}</span>
                  <span className="text-gray-500">({course.reviews})</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-bold text-xl text-blue-600">
                    {course.price}
                  </span>
                  {course.oldPrice && (
                    <span className="text-gray-500 line-through ml-2">
                      {course.oldPrice}
                    </span>
                  )}
                </div>
                {course.bestSeller && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    Bestseller
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
        <Link href="/courses" className="text-blue-600 hover:underline font-semibold">
            Show all Data Science courses
        </Link>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-gray-50 px-6 md:px-20 py-8 text-center">
        <h2 className="text-xl md:text-2xl font-semibold mb-8">
          Trusted by over 16,000 companies and millions of learners around the
          world
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {brandLogos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt="Brand Logo"
              className="h-10 object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
