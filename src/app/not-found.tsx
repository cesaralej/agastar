import Link from "next/link";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-screen flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center w-96">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center mx-auto"
        >
          <FaHome className="mr-2" /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
