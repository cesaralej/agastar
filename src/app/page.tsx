import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Agastar
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Take control of your finances today.
        </p>
        <Link href="/auth">
          {" "}
          {/* Or /signup if you have a signup page */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
