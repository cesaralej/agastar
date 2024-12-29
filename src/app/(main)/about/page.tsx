import Image from "next/image";
import Link from "next/link";
import astronaut from "./astronaut.png";

const AboutPage = () => {
  return (
    <main className="py-16 px-6 md:px-24 lg:px-32">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Agastar: Charting Your Course to Financial Orbit
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            In the vast expanse of personal finance, finding your way can feel
            like navigating uncharted territory. Agastar is your trusted
            co-pilot, providing the tools and insights to confidently navigate
            the complexities of your financial universe.
          </p>
          <div className="mt-10 flex justify-center">
            <Image src={astronaut} alt="astronaut" width={300} height={300} />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-white py-12 px-8 md:px-16 rounded-lg shadow-md mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Our Mission: Financial Empowerment, Elevated.
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We empower individuals to achieve financial clarity and reach their
            full potential. Agastar is more than just a budgeting app; it's a
            strategic platform designed to illuminate your financial landscape,
            enabling informed decisions and sustainable growth.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-12 px-8 md:px-16 rounded-lg shadow-md mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Our Genesis: From Constellation to Creation
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Born from a desire to demystify personal finance, Agastar emerged as
            a beacon in the often-turbulent financial waters. We recognized the
            need for a user-centric platform that simplifies complex data and
            empowers users to take command of their financial trajectory.
            Agastar is the culmination of this vision—a powerful, intuitive tool
            designed to propel you towards your financial aspirations.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-12 px-8 md:px-16 rounded-lg shadow-md mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Our Guiding Stars: Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Transparency
              </h3>
              <p className="text-gray-600">
                We believe in open, honest, and accessible financial
                information. Clarity fuels confidence.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Simplicity
              </h3>
              <p className="text-gray-600">
                We cut through the complexity of finance, delivering intuitive
                tools that are easy to use and understand.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Empowerment
              </h3>
              <p className="text-gray-600">
                We equip you with the knowledge and resources you need to
                confidently navigate your financial future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (Optional) */}
      <section className="text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-lg text-gray-700 mb-8">
            Ready to launch your financial journey?
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
