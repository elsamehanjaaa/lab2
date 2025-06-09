import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, User, Clock, Star } from "lucide-react";
import Link from "next/link";
import * as categoriesUtils from "@/utils/categories";
import * as courseUtils from "@/utils/course";
// Data

const categories = await categoriesUtils.getAll();
interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  slug: string;
  thumbnail_url: string;
  _id: string;
}
const courses = await courseUtils.getAll().then((res) => res.courses);

const brandLogos = [
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=200&h=80&q=80",
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=200&h=80&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=200&h=80&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=200&h=80&q=80",
];

const testimonials = [
  {
    name: "Sara M.",
    title: " Marketing Professional",
    image: "/testimonials/Sara.jpg",
    quote:
      "EduSpark has completely changed the way I learn. The courses are well-structured, engaging, and taught by real experts. I finally feel confident advancing my career!",
  },
  {
    name: "David K.",
    title: "University Student",
    image: "/testimonials/David.jpg",
    quote:
      "What I love most about EduSpark is the flexibility. I could learn at my own pace without sacrificing quality. The interactive modules kept me motivated throughout.",
  },
  {
    name: "Lina T.",
    title: "Aspiring Data Analyst",
    image: "/testimonials/Lina.jpg",
    quote:
      "The instructors are incredibly knowledgeable and supportive. I took the Data Science track, and I was able to land an internship within two months of completing it!",
  },
  {
    name: "James P.",
    title: "Software Engineer",
    image: "/testimonials/James.jpg",
    quote:
      "I’ve tried several platforms, but EduSpark stands out. The community, the support, and the course content are simply top-notch. Highly recommended!",
  },
  {
    name: "Kevin S.",
    title: "Career Switcherr",
    image: "/testimonials/Kevin.jpg",
    quote:
      "From beginner to confident coder in just a few weeks! The hands-on projects and real-world examples made learning easy and practical.",
  },
  {
    name: "Fatima R.",
    title: "Lifelong Learner",
    image: "/testimonials/Fatima.jpg",
    quote:
      "As a busy mom and full-time worker, EduSpark was a game-changer. I could squeeze in learning between everything else, and I genuinely enjoyed every minute of it.",
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
  const [showStory, setShowStory] = useState(false);

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
        <div className="absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center" />
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Adjusted heading sizes for smaller breakpoints */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-950 hover:text-blue-200 transition duration-300">
              Online Learning Course
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-8">
              Build skills with courses, certificates, and degrees online from
              world-class universities and companies.
            </p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
            <Block
              icon={BookOpen}
              title="1000+ Courses"
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
            <Block
              icon={Star}
              title="Top Rated"
              description="Highly rated by thousands of students worldwide"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories
              .slice(0, 10)
              .map((cat: { name: string; slug: string }, i: number) => (
                <Link
                  key={i}
                  href={`/courses/${cat.slug}`}
                  className="bg-white hover:bg-indigo-50 text-gray-800 px-6 py-3 rounded-full shadow-sm hover:shadow-md font-medium transition-all duration-300 group"
                >
                  {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Featured Courses
          </h2>
          {/* Responsive grid for courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses
              .slice(0, 4)
              .sort((a, b) => a.rating - b.rating)
              .map((course: Course, i) => (
                <Link
                  key={i}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  href={`course/${course.slug}/${course._id}`}
                >
                  <div className="relative">
                    <Image
                      width={800}
                      height={800}
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <h3 className=" mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.description}
                    </h3>
                    <div className="flex items-center text-sm mb-3">
                      <span className="font-semibold mr-2">{course.price}</span>
                    </div>
                  </div>
                </Link>
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

      {/* Trending Now Section */}
      <section className="bg-gray-50 py-10 px-4 sm:px-6 md:px-10 lg:px-40">
        <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
        {/* Adjusted to 1 column on mobile, 2 on small screens, 4 on large */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ChatGPT section */}
          <div>
            <h3 className="text-xl font-bold mb-2">ChatGPT is a top skill</h3>
            <Link
              href="/courses"
              className="text-purple-600 font-medium hover:underline"
            >
              See ChatGPT courses →
            </Link>
            <p className="text-gray-500 mt-1">4,345,758 learners</p>

            <button className="mt-6 px-4 py-2 border border-purple-600 text-purple-700 rounded-md hover:bg-purple-50 transition">
              <Link href="/courses">Show all trending skills →</Link>
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
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Web Development →
                </Link>
                <p className="text-sm text-gray-500">14,015,184 learners</p>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Data Science →
                </Link>
                <p className="text-sm text-gray-500">7,793,156 learners</p>
              </li>
            </ul>
          </div>

          {/* Design */}
          <div>
            <h4 className="text-lg font-bold mb-3">Design</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Blender →
                </Link>
                <p className="text-sm text-gray-500">2,913,078 learners</p>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Graphic Design →
                </Link>
                <p className="text-sm text-gray-500">4,495,153 learners</p>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  UX Design →
                </Link>
                <p className="text-sm text-gray-500">2,071,077 learners</p>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-lg font-bold mb-3">Business</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Project Management (PMP) →
                </Link>
                <p className="text-sm text-gray-500">2,570,660 learners</p>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Microsoft Power BI →
                </Link>
                <p className="text-sm text-gray-500">4,638,884 learners</p>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Project Management →
                </Link>
                <p className="text-sm text-gray-500">3,984,755 learners</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Assessment and Resume Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessment Section */}
          {/* Converted to flex-col for mobile */}
          <div className="flex flex-col md:flex-row items-center bg-green-100 p-6 rounded-lg">
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
            <div className="hidden md:block md:ml-6 mt-6 md:mt-0">
              <Image
                src="/know-yourself.svg"
                alt="Puzzle Illustration"
                width={140}
                height={140}
              />
            </div>
          </div>

          {/* Resume Section */}
          <div className="flex flex-col md:flex-row items-center bg-green-200 p-6 rounded-lg">
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
            <div className="hidden md:block md:ml-6 mt-6 md:mt-0">
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
          {/* Two-column layout for medium screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-10">
                <span
                  onClick={prevSlide}
                  className="text-blue-600 text-sm font-small cursor-pointer"
                >
                  ＜
                </span>
                <span
                  onClick={nextSlide}
                  className="text-blue-600 text-sm font-medium cursor-pointer"
                >
                  ＞
                </span>
              </div>
              <div className="text-center">
                <Image
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  width={50}
                  height={50}
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg object-cover"
                />
                <p className="text-lg italic text-gray-700 mb-6">
                  -{testimonials[current].quote}-
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonials[current].name}
                </p>
                <p className="text-blue-600">{testimonials[current].title}</p>
              </div>
            </div>

            <div className="bg-[#192847] text-white rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6">
                Join Our Global Community
              </h3>
              <p className="text-xl mb-8">
                Over 45 million learners have already taken the first step
                toward their future. Start your journey today.
              </p>
              <button className="bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 self-start">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CEO / Our Story Section */}
      <section className="bg-blue-100 pt-8 pb-16 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
          {/* Left Side */}
          <div className="w-full md:w-1/2 px-10 py-10 bg-green-50">
            <div className="flex items-start space-x-6">
              {/* Image & CEO Info */}
              <div className="flex-shrink-0">
                <Image
                  src="/testimonials/ElenaBrooks.jpg"
                  alt="Elena Brooks"
                  width={170}
                  height={80}
                />
              </div>

              {/* Quote Text */}
              <div className="text-medium italic text-gray-700">
                <p>
                  " We envision a future of education that is open, inclusive,
                  and accessible to everyone, everywhere. At EduSpark, we are
                  empowering people to learn, grow, and shape their own future —
                  without barriers and beyond borders."
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-indigo-700">Elena Brooks</p>
                  <p className="text-sm text-grey-700 font-bold">
                    Founder & CEO, EduSpark
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 px-10 py-10 bg-blue-50 relative flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              EduSpark
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Founded in{" "}
              <span className="text-blue-700 font-semibold">KOSOVA</span>
              <br />
              Developed Worldwide
            </p>
            <button
              onClick={() => setShowStory(true)}
              className="mt-2 text-blue-800 font-medium hover:underline text-left"
            >
              Learn about <strong>Our Story</strong>
            </button>
            {showStory && (
              <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition duration-300">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative overflow-y-auto max-h-[80vh] text-left">
                  {/* Close button */}
                  <button
                    onClick={() => setShowStory(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>

                  {/* Modal Content */}
                  <h2 className="text-3xl font-bold mb-6 text-center">
                    Our Story
                  </h2>
                  <div className="text-lg leading-8 text-gray-700 space-y-6 px-2 md:px-6 text-justify">
                    <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-blue-950 ">
                      Founded in 2021 by visionary entrepreneur{" "}
                      <strong>Elena Brooks</strong> in the heart of{" "}
                      <strong>Kosovo</strong>,<strong> EduSpark</strong> was
                      created with a powerful mission: to revolutionize
                      education by making high-quality online learning
                      accessible, engaging, and transformative for learners
                      across the globe.
                    </p>

                    <p>
                      Recognizing the urgent need for flexible, modern
                      educational solutions in an increasingly digital world,
                      Elena set out to build a platform that would not only
                      deliver knowledge but also inspire personal and
                      professional growth. She brought together a team of
                      passionate educators, technologists, and innovators who
                      shared a common belief — that learning should be a
                      dynamic, personalized journey, not a one-size-fits-all
                      experience.
                    </p>

                    <p>
                      From the beginning, EduSpark distinguished itself through
                      its commitment to innovation and learner-centric design.
                      Our platform offers a diverse range of courses across
                      technology, business, languages, and creative fields, each
                      carefully curated to meet the evolving demands of the
                      global workforce. But EduSpark is more than just a course
                      provider; it is a thriving learning community. Through
                      interactive modules, personalized learning paths, live
                      mentorship, and peer collaboration, we ensure that every
                      learner feels supported, challenged, and inspired.
                    </p>

                    <p>
                      Our impact has been remarkable. In just a few short years,
                      EduSpark has grown from a promising local startup into a
                      trusted global platform, serving thousands of students
                      across continents. Our learners are diverse —
                      professionals seeking new skills, students preparing for
                      future careers, entrepreneurs building their dreams — and
                      their successes continue to fuel our commitment to
                      excellence.
                    </p>

                    <p>
                      At EduSpark, we believe that education is the foundation
                      for innovation, empowerment, and positive change. That is
                      why we continually invest in advanced technologies,
                      data-driven personalization, and community-building
                      initiatives to enhance the learning experience.
                    </p>

                    <p>
                      As we look to the future, our vision remains steadfast:{" "}
                      <em className="text-blue-950 font-semibold">
                        to ignite curiosity, cultivate lifelong learning, and
                        empower individuals everywhere to unlock their full
                        potential through the power of education.
                      </em>
                    </p>

                    <p>
                      EduSpark is proud to be a story that started in Kosovo —
                      and even prouder to be shaping the future of learning
                      worldwide.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative Map Image */}
            <div className="absolute bottom-4 right-4 opacity-90 hidden md:block">
              <Image
                src="/icons/maps.png"
                alt="Map Illustration"
                width={120}
                height={120}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-12">
            Trusted by over 16,000 companies and millions of learners
          </h2>
          {/* Updated to a grid for better responsiveness */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 place-items-center">
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
