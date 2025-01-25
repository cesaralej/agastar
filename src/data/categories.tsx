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

export const categories = [
  {
    name: "investment",
    label: "Investment",
    icon: <FaHome />,
    color: "bg-red-100",
    hexColor: "#fee2e2",
  },
  {
    name: "utilities",
    label: "Utilities",
    icon: <FaLightbulb />,
    color: "bg-blue-100",
    hexColor: "#dbecf9",
  },
  {
    name: "groceries",
    label: "Groceries",
    icon: <FaShoppingCart />,
    color: "bg-green-100",
    hexColor: "#d1fae5",
  },
  {
    name: "rides",
    label: "Rides",
    icon: <FaTaxi />,
    color: "bg-yellow-100",
    hexColor: "#fef9c3",
  },
  {
    name: "food",
    label: "Food",
    icon: <MdRestaurant />,
    color: "bg-orange-100",
    hexColor: "#ffedd5",
  },
  {
    name: "fun",
    label: "Fun",
    icon: <GiPartyPopper />,
    color: "bg-red-100",
    hexColor: "#fee2e2",
  },
  {
    name: "luxury",
    label: "Luxury",
    icon: <IoSparkles />,
    color: "bg-purple-100",
    hexColor: "#f3e8ff",
  },
  {
    name: "salary",
    label: "Salary",
    icon: <FaSackDollar />,
    color: "bg-green-100",
    hexColor: "#d1fae5",
  },
  {
    name: "other",
    label: "Other",
    icon: <FaCoins />,
    color: "bg-indigo-50",
    hexColor: "#eef2ff",
  },
] as const;

export type CategoryType = (typeof categories)[number]["name"] | "";

export default categories;
