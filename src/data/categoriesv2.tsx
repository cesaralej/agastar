import {
  FaShoppingCart,
  FaLightbulb,
  FaHome,
  FaTaxi,
  FaCoins,
} from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { MdRestaurant } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";

// Define categories as an array of objects
export const categories = [
  {
    name: "investment",
    label: "Investment",
    icon: <FaHome />,
    color: "bg-red-100",
  },
  {
    name: "utilities",
    label: "Utilities",
    icon: <FaLightbulb />,
    color: "bg-blue-100",
  },
  {
    name: "groceries",
    label: "Groceries",
    icon: <FaShoppingCart />,
    color: "bg-green-100",
  },
  {
    name: "transportation",
    label: "Transportation",
    icon: <FaTaxi />,
    color: "bg-yellow-100",
  },

  {
    name: "food",
    label: "Food",
    icon: <MdRestaurant />,
    color: "bg-orange-100",
  },
  {
    name: "fun",
    label: "Fun",
    icon: <GiPartyPopper />,
    color: "bg-red-100",
  },
  {
    name: "luxury",
    label: "Luxury",
    icon: <IoSparkles />,
    color: "bg-purple-100",
  },

  {
    name: "salary",
    label: "Salary",
    icon: <FaSackDollar />,
    color: "bg-green-100",
  },
  {
    name: "other",
    label: "Other",
    icon: <FaCoins />,
    color: "bg-indigo-50",
  },
] as const;

export type CategoryType = (typeof categories)[number]["name"] | "";

export default categories;
