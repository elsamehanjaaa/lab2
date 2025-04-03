import Block from "@/components/Homepage/Block";
import Hero from "@/components/Homepage/Hero";
import React from "react";
import { LibraryBig, User, AlarmClock } from "lucide-react";
const index = () => {
  return (
    <main>
      <Hero />

      <div className="flex justify-center space-x-8 py-12">
        <Block
          icon={LibraryBig}
          title="60+ UX Courses"
          description="The automated process all your website tasks."
        />
        <Block
          icon={User}
          title="Expert Instructors"
          description="The automated process all your website tasks."
        />
        <Block
          icon={AlarmClock}
          title="Life time access"
          description="The automated process all your website tasks."
        />
      </div>
    </main>
  );
};

export default index;
