import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import * as enrollmentUtils from "@/utils/enrollment";
import * as courseUtils from "@/utils/course";
import { parse } from "cookie";
import { LoaderCircle } from "lucide-react";

// Interfaces
interface Course {
  title: string;
  description: string;
  // Fushat shtesë si opsionale:
  price?: number;
  rating?: number;
  status?: boolean;
  created_at?: string;
  slug?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Index = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  // Mbajmë kursin dhe përdoruesin në state
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Fetch course by ID (kur change-het courseId)
  useEffect(() => {
    if (!courseId) return;

    async function fetchCourse() {
      try {
        const cookies = parse(document.cookie || "");
        const access_token = cookies["access_token"];

        const courses = await courseUtils.getById(
          courseId as string,
          access_token as string
        );
        setCourse(courses);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchCourse();
  }, [courseId]);
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // reset to default
    }

    // Optional: reset on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);
  // Handle enrollment logic

  async function handleEnrollment() {
    try {
      setLoading(true);
      const result = await enrollmentUtils.enroll(courseId as string); // <- Cleaner call

      // Redirect the user after successful enrollment
      router.push("/myCourses");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert(error instanceof Error ? error.message : "Enrollment failed");
    }
  }

  // Nëse course nuk ka ardhur ende, mund të shfaqim një "Loading..."
  if (!course) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h2 className="text-xl">Loading course...</h2>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="absolute w-full h-full bg-gray-300 opacity-50 flex justify-center items-center">
          <LoaderCircle className="animate-spin w-8 h-8 text-gray-700" />
        </div>
      )}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Next.js Course Enrollment
        </h1>
        {/* Lexojmë 'user' për të eliminuar gabimin e TS */}
        {user && (
          <p className="mt-2 text-blue-600">Mirë se erdhe, {user.name}!</p>
        )}
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="flex justify-center mb-6">
                  <div className="relative w-full aspect-w-16 aspect-h-9">
                    <Image
                      src="/images/course.jpg"
                      alt="Course Image"
                      className="object-cover w-full h-full rounded-lg"
                      fill
                    />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4">{course.title}</h2>
                <p>{course.description}</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleEnrollment}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
