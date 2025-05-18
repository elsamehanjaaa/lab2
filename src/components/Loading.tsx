import { Loader2 } from "lucide-react";
import React from "react";
interface LoadingProps {
  show: boolean;
}
const Loading: React.FC<LoadingProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50  bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
    </div>
  );
};

export default Loading;
