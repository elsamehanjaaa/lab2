// components/Section.tsx
import React from "react";
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
  return (
    <div className="mt-6 p-4 bg-gray-300 rounded-lg">
      <div className="flex justify-between">
        <input
          type="text"
          value={section.title}
          onChange={(e) => onSectionChange(section.id, e.target.value)}
          placeholder="Section Title"
          className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <button
          type="button"
          onClick={() => onRemoveSection(section.id)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Remove Section
        </button>
      </div>

      {section.lessons.map((lesson) => (
        <Lesson
          key={lesson.id}
          lesson={lesson}
          sectionId={section.id}
          onChange={onLessonChange}
          onRemove={onRemoveLesson}
        />
      ))}
      <button
        type="button"
        onClick={() => onAddLesson(section.id)}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition mb-4"
      >
        Add Lesson
      </button>
    </div>
  );
};

export default Section;
