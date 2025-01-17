import React, { useState } from "react";
import { categories, CategoryType } from "@/data/categoriesv2";

interface FilterProps {
  onFilterChange: (category: string | null) => void;
}

const TransactionFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    ""
  );

  const categoryNames = [
    { name: "All", value: "" }, // Add "All" option
    ...categories.map((category) => ({
      name: category.label,
      value: category.name,
    })),
  ];

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value as CategoryType;
    setSelectedCategory(category);
    onFilterChange(category === "" ? null : category); // Handle "All" selection
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4 ">
        <select
          value={selectedCategory ?? ""}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-md p-2"
        >
          {categoryNames.map((categoryName) => (
            <option key={categoryName.value} value={categoryName.value}>
              {categoryName.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TransactionFilter;
