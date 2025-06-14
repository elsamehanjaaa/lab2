"use client";

import { useState } from "react";
import Image from "next/image";
import * as instructorUtils from "@/utils/instructor";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
// import Illustration from "/images/illustration.png";

const steps = ["Teaching Experience", "Subject Expertise", "Your Goals"];

interface InstructorFormData {
  teachingType: string;
  experienceYears: string;
  ageGroups: string[];
  subjects: string[];
  createdVideoContent: string;
  tools: string[];
  motivation: string;
  weeklyAvailability: string;
  publishTime: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie as string;
  const parsedCookies = parse(cookies);
  const access_token = parsedCookies.access_token;

  if (!access_token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const access = await instructorUtils.checkInstructorRole(cookies);

  if (access) {
    return {
      redirect: {
        destination: "/instructor",
        permanent: false,
      },
    };
  }
  return {
    props: {}, // Return an empty props object as a fallback
  };
};
export default function index() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<InstructorFormData>({
    teachingType: "",
    experienceYears: "",
    ageGroups: [],
    subjects: [],
    createdVideoContent: "",
    tools: [],
    motivation: "",
    weeklyAvailability: "",
    publishTime: "",
  });

  const handleNext = (): void => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = (): void => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (
    name: keyof InstructorFormData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInArray = (
    name: keyof InstructorFormData,
    value: string
  ): void => {
    setFormData((prev) => {
      const list = new Set(prev[name] as string[]);
      list.has(value) ? list.delete(value) : list.add(value);
      return { ...prev, [name]: Array.from(list) };
    });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await instructorUtils.createTeacherProfile(formData);
      router.push("/instructor");
    } catch (error) {}
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <div className="mb-6">
        <h1 className="text-lg font-medium mb-2">
          Step {step + 1} of {steps.length}
        </h1>
        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-full bg-purple-600 transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex md:flex-col gap-8 max-w-3/5">
          <div className="flex justify-between">
            <div className="">
              {/* Stage 1 */}
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Teaching Experience
                  </h2>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      What kind of teaching have you done before?
                    </p>
                    {[
                      "In person, informally",
                      "In person, professionally",
                      "Online",
                      "Other",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="radio"
                          name="teachingType"
                          value={opt}
                          checked={formData.teachingType === opt}
                          onChange={(e) =>
                            handleChange("teachingType", e.target.value)
                          }
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      How many years of teaching experience do you have?
                    </p>
                    {[
                      "Less than 1 year",
                      "1-3 years",
                      "3-5 years",
                      "5+ years",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="radio"
                          name="experienceYears"
                          value={opt}
                          checked={formData.experienceYears === opt}
                          onChange={(e) =>
                            handleChange("experienceYears", e.target.value)
                          }
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      What age groups have you taught?
                    </p>
                    {[
                      "Children (under 12)",
                      "Teens",
                      "Adults",
                      "Professionals",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="checkbox"
                          checked={formData.ageGroups.includes(opt)}
                          onChange={() => toggleInArray("ageGroups", opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage 2 */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Subject & Content Skills
                  </h2>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      What subjects are you interested in teaching?
                    </p>
                    {[
                      "Development",
                      "Design",
                      "Business",
                      "Marketing",
                      "Personal Development",
                      "Health & Fitness",
                      "Other",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(opt)}
                          onChange={() => toggleInArray("subjects", opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      Have you ever created video content before?
                    </p>
                    {["Yes", "No"].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="radio"
                          name="createdVideoContent"
                          value={opt}
                          checked={formData.createdVideoContent === opt}
                          onChange={(e) =>
                            handleChange("createdVideoContent", e.target.value)
                          }
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      What tools are you comfortable using?
                    </p>
                    {[
                      "PowerPoint / Keynote",
                      "Screen Recording Tools",
                      "Video Editing Software",
                      "None",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="checkbox"
                          checked={formData.tools.includes(opt)}
                          onChange={() => toggleInArray("tools", opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage 3 */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      Why do you want to teach online?
                    </p>
                    {[
                      "Share knowledge",
                      "Earn extra income",
                      "Build a personal brand",
                      "Other",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="radio"
                          name="motivation"
                          value={opt}
                          checked={formData.motivation === opt}
                          onChange={(e) =>
                            handleChange("motivation", e.target.value)
                          }
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      How much time can you dedicate weekly?
                    </p>
                    {["1-3 hours", "4-7 hours", "8-15 hours", "15+ hours"].map(
                      (opt) => (
                        <label key={opt} className="block mb-2">
                          <input
                            type="radio"
                            name="weeklyAvailability"
                            value={opt}
                            checked={formData.weeklyAvailability === opt}
                            onChange={(e) =>
                              handleChange("weeklyAvailability", e.target.value)
                            }
                            className="mr-2"
                          />
                          {opt}
                        </label>
                      )
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      When would you like to publish your first course?
                    </p>
                    {[
                      "Within 1 month",
                      "1-3 months",
                      "3-6 months",
                      "Just exploring for now",
                    ].map((opt) => (
                      <label key={opt} className="block mb-2">
                        <input
                          type="radio"
                          name="publishTime"
                          value={opt}
                          checked={formData.publishTime === opt}
                          onChange={(e) =>
                            handleChange("publishTime", e.target.value)
                          }
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block w-1/3 my-auto">
              <img
                src="/images/illustration.png"
                alt="Illustration of teaching"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Back
              </button>
            )}
            <button
              onClick={step === steps.length - 1 ? handleSubmit : handleNext}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
              disabled={step === 0 && !formData.teachingType}
            >
              {step === steps.length - 1 ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
