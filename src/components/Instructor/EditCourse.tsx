import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import StepButton from "./StepButton";
import Thumbnail from "./Thumbnail";
import Categories from "./Categories";
import * as categoriesUtils from "@/utils/categories";
import * as courseUtils from "@/utils/course";
import { parse } from "cookie";
interface EditCourseFormProps {
  id: string;
  cookies: string;
  onClose: () => void;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({
  id,
  cookies,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, courseData] = await Promise.all([
          categoriesUtils.getAll(),
          courseUtils.getById(id, cookies),
        ]);

        if (!courseData || !categoryData) {
          throw new Error("error fetching course");
        }
        setCategories(categoryData);
        setTitle(courseData.title);
        setDescription(courseData.description);
        setPrice(courseData.price.toString());
        setThumbnailUrl(courseData.thumbnail_url);
        setSelectedCategories(courseData.categories);
        const cleanedSections = courseData.sections.map((section: any) => ({
          ...section,
          id: section.index, // Use section.id if it exists, otherwise use index
          lessons: section.lessons?.map((lesson: any) => ({
            ...lesson,
            id: lesson.index, // Same logic for lessons
          })),
        }));
        setSections(cleanedSections);
      } catch (err) {
        console.error("Error loading course data:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        lessons: section.lessons.map((lesson: any) => {
          const { video, ...rest } = lesson;
          return rest;
        }),
      })),
    };

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("courseData", JSON.stringify(cleanedCourseData));

    courseData.sections.forEach((section) => {
      section.lessons.forEach((lesson: any) => {
        if (lesson.video) {
          const fieldName = `videos[${section.id}][${lesson.id}]`;
          formData.append(fieldName, lesson.video);
        }
      });
    });

    try {
      const parsedCookies = parse(cookies);
      const access_token = parsedCookies["access_token"];
      if (!access_token) throw new Error("No access token found");

      const data = await courseUtils.edit(id, formData, access_token);
      if (data) onClose();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleAddSection = () => {
    const newSection = {
      id: sections.length + 1,
      title: "",
      lessons: [],
      course_id: id,
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
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl min-h-[800px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">✏️ Editing Course</h1>

        <button onClick={onClose} className=" px-4 py-2 bg-red-200 rounded">
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-between"
      >
        {id && (
          <>
            <div className="space-y-6">
              {step === 1 && (
                <>
                  <Thumbnail
                    onThumbnailChange={setThumbnail}
                    initialUrl={thumbnailUrl}
                  />
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
                    Edit Sections
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
            <StepButton
              step={step}
              setStep={setStep}
              totalSteps={3}
              submit={(e) => handleSubmit(e)}
              finalStepTitle="Edit course"
            />
          </>
        )}
      </form>
    </div>
  );
};

export default EditCourseForm;
