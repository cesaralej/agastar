import React, { useEffect, useState } from "react";
import { categories, CategoryType } from "@/data/categories";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterProps {
  onFilterChange: (category: string | null) => void;
}

const TransactionFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | string
  >("All");

  const categoryNames = [
    { name: "All", value: "All" }, // Add "All" option
    ...categories.map((category) => ({
      name: category.label,
      value: category.name,
    })),
  ];

  useEffect(() => {
    onFilterChange(selectedCategory === "All" ? null : selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4 ">
        <Select
          defaultValue={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className=" bg-white">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoryNames.map((categoryName) => (
                <SelectItem key={categoryName.value} value={categoryName.value}>
                  {categoryName.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TransactionFilter;
