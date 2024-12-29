import Link from "next/link"; // If using Next.js

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4 text-center text-gray-600 w-full">
      <div className="flex items-center justify-center space-x-4">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <p className="mt-2">&copy; {new Date().getFullYear()} Agastar</p>
    </footer>
  );
}
