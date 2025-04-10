import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, User, Clock, } from "lucide-react";
import Link from "next/link";

// Data
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

const courses = [
  {
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    title: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
    rating: 4.5,
    reviews: "45,903",
  },
  {
    image:
      "https://images.unsplash.com/photo-1677442136184-d74f8d98c1b7?auto=format&fit=crop&w=800&q=80",
    title: "The Complete AI-Powered Copywriting Course & ChatGPT...",
    rating: 4.3,
    reviews: "1,816",

  },
  {
    image:
      "https://images.unsplash.com/photo-1677442136469-31da8010f192?auto=format&fit=crop&w=800&q=80",
    title: "ChatGPT, DeepSeek, Grok and 30+ More AI Marketing Assistants",
    rating: 4.5,
    reviews: "533",
    
  },
  {
    image:
      "https://images.unsplash.com/photo-1677442136472-ae570f4fca3c?auto=format&fit=crop&w=800&q=80",
    title: "Mastering SEO With ChatGPT: Ultimate Beginner's Guide",
    rating: 4.4,
    reviews: "284",
  
  },
];

const brandLogos = [
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=200&h=80&q=80",
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=200&h=80&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=200&h=80&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=200&h=80&q=80",
];

const testimonials = [
  {
    name: "Erjona Ballou",
    title: "Health and Safety Officer",
    image: "/testimonials/alexandre-abitbol.jpg",
    quote: "Online learning has changed my mind.",
  },
  {
    name: "Dior Odiaka",
    title: "Assistant Nurse",
    image:
      "/testimonials/charlotte-triggs-headshot-7ef4504afc244ec99096e5fc0c1a3b63.jpg",
    quote: "I got my dream job with Alison.",
  },
  {
    name: "Elsa Ballou",
    title: "Health and Safety Officer",
    image: "/testimonials/alexandre-abitbol.jpg",
    quote: "Online learning has changed my mind.",
  },
  {
    name: "Arion Odiaka",
    title: "Assistant Nurse",
    image:
      "/testimonials/charlotte-triggs-headshot-7ef4504afc244ec99096e5fc0c1a3b63.jpg",
    quote: "I got my dream job with Alison.",
  },
  // More testimonials can be added here
];

