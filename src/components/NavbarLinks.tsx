import Link from "next/link";
import { useRouter } from "next/router";

const NavbarLinks = ({ isMobile = false, onCloseMobileMenu = () => {} }) => {
  const router = useRouter();

  const handleClick = () => {
    onCloseMobileMenu();
  };

  const navLinkStyle =
    "text-gray-900 dark:text-white py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-600";

  const activeLinkStyle =
    "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 py-2 px-3 rounded";

  return (
    <div className={isMobile ? "flex flex-col" : "hidden md:flex space-x-8"}>
      <Link
        href="/"
        className={
          router.pathname == "/" ? `${activeLinkStyle}` : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Dashboard
      </Link>
      <Link
        href="/expenses"
        className={
          router.pathname == "/expenses"
            ? `${activeLinkStyle}`
            : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Expenses
      </Link>
      <Link
        href="/budget"
        className={
          router.pathname == "/budget"
            ? `${activeLinkStyle}`
            : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Budget
      </Link>
      <Link
        href="/utilities"
        className={
          router.pathname == "/utilities"
            ? `${activeLinkStyle}`
            : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Utilities
      </Link>
    </div>
  );
};

export default NavbarLinks;
