interface MobileMenuToggleProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenuToggle = ({ toggleMobileMenu }: MobileMenuToggleProps) => {
  return (
    <button
      onClick={toggleMobileMenu}
      className="md:hidden flex items-center justify-center p-2 text-gray-500 rounded-lg focus:outline-none"
    >
      <span className="sr-only">Open menu</span>
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
    </button>
  );
};

export default MobileMenuToggle;
