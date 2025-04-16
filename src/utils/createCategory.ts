interface CourseData {
  title: string;
  description: string;
  price: number;
  rating?: number;
  categories: number[];
  thumbnail_url?: string;
  sections: any[];
}

export const createCourse = async (courseData: CourseData, token: string) => {
  const response = await fetch("http://localhost:5000/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create course");
  }

  return data;
};
