// app/about/page.tsx
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      <div
        className="flex flex-col lg:px-40 md:px-20 px-6 justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[600px] flex flex-col justify-center items-start mt-16 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-extrabold py-6 text-left leading-tight">
            About Us 
          </h1>
          <h3 className="text-lg md:text-xl font-medium py-4 text-left">
            Build skills with courses, certificates, and degrees online from
            world-class universities and companies.
          </h3>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition duration-300 ease-in-out mt-4">
            See More
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Skills are the key to unlocking potential
        </h1>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
          Whether you want to learn a new skill, train your teams, or share what you know with the world, you’re in the right place. As a leader in online learning, we’re here to help you achieve your goals and transform your life.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-[350px]">
            <Image
              src="/about-us-panel.jpg" // sigurohu që ky imazh ekziston në /public
              alt="Learning and leading through change"
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-md"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Learning and leading through change
            </h2>
            <p className="text-gray-700 text-base">
              Dudu Moloko knows that the world is changing, and she won’t let that stand in the way of success for FirstRand employees. Instead, she helps them not just cope with change but thrive in it.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
