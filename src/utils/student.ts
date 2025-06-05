type StudentStatus = "Active" | "Suspended";
interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: enrolledCourses[];
}
interface enrolledCourses {
  id: string;
  title: string;
  enrolled_at: string;
  progress: number;
  status: StudentStatus;
}
export const getStudentsFromIntructor = async (
  instructor_id: string
): Promise<Student[]> => {
  if (!instructor_id) {
    return [];
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/enrollments/getStudentsFromInstructor`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instructor_id }),
    }
  );

  if (!res.ok) {
    return [];
  }
  const data = await res.json();

  return data;
};
