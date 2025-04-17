export const createCourse = async (courseData: FormData, token: string) => {
  const response = await fetch("http://localhost:5000/courses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Authorization token
    },
    body: courseData, // Directly send the FormData (no need to set Content-Type)
    credentials: "include", // Include credentials (if needed)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create course");
  }

  return data;
};
