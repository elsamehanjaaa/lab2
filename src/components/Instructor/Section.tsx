import React, { useState } from "react";
import Lesson from "./Lesson";

interface SectionProps {
  section: {
    id: number;
    title: string;
    lessons: any[];
  };
  onAddLesson: (sectionId: number) => void;
  onRemoveSection: (sectionId: number) => void;
  onLessonChange: (
    sectionId: number,
    lessonId: number,
    field: string,
    value: any
  ) => void;
  onSectionChange: (sectionId: number, value: any) => void;
  onRemoveLesson: (sectionId: number, lessonId: number) => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  onAddLesson,
  onRemoveSection,
  onLessonChange,
  onSectionChange,
  onRemoveLesson,
}) => {
  const [showLessons, setShowLessons] = useState(false); // 👈 Toggle state

  return (
    <div className=" p-4 bg-gray-700 rounded-lg text-white">
      <div className="flex justify-between items-center">
        <label className=" text-xl pr-2">Title:</label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onSectionChange(section.id, e.target.value)}
          placeholder="Section Title"
          className="w-full border bg-gray-700 border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 mr-2"
        />
        <button
          type="button"
          onClick={() => setShowLessons(!showLessons)}
          className="bg-blue-900 hover:bg-blue-700 w-36 text-white text-sm p-2 rounded-lg transition mr-2"
        >
          {showLessons ? "Hide Lessons" : "View Lessons"}
        </button>
        <button
          type="button"
          onClick={() => onRemoveSection(section.id)}
          className="bg-red-600 hover:bg-red-700 text-white text-sm  p-2 rounded-lg transition"
        >
          Remove
        </button>
      </div>

      {showLessons && (
        <>
          <hr className="mt-4" />
          <button
            type="button"
            onClick={() => onAddLesson(section.id)}
            className="w-full md:w-auto my-4 bg-blue-900 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Add Lesson
          </button>
          {section.lessons.map((lesson) => (
            <Lesson
              key={`${section.id},${lesson.id}`}
              lesson={lesson}
              sectionId={section.id}
              onChange={onLessonChange}
              onRemove={onRemoveLesson}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Section;
