// app/about/page.tsx
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div
        className="flex flex-col lg:px-40 md:px-20 px-6 justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[600px] flex flex-col justify-center items-start mt-16 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-extrabold py-6 text-left leading-tight">
            About Us
          </h1>
          <h3 className="text-lg md:text-xl font-medium py-4 text-left">
            Build skills with courses, certificates, and degrees online from world-class universities and companies.
          </h3>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition duration-300 ease-in-out mt-4">
            See More
          </button>
        </div>
      </div>

      {/* Skills and Impact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Skills are the key to unlocking potential
        </h1>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
          Whether you want to learn a new skill, train your teams, or share what you know with the world, you’re in the right place. As a leader in online learning, we’re here to help you achieve your goals and transform your life.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-[350px]">
            <Image
              src="/about-us-panel.jpg" // make sure this image exists in /public
              alt="Learning and leading through change"
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-md"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Learning and leading through change
            </h2>
            <p className="text-gray-700 text-base">
              Dudu Moloko knows that the world is changing, and she won’t let that stand in the way of success for FirstRand employees. Instead, she helps them not just cope with change but thrive in it.
            </p>
          </div>
        </div>
      </div>

      {/* Global Impact Section */}
      <div className="bg-purple-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Creating impact around the world
          </h2>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            With our global catalog spanning the latest skills and topics, people and organizations everywhere are able to adapt to change and thrive.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
            <div>
              <p className="text-3xl font-extrabold">77M</p>
              <p className="mt-2 text-sm">Learners</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">80K</p>
              <p className="mt-2 text-sm">Instructors</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">250K</p>
              <p className="mt-2 text-sm">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">1B+</p>
              <p className="mt-2 text-sm">Course enrollments</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">75</p>
              <p className="mt-2 text-sm">Languages</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">17K</p>
              <p className="mt-2 text-sm">Enterprise customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-gray-800">
            We help organizations of all types and sizes prepare for what is next — wherever it leads. 
            Our curated business and tech courses empower companies, institutions, and nonprofits 
            to thrive by putting learning at the heart of their strategies.
          </p>
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition">
            Learn more
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-left">
          {/* Testimonial 1 */}
          <div>
            <p className="text-4xl text-purple-600 mb-2">“”</p>
            <p className="text-lg text-gray-900 mb-6">
              Courses fit us perfectly. Their team continuously delivers fresh, up-to-date content that’s easy to deploy and tailored to our needs.
            </p>
            <div>
              <p className="font-bold">Varun Patil</p>
              <p className="text-sm text-gray-600">Senior Manager of HR Development</p>
              <a href="#" className="text-purple-700 font-semibold mt-2 inline-block">
                Read the Synechron case study →
              </a>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div>
            <p className="text-4xl text-purple-600 mb-2">“”</p>
            <p className="text-lg text-gray-900 mb-6">
              Overall, it was a major success. I regularly received messages about how valuable the Courses platform was for our teams.
            </p>
            <div>
              <p className="font-bold">Alfred Helmerich</p>
              <p className="text-sm text-gray-600">Executive Training Manager</p>
              <a href="#" className="text-purple-700 font-semibold mt-2 inline-block">
                Read the NTT DATA case study →
              </a>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div>
            <p className="text-4xl text-purple-600 mb-2">“”</p>
            <p className="text-lg text-gray-900 mb-6">
              Courses adapted quickly to our business needs and delivered global impact. It’s the best solution we’ve found for upskilling our employees.
            </p>
            <div>
              <p className="font-bold">Luz Santillana Romero</p>
              <p className="text-sm text-gray-600">Development and Engagement Director</p>
              <a href="#" className="text-purple-700 font-semibold mt-2 inline-block">
                Read the Indra case study →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>

import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div
        className="flex flex-col lg:px-40 md:px-20 px-6 justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[600px] flex flex-col justify-center items-start mt-16 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-extrabold py-6 text-left leading-tight">
            About Us
          </h1>
          <h3 className="text-lg md:text-xl font-medium py-4 text-left">
            Build skills with courses, certificates, and degrees online from world-class universities and companies.
          </h3>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition duration-300 ease-in-out mt-4">
            See More
          </button>
        </div>
      </div>

      {/* Skills and Impact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Skills are the key to unlocking potential
        </h1>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
          Whether you want to learn a new skill, train your teams, or share what you know with the world, you’re in the right place. As a leader in online learning, we’re here to help you achieve your goals and transform your life.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-[350px]">
            <Image
              src="/about-us-panel.jpg"
              alt="Learning and leading through change"
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-md"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Learning and leading through change
            </h2>
            <p className="text-gray-700 text-base">
              Dudu Moloko knows that the world is changing, and she won’t let that stand in the way of success for FirstRand employees. Instead, she helps them not just cope with change but thrive in it.
            </p>
          </div>
        </div>
      </div>

      {/* Global Impact Section */}
      <div className="bg-purple-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Creating impact around the world
          </h2>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            With our global catalog spanning the latest skills and topics, people and organizations everywhere are able to adapt to change and thrive.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
            {/* Metrics */}
            {[
              ["77M", "Learners"],
              ["80K", "Instructors"],
              ["250K", "Courses"],
              ["1B+", "Course enrollments"],
              ["75", "Languages"],
              ["17K", "Enterprise customers"]
            ].map(([number, label]) => (
              <div key={label}>
                <p className="text-3xl font-extrabold">{number}</p>
                <p className="mt-2 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-gray-800">
            We help organizations of all types and sizes prepare for what is next — wherever it leads.
            Our curated business and tech courses empower companies, institutions, and nonprofits
            to thrive by putting learning at the heart of their strategies.
          </p>
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition">
            Learn more
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-left">
          {[
            {
              quote: "Courses fit us perfectly...",
              name: "Varun Patil",
              title: "Senior Manager of HR Development",
              link: "Read the Synechron case study →"
            },
            {
              quote: "Overall, it was a major success...",
              name: "Alfred Helmerich",
              title: "Executive Training Manager",
              link: "Read the NTT DATA case study →"
            },
            {
              quote: "Courses adapted quickly to our business needs...",
              name: "Luz Santillana Romero",
              title: "Development and Engagement Director",
              link: "Read the Indra case study →"
            }
          ].map((t, i) => (
            <div key={i}>
              <p className="text-4xl text-purple-600 mb-2">“”</p>
              <p className="text-lg text-gray-900 mb-6">{t.quote}</p>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-gray-600">{t.title}</p>
                <a href="#" className="text-purple-700 font-semibold mt-2 inline-block">
                  {t.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
