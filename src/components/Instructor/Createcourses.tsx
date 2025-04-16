import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StepButton from "./StepButton";
import { log } from "util";
import Thumbnail from "./Thumbnail";
import Categories from "./Categories";
import { fetchCategories } from "@/utils/fetchCategories";
import { uploadThumbnail } from "@/utils/uploadThumbnail";
import { createCourse } from "@/utils/createCategory";
const CreateCourseForm = () => {
  const [step, setStep] = useState(1); // Step 1 or 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const result = await fetchCategories();
        setCategories(result);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    getCategories();
  }, []);

  const handleAddSection = () => {
    const newSection = {
      id: sections.length + 1,
      title: "",
      lessons: [],
    };
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const handleAddLesson = (sectionId: number) => {
    const section = sections.find((section) => section.id == sectionId);

    const newLesson = {
      id: section.lessons.length + 1,
      title: "",
      content: "",
      type: "text",
      video: null,
    };

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      )
    );
  };

  const handleLessonChange = (
    sectionId: number,
    lessonId: number,
    field: string,
    value?: any
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map((lesson: { id: number }) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : section
      )
    );
  };

  const handleSectionChange = (sectionId: number, value?: any) => {
    setSections((prevSections) =>
      prevSections.map((section: { id: number }) =>
        section.id === sectionId
          ? {
              ...section,
              title: value,
            }
          : section
      )
    );
  };

  const handleRemoveLesson = (sectionId: number, lessonId: number) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter(
                (lesson: { id: number }) => lesson.id !== lessonId
              ),
            }
          : section
      )
    );
  };

  const handleRemoveSection = (sectionId: number) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== sectionId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || selectedCategories.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    const courseData = {
      title,
      description,
      price: parseFloat(price),
      rating: 0,
      categories: selectedCategories,
      thumbnail_url: "",
      sections: sections,
    };

    try {
      function getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      }

      const token = getCookie("access_token");
      if (!token) throw new Error("No access token found");

      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);
        formData.append("course", title);
        const thumbnailResult = await uploadThumbnail({ token, formData });
        courseData.thumbnail_url = thumbnailResult.url;
      }

      const data = await createCourse(courseData, token);
      console.log("Course created successfully:", data);

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedCategories([]);
      setThumbnail(null);
      setSections([]);
      setStep(1);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl min-h-[800px] flex flex-col justify-between">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📚 Create a New Course
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-between"
      >
        <div className="space-y-6">
          {step === 1 && (
            <>
              {/* Course Info */}
              <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Course Info
              </h1>
              {/* Thumbnail */}
              <Thumbnail onThumbnailChange={setThumbnail} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <Categories
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                dropdownRef={dropdownRef}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Course Sections
              </h1>
              {sections.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  onAddLesson={handleAddLesson}
                  onRemoveSection={handleRemoveSection}
                  onLessonChange={handleLessonChange}
                  onSectionChange={handleSectionChange}
                  onRemoveLesson={handleRemoveLesson}
                />
              ))}

              <button
                type="button"
                onClick={handleAddSection}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Add Section
              </button>
            </>
          )}
        </div>

        {/* Footer Button */}
        <StepButton
          step={step}
          setStep={setStep}
          totalSteps={3}
          submit={(e) => handleSubmit(e)}
        />
      </form>
    </div>
  );
};

export default CreateCourseForm;
