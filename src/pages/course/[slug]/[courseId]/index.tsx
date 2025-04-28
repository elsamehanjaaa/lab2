import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  slug: string;
  courseId: string;
  thumbnail_url?: string;
}

const Index = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function getCourse() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/courses/${courseId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 404) {
            // router.replace("/course/not-found");
            return;
          } else {
            throw new Error(`HTTP Error! Status: ${res.status}`);
          }
        }

        const result = await res.json();
        setCourse(result);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching the course.");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    getCourse();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Enroll in Course</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Enrollment</h1>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading && (
          <p className="text-center text-gray-700 text-lg">Loading course...</p>
        )}

        {error && <p className="text-center text-red-600 text-lg">{error}</p>}

        {!loading && !error && course && (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-2">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-full aspect-w-16 aspect-h-9">
                      <Image
                        src={course.thumbnail_url || "/images/no-thumbnail.png"}
                        alt="Thumbnail"
                        className="object-cover rounded-md max-h-[400px]"
                        width={800}
                        height={400}
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4">
                    {course.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{course.description}</p>

                  <div className="flex items-center mb-4">
                    <span className="text-yellow-500 mr-2">★★★★☆</span>
                    <span className="text-gray-600">{course.rating}</span>
                  </div>

                  <div className="mb-4">
                    <span className="text-gray-600">Created by</span>{" "}
                    <span className="text-blue-600">John Doe</span>
                  </div>

                  <div className="mb-4">
                    <span className="text-gray-600">Language:</span>{" "}
                    <span className="text-blue-600">English</span>
                  </div>

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push(`/course/subscribe/${courseId}`)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    What you will learn
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>Learn Next.js fundamentals</li>
                    <li>Build server-side rendered apps</li>
                    <li>Implement API routes</li>
                    <li>Deploy your Next.js applications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
