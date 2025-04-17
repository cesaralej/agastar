import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: " Dashboard",
    path: "/dashboard",
  },
  {
    label: " Transactions",
    path: "/transactions",
  },
  {
    label: " Budget",
    path: "/budget",
  },
  {
    label: " Recurring",
    path: "/recurring",
  },
];

const navLinkStyle = "text-gray-900 dark:text-white py-2 px-3 rounded";

const activeLinkStyle =
  "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 py-2 px-3 rounded";

const MobileNav = () => {
  const pathName = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="md:hidden dark:text-white text-2xl rounded-lg focus:outline-none text-gray-500">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">menu</SheetTitle>
        <nav className="flex flex-col pt-4">
          {links.map((link) => (
            <SheetClose asChild key={link.label}>
              <Link
                href={link.path}
                className={
                  pathName === link.path ? activeLinkStyle : navLinkStyle
                }
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
export default MobileNav;
