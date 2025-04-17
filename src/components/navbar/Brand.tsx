import { FaShuttleSpace } from "react-icons/fa6";
import Link from "next/link";
const Brand = () => {
  return (
    <Link href="/">
      <div className="flex items-center space-x-3">
        <FaShuttleSpace className="h-8 w-8 text-purple-600 transform rotate-[-50deg]" />
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          Agastar
        </span>
      </div>
    </Link>
  );
};
export default Brand;
