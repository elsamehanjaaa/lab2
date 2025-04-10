import React from "react";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTelegram,
} from "react-icons/fa6";
import { SiQuora } from "react-icons/si";
import Image from "next/image";

const columns = [
  {
    title: "EduSpark",
    links: [
      "Technology & IT",
      "Health & Wellness",
      "Languages",
      "Business & Finance",
      "Leadership & Management",
      "Creative Arts",
      "Marketing & Sales",
      "Engineering & Design",
      "Education & Training",
      "Personal Growth",
    ],
  },
  {
    title: "ABOUT US",
    links: [
      "Who We Are",
      "Our Vision",
      "Meet the Team",
      "Partners",
      "Work With Us",
      "Press & Media",
      "Our Blog",
      "Our Impact",
    ],
  },
  {
    title: "LEARNING EXPERIENCE",
    links: [
      "Certificates & Badges",
      "Accreditation",
      "Learning Paths",
      "Progress Tracking",
      "Student Reviews",
      "Instructor Dashboard",
      "Premium Access",
      "Mobile Learning",
    ],
  },
  {
    title: "TOOLS & RESOURCES",
    links: [
      "Mobile App",
      "Learning Portal",
      "Career Center",
      "CV Builder",
      "Skill Assessment",
      "Knowledge Tests",
      "Resource Library",
      "Community Forum",
    ],
  },
  {
    title: "PARTNER WITH US",
    links: [
      "Become an Instructor",
      "Affiliate Program",
      "Corporate Training",
      "Sponsorship Opportunities",
    ],
  },
  {
    title: "NEWS & EVENTS",
    links: ["Webinars", "Workshops", "Announcements", "Success Stories"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1E39] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {columns.map((col, idx) => (
          <div key={idx}>
            <h3 className="font-bold mb-4 text-sm">{col.title}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {col.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-[#0A1E39] text-white border-t border-gray-600 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Left Section */}
          <div className="flex flex-col items-start gap-4 w-full lg:w-1/2">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/b77d377e-bf9c-42b0-8724-56a9f6d6ff73.png"
                alt="Alison"
                width={96}
                height={40}
                className="w-24 h-auto"
              />
            </div>
            <div className="flex gap-4 text-sm">
              <a href="#" className="flex items-center gap-1 hover:underline">
                <span>❓</span> FAQs
              </a>
              <a href="#" className="flex items-center gap-1 hover:underline">
                <span>❓</span> Customer Support
              </a>
            </div>
            <div className="flex gap-3 text-2xl mt-2">
              <FaFacebook />
              <FaXTwitter />
              <FaLinkedin />
              <FaInstagram />
              <FaTiktok />
              <FaYoutube />
              <SiQuora />
              <FaTelegram />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-start lg:items-end w-full lg:w-1/2 gap-4">
            <div className="flex gap-4">
              <Image
                src="/icons/available-on-the-app-store-logo-png-transparent.png"
                alt="App Store"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
              <Image
                src="/icons/1664287128google-play-store-logo-png.webp"
                alt="Google Play"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="text-xs text-gray-400 flex gap-4 flex-wrap mt-2">
              <span>© EduSpark 2025</span>
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <a href="#" className="hover:underline">
                Cookie Policy
              </a>
              <a href="#" className="hover:underline">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
