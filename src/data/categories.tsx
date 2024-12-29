// src/data/categories.js
import {
  FaShoppingCart,
  FaHome,
  FaLightbulb,
  FaTaxi,
  FaCoins,
} from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import { MdRestaurant } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";

const categories = {
  groceries: {
    name: "Groceries",
    icon: <FaShoppingCart />,
    color: "bg-green-100",
  },
  utilities: {
    name: "Utilities",
    icon: <FaLightbulb />,
    color: "bg-blue-100",
  },
  food: {
    name: "Food",
    icon: <MdRestaurant />,
    color: "bg-orange-100",
  },
  fun: {
    name: "Fun",
    icon: <GiPartyPopper />,
    color: "bg-red-100",
  },
  luxury: {
    name: "Luxury",
    icon: <IoSparkles />,
    color: "bg-purple-100",
  },
  investment: {
    name: "Investment",
    icon: <FaHome />,
    color: "bg-red-100",
  },
  transportation: {
    name: "Transportation",
    icon: <FaTaxi />,
    color: "bg-yellow-100",
  },
  other: {
    name: "Other",
    icon: <FaCoins />,
    color: "bg-indigo-50",
  },
  salary: {
    name: "Salary",
    icon: <FaSackDollar />,
    color: "bg-green-100",
  },
};

export default categories;
