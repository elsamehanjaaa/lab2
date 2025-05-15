import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import StepButton from "./StepButton";
import Thumbnail from "./Thumbnail";
import Categories from "./Categories";
import * as categoriesUtils from "@/utils/categories";
import * as courseUtils from "@/utils/course";
import { parse } from "cookie";
import { ChevronRight } from "lucide-react";

const CreateCourseForm = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const result = await categoriesUtils.getAll();
        setCategories(result);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    getCategories();
  }, []);

  const handleAddSection = () => {
    const newSection = { id: sections.length + 1, title: "", lessons: [] };
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

  const handleLessonChange = (sectionId: number, lessonId: number, field: string, value?: any) => {
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
        section.id === sectionId ? { ...section, title: value } : section
      )
    );
  };

  const handleRemoveLesson = (sectionId: number, lessonId: number) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, lessons: section.lessons.filter((lesson: { id: number }) => lesson.id !== lessonId) }
          : section
      )
    );
  };

  const handleRemoveSection = (sectionId: number) => {
    setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !selectedCategories || !sections) {
      alert("Please Fill all data");
      return;
    }
    const courseData = {
      title,
      description,
      price: parseFloat(price),
      categories: selectedCategories,
      sections,
    };

    const formData = new FormData();
    const cleanedCourseData = {
      ...courseData,
      sections: courseData.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson: { [x: string]: any; video: any }) => {
          const { video, ...rest } = lesson;
          return rest;
        }),
      })),
    };

    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("courseData", JSON.stringify(cleanedCourseData));

    courseData.sections.forEach((section) => {
      section.lessons.forEach((lesson: { id: any; video: string | Blob }) => {
        if (lesson.video) {
          const fieldName = `videos[${section.id}][${lesson.id}]`;
          formData.append(fieldName, lesson.video);
        }
      });
    });

    try {
      const cookies = parse(document.cookie || "");
      const access_token = cookies["access_token"];
      if (!access_token) throw new Error("No access token found");
      const data = await courseUtils.create(formData, access_token);
      console.log(data);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-3xl min-h-[800px] flex flex-col justify-between border border-blue-100">
      <div>
        <div className="flex items-center mb-8 pb-4 border-b border-blue-200">
          <div className="bg-blue-900 text-white p-3 rounded-2xl mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            Create Your Course
            <span className="ml-3 text-blue-900">
              <ChevronRight size={24} />
            </span>
            <span className="text-lg ml-2 font-medium text-blue-900">Step {step} of 3</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
          <div className="space-y-10">
            {step === 1 && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <div className="text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">1</div>
                  Course Information
                </h2>
                
                <Thumbnail onThumbnailChange={setThumbnail} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g., Advanced JavaScript Masterclass"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="29.99"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Course Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    placeholder="Provide a compelling description of your course..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="mt-8">
                  <Categories
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    dropdownRef={dropdownRef}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <div className="text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">2</div>
                  Course Content
                </h2>
                
                {sections.length === 0 && (
                  <div className="text-center py-12 bg-blue-50 rounded-xl border border-dashed border-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-600 mt-4">Start building your course by adding sections</p>
                  </div>
                )}
                
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
                  className="mt-6 w-full bg-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Section
                </button>
              </div>
            )}
          </div>

          <div className="pt-10">
            <StepButton
              step={step}
              setStep={setStep}
              totalSteps={3}
              submit={(e) => handleSubmit(e)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;
