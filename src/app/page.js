import Link from 'next/link';
import Image from 'next/image';

// Hero section component
const Hero = () => (
  <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
    <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-20">
      <div className="px-6 lg:px-0 lg:pt-4">
        <div className="mx-auto max-w-2xl">
          <div className="max-w-lg">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Learn coding at your own pace
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              LearnMore provides interactive lessons, hands-on coding practice, and a supportive
              community to help you master programming and computer science.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started for free
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
        <div className="relative rounded-xl border border-indigo-200 bg-white p-6 shadow-2xl">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/images/coding-screenshot.png"
              alt="LearnMore platform screenshot"
              width={800}
              height={500}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Feature section component
const FeatureSection = () => {
  const features = [
    {
      title: 'Interactive Lessons',
      description:
        'Engaging, step-by-step lessons with rich media content and examples to solidify your understanding.',
      icon: '📚',
    },
    {
      title: 'Hands-on Coding Practice',
      description:
        'Apply what you learn with our built-in code editor and get instant feedback on your solutions.',
      icon: '💻',
    },
    {
      title: 'Personalized Learning Path',
      description:
        'Track your progress and get recommended content based on your skill level and interests.',
      icon: '🧭',
    },
    {
      title: 'Expert-Created Content',
      description:
        'Learn from industry professionals with lessons covering the latest technologies and best practices.',
      icon: '👩‍💻',
    },
    {
      title: 'Build Your Portfolio',
      description:
        'Complete projects that demonstrate your skills and can be showcased to potential employers.',
      icon: '🏆',
    },
    {
      title: 'Community Support',
      description:
        'Connect with fellow learners, ask questions, and collaborate on projects in our community forums.',
      icon: '👥',
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Learn Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to master coding
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines structured learning with practical application to accelerate your
            coding journey.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-2xl">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

// Testimonials section
const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "LearnMore helped me transition from a non-technical background to a full-stack developer role in just 6 months. The practical projects and guidance were invaluable.",
      author: "Sarah J.",
      role: "Junior Developer at TechCorp",
    },
    {
      content:
        "The interactive lessons and real-time feedback on my code helped me understand complex concepts much faster than other platforms I've tried.",
      author: "Michael T.",
      role: "Computer Science Student",
    },
    {
      content:
        "As someone returning to coding after a break, LearnMore was perfect for updating my skills with the latest technologies and best practices.",
      author: "Priya K.",
      role: "Senior Frontend Developer",
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See what our students are saying
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gray-50 p-8 shadow-sm ring-1 ring-gray-200"
              >
                <blockquote className="text-gray-700">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="mt-1 text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Call to action section
const CTASection = () => (
  <div className="bg-indigo-700">
    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to start your learning journey?
          <br />
          Sign up today and join thousands of learners.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
          Get access to all our lessons, practice exercises, and community features.
          No credit card required to start.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/register"
            className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get started for free
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold leading-6 text-white"
          >
            View pricing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Main homepage component
export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}