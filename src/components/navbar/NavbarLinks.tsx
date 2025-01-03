"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarLinks = ({ isMobile = false, onCloseMobileMenu = () => {} }) => {
  const pathName = usePathname();

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
        href="/main/dashboard"
        className={
          pathName == "/main/dashboard"
            ? `${activeLinkStyle}`
            : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Dashboard
      </Link>
      <Link
        href="/main/expenses"
        className={
          pathName == "/main/expenses"
            ? `${activeLinkStyle}`
            : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Expenses
      </Link>
      <Link
        href="/main/budget"
        className={
          pathName == "/main/budget" ? `${activeLinkStyle}` : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Budget
      </Link>
      <Link
        href="/main/recurring"
        className={
          pathName == "/main/recurring"
            ? `${activeLinkStyle}`
            : `${navLinkStyle}`
        }
        onClick={handleClick}
      >
        Recurring
      </Link>
    </div>
  );
};

export default NavbarLinks;
