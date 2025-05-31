"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to send message");
      }

      alert("Message sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`Failed to send message: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-950 mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or want to collaborate? We’d love to hear from you.
            Fill out the form below or reach out directly using our contact
            information.
          </p>
        </div>

        {/* CONTENT */}
        {/* 
          - Moved from `lg:grid-cols-2` to `md:grid-cols-2` so two-column layout
            begins at medium screens (~768px) instead of large (~1024px).
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md 
                             min-h-[150px] focus:outline-none focus:ring-2 
                             focus:ring-blue-500 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-950 text-white font-semibold 
                           px-4 py-2 rounded-md transition duration-300 
                           shadow-md hover:bg-blue-800 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-7 h-7 text-blue-950 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">EduSparksupport@gmail.com</p>
                  <p className="text-gray-600">EduSparkinfo@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-7 h-7 text-blue-950 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-600">+383 44 123 456</p>
                  <p className="text-gray-600">+383 44 789 012</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-7 h-7 text-blue-950 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-gray-600">
                    Rr. Kolegji UBT
                    <br />
                    Prishtinë, 10000
                    <br />
                    Kosovë
                  </p>
                </div>
              </div>
            </div>

            {/* BUSINESS HOURS */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