const Block: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="flex-1 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="inline-block p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl mb-4">
      <Icon className="w-8 h-8 text-indigo-600" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/course.avif')] bg-cover bg-center opacity-55" />
        <div className="absolute inset-0 bg-blue-950 opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-950 hover:text-blue-300 transition duration-300">
              Online Learning Course
            </h1>
            <p className="text-xl font-semibold md:text-2xl text-blue-100 mb-8">
              Build skills with courses, certificates, and degrees online from
              world-class universities and companies.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Block
              icon={BookOpen}
              title="60+ UX Courses"
              description="Access comprehensive courses crafted by industry experts"
            />
            <Block
              icon={User}
              title="Expert Instructors"
              description="Learn from professionals with real-world experience"
            />
            <Block
              icon={Clock}
              title="Lifetime Access"
              description="Study at your own pace with unlimited course access"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat, i) => (
              <button
                key={i}
                className="bg-white hover:bg-indigo-50 text-gray-800 px-6 py-3 rounded-full shadow-sm hover:shadow-md font-medium transition-all duration-300 group"
              >
                {cat.title}{" "}
                <span className="text-sm text-indigo-600 group-hover:text-indigo-700">
                  ({cat.learners})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <Image
                    width={800}
                    height={800}
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center text-sm mb-3">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-semibold mr-2">{course.rating}</span>
                    <span className="text-gray-500">({course.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Show all Courses →
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-gray-50 py-10 md:px-40">
        <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ChatGPT section */}
          <div>
            <h3 className="text-xl font-bold mb-2">ChatGPT is a top skill</h3>
            <a href="#" className="text-purple-600 font-medium hover:underline">
              See ChatGPT courses →
            </a>
            <p className="text-gray-500 mt-1">4,345,758 learners</p>

            <button className="mt-6 px-4 py-2 border border-purple-600 text-purple-700 rounded-md hover:bg-purple-50 transition">
              Show all trending skills →
            </button>
          </div>

          {/* Development */}
          <div>
            <h4 className="text-lg font-bold mb-3">Development</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Python →
                </Link>
                <p className="text-sm text-gray-500">47,815,126 learners</p>
              </li>
              <li>
              <Link
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Web Development →
                  </Link>
                <p className="text-sm text-gray-500">14,015,184 learners</p>
              </li>
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Data Science →
                </a>
                <p className="text-sm text-gray-500">7,793,156 learners</p>
              </li>
            </ul>
          </div>

          {/* Design */}
          <div>
            <h4 className="text-lg font-bold mb-3">Design</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Blender →
                </a>
                <p className="text-sm text-gray-500">2,913,078 learners</p>
              </li>
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Graphic Design →
                </a>
                <p className="text-sm text-gray-500">4,495,153 learners</p>
              </li>
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  UX Design →
                </a>
                <p className="text-sm text-gray-500">2,071,077 learners</p>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-lg font-bold mb-3">Business</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Project Management (PMP) →
                </a>
                <p className="text-sm text-gray-500">2,570,660 learners</p>
              </li>
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Microsoft Power BI →
                </a>
                <p className="text-sm text-gray-500">4,638,884 learners</p>
              </li>
              <li>
                <a
                  href="#"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Project Management →
                </a>
                <p className="text-sm text-gray-500">3,984,755 learners</p>
              </li>
            </ul>
          </div>
        </div>
      </section>


    
      
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessment Section */}
          <div className="flex items-center bg-green-100 p-6 rounded-lg">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                Get to know yourself better!
              </h2>
              <p className="text-gray-700">
                Discover your career strengths & weaknesses
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded">
                Take The Free Personality Assessment
              </button>
            </div>
            <div className="hidden md:block ml-6">
              <Image
                src="/know-yourself.svg"
                alt="Puzzle Illustration"
                width={140}
                height={140}
              />
            </div>
          </div>

          {/* Resume Section */}
          <div className="flex items-center bg-green-200 p-6 rounded-lg">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                Get hired for your dream job!
              </h2>
              <p className="text-gray-700">
                Build your free resumé in minutes!
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded">
                Create My Professional Resumé
              </button>
            </div>
            <div className="hidden md:block ml-6">
              <Image
                src="/get-hired-alt.svg"
                alt="Resume Illustration"
                width={140}
                height={140}
              />
            </div>
          </div>
        </div>
      </div>

      
      {/* Testimonials Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-10">
                <button
                  onClick={prevSlide}
                  className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl focus:outline-none transform hover:scale-110 transition-all"
                >
                  <span className="text-blue-600 text-sm font-medium">----</span>
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl focus:outline-none transform hover:scale-110 transition-all"
                >
                  <span className="text-blue-600 text-sm font-medium"> ---- </span>
                </button>
              </div>
              
              <div className="text-center">
                <Image
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  width={50}
                  height={50}
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg object-cover"
                />
                <p className="text-xl italic text-gray-700 mb-6">-{testimonials[current].quote}-</p>
                <p className="font-semibold text-gray-900">{testimonials[current].name}</p>
                <p className="text-blue-600">{testimonials[current].title}</p>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6">Join Our Global Community</h3>
              <p className="text-xl mb-8">Over 45 million learners have already taken the first step toward their future. Start your journey today.</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 self-start">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-blue-100 pt-8 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
          {/* Left Side */}
          <div className="w-full md:w-1/2 px-10 py-10 bg-green-50">
            <p className="text-lg italic text-gray-700 mb-6">
              “Education underpins all social progress. Our aim is to harness
              technology to make all education and skills training available to
              anyone, anywhere for free”
            </p>
            <div className="flex items-center mt-6">
              <Image
                src="/testimonials/alexandre-abitbol.jpg" // Vendos një foto reale në public/ceo.jpg ose përdor një avatar
                alt="Dior H"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div className="ml-4">
                <p className="font-semibold text-indigo-700">Dior H</p>
                <p className="text-sm text-gray-600">
                  Founder & CEO, EduSpark
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 px-10 py-10 bg-blue-50 relative">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              EduSpark
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Founded in{" "}
              <span className="text-blue-700 font-semibold">KOSOVA</span>
              <br />
              Developed Worldwide
            </p>
            <p className="mt-4 text-blue-800 font-medium cursor-pointer hover:underline">
              Learn about <strong>Our Story</strong>
            </p>

            {/* Decorative image */}
            <div className="absolute bottom-0 right-0 w-1/2 opacity-80 hidden md:block">
              <Image
                src="/icons/maps.png" // ruaje këtë figurë në /public
                alt="Map Illustration"
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-12">
            Trusted by over 16,000 companies and millions of learners
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {brandLogos.map((logo, i) => (
              <Image
                key={i}
                width={200}
                height={80}
                src={logo}
                alt="Brand Logo"
                className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </div>

    </div>
    
  );
};

export default Hero;
