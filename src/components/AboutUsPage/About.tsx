// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";

const logos = [
  "/aboutus/codecademy.png",
  "/aboutus/coursera.png",
  "/aboutus/duoling.png",
  "/aboutus/edx.png",
  "/aboutus/khanacademy.png",
  "/aboutus/linkedinlearning.png",
  "/aboutus/pluralsight.png",
  "/aboutus/skillshare.png",
  "/aboutus/udacity.png",
  "/aboutus/udemy.png",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center" />
        {/* Optionally, add a semi-transparent overlay for better text contrast */}
        <div className="absolute inset-0" />

        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Adjust heading sizes for smaller screens */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-950 hover:text-blue-200 transition duration-300">
              About Us
            </h1>
            {/* Scale paragraph text across breakpoints */}
            <p className="text-base sm:text-lg md:text-xl font-semibold mb-8">
              At{" "}
              <span className="text-blue-950 font-extrabold">EduSpark,</span>{" "}
              we believe that education is the spark that ignites change.
            </p>
            {/* Adjust button padding for smaller vs. larger screens */}
            <button className="bg-white text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              See More
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          Skills are the key to unlocking potential
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto">
          Whether you're here to master a new skill, upskill your team,
          or share knowledge with others, you’re in the right place.
          As a leader in online learning,{" "}
          <span className="text-blue-950 font-bold">EduSpark</span> is your
          partner in unlocking new opportunities, achieving your goals, and
          transforming your future.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image container responsive height */}
          <div className="relative w-full h-[250px] sm:h-[350px]">
            <Image
              src="/images/aboutuspage.jpg"
              alt="Learning and leading through change"
              fill
              className="rounded-xl shadow-md object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl text-blue-950 font-bold mb-4">
              Learning and leading through change
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-black">
              Change is constant — but growth is a choice. At{" "}
              <span className="text-blue-950 font-bold">EduSpark</span>,
              we don’t just help you keep up with change — we help you lead it.
              Our learning experiences are designed to prepare you for
              the challenges ahead, equipping you with the tools to thrive
              in an ever-evolving world.
            </p>
          </div>
        </div>
      </div>

      {/* Global Impact Section */}
      <div className="bg-gradient-to-r from-[#a7b3ff] to-[#cfcaff] text-[#1f1f1f] py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-6">
            Creating impact around the world
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            We’re more than just a learning platform — we're a global movement
            shaping the future of education.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold">77K+</p>
              <p className="text-blue-600 hover:text-blue-950 font-semibold mt-2 text-xs sm:text-sm">
                Learners transforming their futures
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold">80K+</p>
              <p className="text-blue-600 hover:text-blue-950 font-semibold mt-2 text-xs sm:text-sm">
                Expert instructors driving innovation
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold">250K+</p>
              <p className="text-blue-600 hover:text-blue-950 font-semibold mt-2 text-xs sm:text-sm">
                Courses across every major field
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold">1M+</p>
              <p className="text-blue-600 hover:text-blue-950 font-semibold mt-2 text-xs sm:text-sm">
                Course enrollments and counting
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold">75+</p>
              <p className="text-blue-600 hover:text-blue-950 font-semibold mt-2 text-xs sm:text-sm">
                Languages breaking down barriers
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold">17K+</p>
              <p className="text-blue-600 hover:text-blue-950 font-semibold mt-2 text-xs sm:text-sm">
                Enterprise customers building stronger teams
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16 sm:py-20 px-4 sm:px-6 md:px-8 text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
            We partner with organizations of every size and sector to help them
            stay ahead of what's next. By delivering expertly curated courses in
            business, technology, and beyond, we empower companies, institutions,
            and nonprofits to grow, adapt, and lead—placing learning at the core
            of their success.
          </p>
          <button className="mt-6 bg-[#4f46e5] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#4338ca] transition">
            Learn more
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-left">
          {[
            {
              quote:
                "EduSpark’s courses fit us perfectly. Their team consistently delivers fresh, up-to-date content that’s easy to implement and perfectly aligned with our development goals.",
              name: "Varun Patil",
              title: "Senior Manager of HR Development",
              link: "#",
              linkText: "Read the Synechron case study →",
            },
            {
              quote:
                "Overall, it was a major success. I regularly received feedback from our teams on how impactful and practical the EduSpark platform was.",
              name: "Alfred Helmerich",
              title: "Executive Training Manager",
              link: "#",
              linkText: "Read the NTT DATA case study →",
            },
            {
              quote:
                "EduSpark adapted quickly to our evolving business needs and delivered real results globally. It’s by far the best solution we’ve found for upskilling our employees.",
              name: "Luz Santillana Romero",
              title: "Development and Engagement Director",
              link: "#",
              linkText: "Read the Indra case study →",
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-4xl text-[#4f46e5] mb-2">“”</p>
              <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-6">
                {item.quote}
              </p>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.title}</p>
                <a
                  href={item.link}
                  className="text-[#4f46e5] font-semibold mt-2 inline-block"
                >
                  {item.linkText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logos & Footer */}
      <div className="bg-white py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* 
            - Used xl:grid-cols-5 for even better scaling on large screens.
            - Also ensures a smooth transition from mobile to large desktop.
          */}
          <div className="bg-gray-100 rounded-xl py-10 px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 items-center justify-items-center mb-16">
            {logos.map((logo, i) => (
              <Image
                key={i}
                width={140}
                height={80}
                src={logo}
                alt={`Partner logo ${i + 1}`}
                className="object-contain max-h-20 w-auto"
                priority={i < 3}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold border-b-4 border-[#4f46e5] inline-block mb-4">
                Work with us
              </h3>
              <p className="mb-4 text-gray-600">
                We’re building the future of online learning. Our team is
                passionate about education, diversity, and helping people
                thrive.
              </p>
              <Link href="/signupmodal" className="text-[#4f46e5] font-semibold">
                Join our team →
              </Link>
            </div>

            <div>
              <h3 className="text-xl font-bold border-b-4 border-[#4f46e5] inline-block mb-4">
                See our research
              </h3>
              <p className="mb-4 text-gray-600">
                Explore insights about learning, productivity, and the modern
                workplace through our latest research.
              </p>
              <Link href="#" className="text-[#4f46e5] font-semibold">
                Learn more →
              </Link>
            </div>

            <div>
              <h3 className="text-xl font-bold border-b-4 border-teal-600 inline-block mb-4">
                Read our blog
              </h3>
              <p className="mb-4 text-gray-600">
                Stay updated with our ideas, news, and learning tips from the
                world of education and tech.
              </p>
              <Link href="#" className="text-teal-600 font-semibold">
                Read now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
