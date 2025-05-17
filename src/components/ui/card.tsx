import React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={
        "rounded-2xl max-h-20  shadow-sm bg-blue-400 text-white" + className
      }
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={"p-4 text-white" + className} {...props} />;
}
