"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import UserMenu from "./UserMenu";
import NavbarLinks from "./NavbarLinks";
import MobileNav from "./MobileNav";
import Brand from "./Brand";
import Link from "next/link";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="p-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Brand />

        {/* Navbar Links for Desktop */}
        {user && <NavbarLinks />}
        {/* User Menu / Sign In Button */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div>Loading...</div> // Show loading indicator
          ) : error ? (
            <div>Error: {error.message}</div> // Show error message
          ) : user ? (
            <UserMenu
              user={user} // Pass the user prop
            />
          ) : (
            <Link href="/auth" className="text-blue-500 hover:text-blue-700">
              Sign In
            </Link>
          )}

          {/* Mobile Menu */}
          {user && <MobileNav />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
