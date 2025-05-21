import React from "react";

interface TopSectionProps {
  title: string;
  text1: string;
  text2: string;
}

const TopSection: React.FC<TopSectionProps> = ({ title, text1, text2 }) => {
  return (
    <div
      className="relative w-full min-h-[400px] flex items-end p-12 text-white absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center"
    >
      <div className="absolute bottom-25 left-20">
        <h1 className="text-5xl font-bold">{title}</h1>
        <nav className="mt-4 space-x-6 text-lg">
          <p className="text-white inline">{text1}</p>
          <span className="text-white">|</span>
          <p className="text-white inline">{text2}</p>
        </nav>
      </div>
    </div>
  );
};

export default TopSection;
