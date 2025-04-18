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
    hexColor: "#e5b7b7",
  },
  {
    name: "utilities",
    label: "Utilities",
    icon: <FaLightbulb />,
    color: "bg-blue-100",
    hexColor: "#b3d4e5",
  },
  {
    name: "groceries",
    label: "Groceries",
    icon: <FaShoppingCart />,
    color: "bg-green-100",
    hexColor: "#a3e6d1",
  },
  {
    name: "rides",
    label: "Rides",
    icon: <FaTaxi />,
    color: "bg-yellow-100",
    hexColor: "#f2e091",
  },
  {
    name: "food",
    label: "Food",
    icon: <MdRestaurant />,
    color: "bg-orange-100",
    hexColor: "#f9c185",
  },
  {
    name: "fun",
    label: "Fun",
    icon: <GiPartyPopper />,
    color: "bg-red-100",
    hexColor: "#e5b7b7",
  },
  {
    name: "luxury",
    label: "Luxury",
    icon: <IoSparkles />,
    color: "bg-purple-100",
    hexColor: "#edccee",
  },
  {
    name: "salary",
    label: "Salary",
    icon: <FaSackDollar />,
    color: "bg-green-100",
    hexColor: "#a3e6d1",
  },
  {
    name: "other",
    label: "Other",
    icon: <FaCoins />,
    color: "bg-indigo-50",
    hexColor: "#d0d8f0",
  },
] as const;

export type CategoryType = (typeof categories)[number]["name"] | "";

export default categories;
