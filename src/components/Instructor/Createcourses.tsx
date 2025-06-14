import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import StepButton from "./StepButton";
import Thumbnail from "./Thumbnail";
import Categories from "./Categories";
import * as categoriesUtils from "@/utils/categories";
import * as courseUtils from "@/utils/course";
import { parse } from "cookie";
// Import ArrowUp and ArrowDown from lucide-react
import { ChevronRight, ArrowUp, ArrowDown } from "lucide-react";

const CreateCourseForm = ({
  cookies,
  onCourseCreated,
}: {
  cookies: string;
  onCourseCreated: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [learnings, setLearnings] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [description, setDescription] = useState("");

  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      if (folderInputRef.current) {
        folderInputRef.current.value = "";
      }
      return;
    }

    setLoading(true);

    const rootDirName = files[0].webkitRelativePath.split("/")[0];
    const preliminarySectionsMap = new Map<
      string,
      { title: string; lessons: any[] }
    >();

    for (const file of Array.from(files)) {
      const relativePath = file.webkitRelativePath;
      const pathWithoutRoot = relativePath.substring(rootDirName.length + 1);
      const parts = pathWithoutRoot.split("/");

      if (parts.length < 2) {
        console.warn(
          `File "${file.name}" is directly under the root. It must be in a section subfolder. Skipping.`
        );
        continue;
      }

      const sectionTitle = parts[0];
      const lessonFileName = parts[parts.length - 1];
      const lessonTitleWithoutExt =
        lessonFileName.substring(0, lessonFileName.lastIndexOf(".")) ||
        lessonFileName;

      if (!preliminarySectionsMap.has(sectionTitle)) {
        preliminarySectionsMap.set(sectionTitle, {
          title: sectionTitle,
          lessons: [],
        });
      }
      const currentSectionData = preliminarySectionsMap.get(sectionTitle)!;

      let lessonType = "text";
      let lessonContent: string | null = "";
      let videoFile: Blob | null = null;

      if (/\.(mp4|mov|avi|webm|mkv)$/i.test(lessonFileName)) {
        lessonType = "video";
        videoFile = file;
        lessonContent = null;
      } else if (/\.(txt|md|html|rtf)$/i.test(lessonFileName)) {
        lessonType = "text";
        try {
          lessonContent = await file.text();
        } catch (e) {
          console.error(`Error reading text file "${lessonFileName}":`, e);
          lessonContent = `Error reading content for ${lessonFileName}.`;
        }
      } else {
        console.warn(
          `Unsupported file type for lesson: ${lessonFileName}. Skipping.`
        );
        continue;
      }

      currentSectionData.lessons.push({
        id: currentSectionData.lessons.length + 1,
        title: lessonTitleWithoutExt,
        content: lessonContent,
        type: lessonType,
        video: videoFile,
      });
    }

    let sectionsDataArray = Array.from(preliminarySectionsMap.values());

    sectionsDataArray.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;
      return 0;
    });

    let finalSections = sectionsDataArray.map((data, index) => ({
      id: index + 1,
      title: data.title,
      lessons: data.lessons,
    }));

    finalSections.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return 1;
      if (titleA > titleB) return -1;
      return 0;
    });

    setSections(finalSections);
    setLoading(false);
    if (finalSections.length > 0) {
      setStep(2);
    }

    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }
  };

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
    const newId =
      sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
    const newSection = { id: newId, title: "", lessons: [] };
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const handleAddLesson = (sectionId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const newLesson = {
      id:
        section.lessons.length > 0
          ? Math.max(...section.lessons.map((l: any) => l.id)) + 1
          : 1,
      title: "",
      content: "",
      type: "text",
      video: null,
    };
    setSections((prevSections) =>
      prevSections.map((s) =>
        s.id === sectionId ? { ...s, lessons: [...s.lessons, newLesson] } : s
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
        section.id === sectionId ? { ...section, title: value } : section
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

  const handleMoveSection = (sectionId: number, direction: "up" | "down") => {
    setSections((prevSections) => {
      const sectionIndex = prevSections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return prevSections;

      const newSections = [...prevSections];
      const sectionToMove = newSections[sectionIndex];

      if (direction === "up" && sectionIndex > 0) {
        newSections.splice(sectionIndex, 1);
        newSections.splice(sectionIndex - 1, 0, sectionToMove);
      } else if (
        direction === "down" &&
        sectionIndex < newSections.length - 1
      ) {
        newSections.splice(sectionIndex, 1);
        newSections.splice(sectionIndex + 1, 0, sectionToMove);
      }
      return newSections;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title ||
      !shortDescription ||
      !price ||
      !selectedCategories.length ||
      !sections.length ||
      !description ||
      !learnings.some((l) => l.trim() !== "") ||
      !requirements.some((r) => r.trim() !== "")
    ) {
      alert(
        "Please Fill all required data, including at least one learning objective and requirement."
      );
      return;
    }
    setLoading(true);
    const courseData = {
      title,
      shortDescription,
      price: parseFloat(price),
      categories: selectedCategories,
      sections,
      description,
      learnings,
      requirements,
    };

    const formData = new FormData();
    const cleanedCourseData = {
      ...courseData,
      sections: courseData.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map(
          (lesson: { [x: string]: any; video: any }) => {
            const { video, ...rest } = lesson;
            return rest;
          }
        ),
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
      const data = await courseUtils.create(formData, cookies);
      setLoading(false);
      onCourseCreated();
    } catch (error) {
      setLoading(false);
      console.error("Error creating course:", error);
      alert(
        `Error creating course: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
  const handleLearningChange = (index: number, value: string) => {
    const updated = [...learnings];
    updated[index] = value;
    setLearnings(updated);
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const addLearning = () => setLearnings([...learnings, ""]);
  const addRequirement = () => setRequirements([...requirements, ""]);

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-3xl min-h-[800px] flex flex-col justify-between border border-blue-100">
      <div>
        <div className="flex items-center mb-8 pb-4 border-b border-blue-200">
          <div className="bg-blue-900 text-white p-3 rounded-2xl mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            Create Your Course
            <span className="ml-3 text-blue-900">
              <ChevronRight size={24} />
            </span>
            <span className="text-lg ml-2 font-medium text-blue-900">
              Step {step} of 3
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-grow flex flex-col justify-between"
        >
          <div className="space-y-10">
            {step === 1 && (
              // ... Step 1 JSX ...
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <div className="text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    1
                  </div>
                  Course Information
                </h2>
                <Thumbnail onThumbnailChange={setThumbnail} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course Title
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Short Course Description
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={4}
                    required
                    placeholder="Provide a compelling short description of your course..."
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
                  <div className="text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    2
                  </div>
                  Course Content
                </h2>
                <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <label
                    htmlFor="folder-upload-input"
                    className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-blue-700 rounded-lg shadow-md tracking-wide uppercase border border-blue-700 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors group"
                  >
                    <svg
                      className="w-8 h-8 mb-2"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="text-base leading-normal">
                      Upload Course Folder
                    </span>
                    <p className="text-xs text-gray-500 group-hover:text-white mt-1">
                      Subfolders become sections, files become lessons.
                    </p>
                  </label>
                  <input
                    id="folder-upload-input"
                    type="file"
                    // @ts-ignore Use ts-ignore for webkitdirectory as it's non-standard
                    webkitdirectory=""
                    directory=""
                    onChange={handleFolderUpload}
                    className="hidden"
                    ref={folderInputRef}
                    multiple
                  />
                </div>

                {sections.length === 0 && !loading && (
                  <div className="text-center py-12 bg-blue-50 rounded-xl border border-dashed border-blue-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p className="text-gray-600 mt-4">
                      Upload a course folder above, or start building your
                      course by adding sections manually.
                    </p>
                  </div>
                )}

                {/* MODIFIED SECTION RENDERING WITH MOVE CONTROLS */}
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="relative group bg-white mb-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-lg"
                  >
                    <div className="absolute -right-10 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(section.id, "up")}
                        disabled={index === 0}
                        className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-blue-600 rounded-full shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Move Section Up"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(section.id, "down")}
                        disabled={index === sections.length - 1}
                        className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-blue-600 rounded-full shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Move Section Down"
                      >
                        <ArrowDown size={18} />
                      </button>
                    </div>
                    {/* The Section component itself is now nested, without section move props */}
                    <Section
                      section={section}
                      onAddLesson={handleAddLesson}
                      onRemoveSection={handleRemoveSection} // This is for the "Remove Section" button inside the Section component
                      onLessonChange={handleLessonChange}
                      onSectionChange={handleSectionChange}
                      onRemoveLesson={handleRemoveLesson}
                      // If you add lesson reordering, its handler would be passed here
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mt-6 w-full bg-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Section Manually
                </button>
              </div>
            )}

            {step === 3 && (
              // ... Step 3 JSX ...
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <div className="text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    3
                  </div>
                  Course Details
                </h2>
                <div className="mt-8 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    What you will learn
                  </label>
                  {learnings.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleLearningChange(index, e.target.value)
                      }
                      placeholder={`e.g., Learn concept ${index + 1}`}
                      required={index === 0}
                      className="w-full mb-2 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addLearning}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add more
                  </button>
                </div>
                <div className="mt-8 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Course Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    placeholder="Provide a compelling and detailed description of your course..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="mt-8 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  {requirements.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder={`e.g., Have basic knowledge of HTML (${
                        index + 1
                      })`}
                      required={index === 0}
                      className="w-full mb-2 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add more
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-10">
            <StepButton
              step={step}
              setStep={setStep}
              totalSteps={3}
              submit={handleSubmit}
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;
