import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// Interfaces
interface Course {
  id: string;
  title: string;
  description: string;
  // Fushat shtesë si opsionale:
  price?: number;
  rating?: number;
  status?: string;
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

  // Mbajmë kursin dhe përdoruesin në state
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Fetch course by ID (kur change-het courseId)
  useEffect(() => {
    if (!courseId) return;

    async function fetchCourse() {
      try {
        const res = await fetch(`http://localhost:5000/courses/${courseId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }

        const result = await res.json();
        setCourse(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchCourse();
  }, [courseId]);

  // Handle enrollment logic
  async function handleEnrollment() {
    try {
      // Kontrollojmë nëse user-i është autentikuar
      const res = await fetch("http://localhost:5000/auth/protected", {
        method: "POST",
        credentials: "include",
      });

      const auth = await res.json();

      if (res.ok && auth.user) {
        // Ruajmë të dhënat e user-it në state
        const currentUser: User = {
          id: auth.user.id,
          name: auth.user.name,
          email: auth.user.email,
        };
        setUser(currentUser);

        // Vijojmë me procesin e enrollment-it
        const enrollRes = await fetch("http://localhost:5000/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_id: currentUser.id,
            course_id: courseId,
          }),
        });

        if (!enrollRes.ok) {
          throw new Error(`HTTP Error! Status: ${enrollRes.status}`);
        }

        const result = await enrollRes.json();
        console.log("Enrollment successful:", result);

        // Mund ta dërgoni user-in diku pas regjistrimit (p.sh. homepage)
        router.push("/");
      } else {
        // Nëse nuk kemi user, e vendosim në null dhe tregojmë një mesazh
        setUser(null);
        alert("Please log in to enroll.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
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
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Next.js Course Enrollment
        </h1>
        {/* Lexojmë 'user' për të eliminuar gabimin e TS */}
        {user && (
          <p className="mt-2 text-blue-600">
            Mirë se erdhe, {user.name}!
          </p>
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
