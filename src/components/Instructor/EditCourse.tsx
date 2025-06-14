import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import StepButton from "./StepButton";
import Thumbnail from "./Thumbnail";
import Categories from "./Categories";
import * as categoriesUtils from "@/utils/categories";
import * as courseUtils from "@/utils/course";
import { parse } from "cookie";
import Loading from "../Loading";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [initialCourseData, setInitialCourseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [learnings, setLearnings] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [fullDescription, setFullDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<any | null>(null);

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

        setCourse(courseData);
        setCategories(categoryData);
        setTitle(courseData.title);
        setDescription(courseData.description);
        setFullDescription(courseData.fullDescription);
        setLearnings(courseData.learn);
        setRequirements(courseData.requirements);
        setPrice(courseData.price.toString());
        setThumbnailUrl(courseData.thumbnail_url);
        const IdsCategories = courseData.categories.map((category: any) =>
          typeof category === "object" && category.id !== undefined
            ? Number(category.id)
            : category
        );
        setSelectedCategories(IdsCategories);
        const cleanedSections = courseData.sections.map((section: any) => ({
          ...section,
          id: section.index, // Use section.id if it exists, otherwise use index
          lessons: section.lessons?.map((lesson: any) => ({
            ...lesson,
            id: lesson.index, // Same logic for lessons
          })),
        }));
        setSections(cleanedSections);
        setInitialCourseData({
          title: courseData.title,
          Description: courseData.description,
          price: courseData.price,
          categories: IdsCategories,
          description: courseData.fullDescription,
          learnings: courseData.learn,
          requirements: courseData.requirements,
          sections: cleanedSections,
        });
      } catch (err) {
        console.error("Error loading course data:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);

    type CourseDataType = {
      title: string;
      description: string;
      price: number;
      categories: number[];
      sections: any[];
      fullDescription: string;
      learnings: string[];
      requirements: string[];
    };

    const courseData: CourseDataType = {
      title,
      description,
      price: parseFloat(price),
      categories: selectedCategories,
      sections,
      fullDescription,
      learnings,
      requirements,
    };

    const hasChanged = <K extends keyof CourseDataType>(
      key: K,
      newVal: CourseDataType[K],
      oldVal: CourseDataType[K]
    ) => JSON.stringify(newVal) !== JSON.stringify(oldVal);

    const changedFields: Partial<CourseDataType> = {};
    (Object.keys(courseData) as (keyof CourseDataType)[]).forEach((key) => {
      if (hasChanged(key, courseData[key], initialCourseData?.[key])) {
        changedFields[key] = courseData[key] as any; // Use 'as any' to silence type issue
      }
    });

    const cleanedSections = changedFields.sections?.map((section: any) => ({
      ...section,
      lessons: section.lessons.map((lesson: any) => {
        const { video, ...rest } = lesson;
        return rest;
      }),
    }));

    const formData = new FormData();
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    if (changedFields.sections) {
      changedFields.sections = cleanedSections;
    }

    formData.append("courseData", JSON.stringify(changedFields));

    // Append videos only for updated sections
    sections.forEach((section) => {
      section.lessons.forEach((lesson: any) => {
        if (lesson.video) {
          const fieldName = `videos[${section.id}][${lesson.id}]`;
          formData.append(fieldName, lesson.video);
        }
      });
    });

    try {
      const data = await courseUtils.edit(id, formData, cookies);
      if (data) router.reload();
    } catch (error) {
      console.error("Error updating course:", error);
      setLoading(false);
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
              {step === 3 && (
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
                        required
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

                  {/* Course Description */}
                  <div className="mt-8 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course Description
                    </label>
                    <textarea
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      rows={4}
                      required
                      placeholder="Provide a compelling description of your course..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Requirements */}
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
                        required
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
            <StepButton
              step={step}
              setStep={setStep}
              totalSteps={3}
              submit={(e) => handleSubmit(e)}
              finalStepTitle="Edit course"
              loading={loading}
            />
          </>
        )}
      </form>
      <Loading show={course === null} />
    </div>
  );
};

export default EditCourseForm;
