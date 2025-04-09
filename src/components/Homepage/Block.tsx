import React from "react";

interface BlockProps {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Block: React.FC<BlockProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 text-center w-72 flex flex-col items-center">
      <Icon className="w-14 h-14 text-gray-800 mb-4" />
      <h3 className="text-xl font-semibold text-purple-700 mb-1">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Block;
