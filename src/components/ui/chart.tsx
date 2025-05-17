import React from "react";

export function Chart({ className = "", ...props }) {
  return (
    <div
      className={"rounded-2xl  shadow-sm bg-white text-black" + className}
      {...props}
    />
  );
}

export function ChartContent({ className = "", ...props }) {
  return <div className={"p-4 text-black" + className} {...props} />;
}
