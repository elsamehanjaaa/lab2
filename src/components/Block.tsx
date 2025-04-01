// components/Blocks.tsx

import React from "react";

interface BlockProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const Block: React.FC<BlockProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 text-center w-80 flex ">
      {React.createElement(icon, { className: "w-32 h-32" })}
      <div className="">
        <h3 className="text-xl font-semibold text-purple-700 mb-2">{title}</h3>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Block;
