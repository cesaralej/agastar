import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterProps {
  // Receive current filter values from parent
  selectedCategory: string | null;
  searchTerm: string;
  // Pass changes up to parent
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (term: string) => void;
}

interface CategoryInfo {
  name: string; // e.g., "All", "Groceries"
  value: string; // e.g., "All", "groceries" (the actual category key)
}

const TransactionFilter: React.FC<FilterProps> = ({
  selectedCategory,
  searchTerm,
  onCategoryChange,
  onSearchChange,
}) => {
  const categoryNames: CategoryInfo[] = [
    { name: "All Categories", value: "All" }, // Clearer label for "All"
    ...categories.map((category: { label?: string; name: string }) => ({
      // Make sure your categories data has 'label' (display name) and 'name' (value)
      name:
        category.label ||
        category.name.charAt(0).toUpperCase() + category.name.slice(1), // Use label or format name
      value: category.name, // The actual category identifier
    })),
  ];

  const handleCategorySelect = (value: string) => {
    onCategoryChange(value === "All" ? null : value);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(event.target.value);
  };

  return (
    // Use flex container to place elements side-by-side, allowing wrap on small screens
    <div className="flex flex-row  justify-between items-center gap-4 mb-6">
      {/* Category Filter */}
      <div className="w-[200px]">
        <Select
          value={selectedCategory ?? "All"} // Control component with value from props
          onValueChange={handleCategorySelect}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-white">
            {" "}
            {/* Adjust width as needed */}
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoryNames.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="w-full">
        {" "}
        {/* Allow search to take more space */}
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm} // Control component with value from props
          onChange={handleSearchInputChange}
          className="w-full bg-white"
        />
      </div>
    </div>
  );
};

export default TransactionFilter;
