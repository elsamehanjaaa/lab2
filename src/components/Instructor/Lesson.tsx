// components/Lesson.tsx
import React from "react";

interface LessonProps {
  lesson: {
    id: number;
    title: string;
    content?: string;
    type: string;
    video?: File | null;
    video_url: string;
    url: string;
  };
  sectionId: number;
  onChange: (
    sectionId: number,
    lessonId: number,
    field: string,
    value: any
  ) => void;
  onRemove: (sectionId: number, lessonId: number) => void;
}

const Lesson: React.FC<LessonProps> = ({
  lesson,
  sectionId,
  onChange,
  onRemove,
}) => {
  return (
    <div className="flex flex-col mb-4 border-b pb-4">
      <h1>Lesson {lesson.id}:</h1>
      <input
        type="text"
        value={lesson.title}
        onChange={(e) =>
          onChange(sectionId, lesson.id, "title", e.target.value)
        }
        placeholder="Lesson Title"
        className="w-full border bg-gray-700 border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 mb-2"
      />

      <div className="flex items-center mb-4">
        <span className="mr-2">Text</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={lesson.type === "video"}
            onChange={() =>
              onChange(
                sectionId,
                lesson.id,
                "type",
                lesson.type === "text" ? "video" : "text"
              )
            }
            className="toggle-checkbox bg-gray-700"
          />
          <span className="slider"></span>
        </label>
        <span className="ml-2">Video</span>
      </div>

      {lesson.type === "text" ? (
        <textarea
          value={lesson.content}
          onChange={(e) =>
            onChange(sectionId, lesson.id, "content", e.target.value)
          }
          placeholder="Lesson Content"
          rows={4}
          className="w-full border bg-gray-700 border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 mb-2"
        />
      ) : (
        <div className="flex">
          <input
            key={`empty`}
            type="file"
            accept="video/*"
            onChange={(e) =>
              onChange(
                sectionId,
                lesson.id,
                "video",
                e.target.files ? e.target.files[0] : undefined
              )
            }
            className="w-32
                        text-transparent text-sm mb-2  file:mr-4 file:py-2 file:px-4
              file:rounded-lg  file:font-semibold file:cursor-pointer
              file:bg-gray-70 file:text-gray-900 file:border-gray-900 file:border hover:file:bg-gray-900 hover:file:text-gray-700"
          />
          {lesson.video ? (
            <p className="text-m mt-1">Selected: {lesson.video.name}</p>
          ) : lesson.video_url ? (
            <p className="text-m mt-1">
              File: {lesson.video_url.split("/").pop()}
            </p>
          ) : null}
        </div>
      )}
      <input
        type="text"
        value={lesson.url}
        onChange={(e) => onChange(sectionId, lesson.id, "url", e.target.value)}
        placeholder="Url For Students"
        className="w-full border bg-gray-700 border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 mb-2"
      />
      <button
        type="button"
        onClick={() => onRemove(sectionId, lesson.id)}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
      >
        Remove Lesson
      </button>
    </div>
  );
};

export default Lesson;
