import React, { useState, useEffect, useRef } from "react";

const CreateCourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<any[]>([]); // Store sections and their lessons
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:5000/categories", {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      setCategories(result);
    };
    getCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

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
      id: section.lessons.length + +1,
      title: "",
      content: "",
      type: "text", // Default to 'text'
      video: null, // Store the video file if the lesson type is 'video'
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
    console.log(sections);
    if (!title || !description || !thumbnail || !selectedCategory) {
      alert("complete all inputs");
      return "";
    }
    const courseData = {
      title,
      description,
      price: parseFloat(price),
      rating: 0,
      categories: [selectedCategory],
      thumbnail_url: "",
      sections: sections, // Include sections with lessons
    };

    try {
      const token = getCookie("access_token");

      function getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      }
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);
        formData.append("course", title);

        const thumbnailRes = await fetch(
          "http://localhost:5000/upload/thumbnail",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const thumbnailResult = await thumbnailRes.json();
        courseData.thumbnail_url = thumbnailResult.url;
      }

      const response = await fetch("http://localhost:5000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Course created successfully:", data);
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setSelectedCategory("");
        setThumbnail(null);
        setSections([]); // Reset sections
      } else {
        const error = await response.json();
        console.error("Error creating course:", error);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📚 Create a New Course
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Info */}
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
        <div ref={dropdownRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-left"
          >
            {selectedCategories.length === 0 ? (
              <span className="text-gray-500">Select Categories</span>
            ) : (
              selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c._id === categoryId);
                return (
                  category && (
                    <span
                      key={category._id}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  )
                );
              })
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className={`flex items-center px-4 py-2 cursor-pointer transition rounded ${
                    selectedCategories.includes(category._id)
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => {
                      if (selectedCategories.includes(category._id)) {
                        setSelectedCategories((prev) =>
                          prev.filter((id) => id !== category._id)
                        );
                      } else {
                        setSelectedCategories((prev) => [
                          ...prev,
                          category._id,
                        ]);
                      }
                    }}
                    className="mr-2 accent-blue-600"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            // required
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0 file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Sections */}
        <div>
          <button
            type="button"
            onClick={handleAddSection}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Add Section
          </button>

          {sections.map((section) => (
            <div key={section.id} className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Section {section.id}</h2>

              <div>
                <button
                  type="button"
                  onClick={() => handleAddLesson(section.id)}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition mb-4"
                >
                  Add Lesson
                </button>

                {section.lessons.map(
                  (lesson: {
                    id: React.Key | null | undefined;
                    title: string | number | readonly string[] | undefined;
                    content: string | number | readonly string[] | undefined;
                    type: string;
                  }) => (
                    <div
                      key={lesson.id}
                      className="flex flex-col mb-4 border-b pb-4"
                    >
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonChange(
                            section.id,
                            lesson.id as number,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Lesson Title"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      />

                      <div className="flex items-center mb-4">
                        <span className="mr-2">Text</span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={lesson.type === "video"}
                            onChange={() =>
                              lesson.type === "text"
                                ? handleLessonChange(
                                    section.id,
                                    lesson.id as number,
                                    "type",
                                    "video"
                                  )
                                : handleLessonChange(
                                    section.id,
                                    lesson.id as number,
                                    "type",
                                    "text"
                                  )
                            }
                            className="toggle-checkbox"
                          />
                          <span className="slider"></span>
                        </label>
                        <span className="ml-2">Video</span>
                      </div>

                      {lesson.type === "text" ? (
                        <textarea
                          value={lesson.content}
                          onChange={(e) =>
                            handleLessonChange(
                              section.id,
                              lesson.id as number,
                              "content",
                              e.target.value
                            )
                          }
                          placeholder="Lesson Content"
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                      ) : (
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleLessonChange(
                              section.id,
                              lesson.id as number,
                              "video",
                              e.target.files ? e.target.files[0] : undefined
                            )
                          }
                          className="w-full text-sm mb-2 text-gray-600 file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0 file:font-semibold
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          lesson.id &&
                          handleRemoveLesson(section.id, lesson.id as number)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
                      >
                        Remove Lesson
                      </button>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSection(section.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Remove Section
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;
