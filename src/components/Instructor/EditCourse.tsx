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
          id: section.index,
          lessons: section.lessons?.map((lesson: any) => ({
            ...lesson,
            id: lesson.index,
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
  }, [id, cookies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        changedFields[key] = courseData[key] as any;
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

    sections.forEach((section) => {
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
      if (data) router.reload();
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    const newSection = {
      id: sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1,
      title: "",
      lessons: [],
      course_id: id,
    };
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
    <div className="max-w-5xl mx-auto p-8 lg:p-12 bg-gray-900 text-white shadow-xl rounded-3xl mt-6 flex flex-col h-[85vh]">
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">✏️ Editing Course</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-between overflow-hidden"
      >
        <div className="flex-grow overflow-y-auto pr-4">
          {!course ? (
            <Loading show={true} />
          ) : (
            <>
              {step === 1 && (
                <div className="animate-fade-in space-y-6">
                  <Thumbnail
                    onThumbnailChange={setThumbnail}
                    initialUrl={thumbnailUrl}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border-gray-800 hover:bg-gray-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border-gray-800 hover:bg-gray-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Short Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                      className="w-full bg-gray-700 text-white border-gray-800 hover:bg-gray-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-blue-400 mb-6">
                    Edit Sections
                  </h2>
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="bg-gray-800 p-1 mb-3 rounded-xl"
                    >
                      <Section
                        section={section}
                        onAddLesson={handleAddLesson}
                        onRemoveSection={handleRemoveSection}
                        onLessonChange={handleLessonChange}
                        onSectionChange={handleSectionChange}
                        onRemoveLesson={handleRemoveLesson}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="mt-6 w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    Add Section
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in space-y-6">
                  <h2 className="text-2xl font-bold text-blue-400 mb-6">
                    Course Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What students will learn
                    </label>
                    {learnings.map((item, index) => (
                      <input
                        key={index}
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleLearningChange(index, e.target.value)
                        }
                        placeholder={`Learning outcome ${index + 1}`}
                        required
                        className="w-full mb-2 bg-gray-700 text-white border-gray-800 hover:bg-gray-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addLearning}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      + Add more
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Course Description
                    </label>
                    <textarea
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      rows={6}
                      required
                      className="w-full bg-gray-700 text-white border-gray-800 hover:bg-gray-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                        placeholder={`Requirement ${index + 1}`}
                        required
                        className="w-full mb-2 bg-gray-700 text-white border-gray-800 hover:bg-gray-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      + Add more
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex-shrink-0 pt-5">
          <StepButton
            step={step}
            setStep={setStep}
            totalSteps={3}
            submit={(e) => handleSubmit(e)}
            finalStepTitle="Save Changes"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm;
