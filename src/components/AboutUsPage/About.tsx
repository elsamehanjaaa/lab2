// app/about/page.tsx
import Image from 'next/image'

export default function AboutPage() {
  return (
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
            src="/about-us-panel.jpg" // vendos emrin e imazhit tënd këtu
            alt="Learning and leading through change"
            layout="fill"
            objectFit="cover"
            className="rounded-xl shadow-md"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Learning and leading through change</h2>
          <p className="text-gray-700 text-base">
            Dudu Moloko knows that the world is changing, and she won’t let that stand in the way of success for FirstRand employees. Instead, she helps them not just cope with change but thrive in it.
          </p>
        </div>
      </div>
    </div>
  )
}
