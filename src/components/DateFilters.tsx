import { useDate } from "@/context/DateContext";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(0, i); // Month is 0-indexed
  return {
    name: date.toLocaleString("default", { month: "long" }),
    value: i.toString(),
  };
});

const years = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - 2 + i).toString()
);

const DateFilters = () => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useDate();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4 ">
        <Select
          defaultValue={String(selectedYear)}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          defaultValue={String(selectedMonth)}
          onValueChange={setSelectedMonth}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Month</SelectLabel>
              {months.map((month) => (
                <SelectItem key={month.name} value={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DateFilters;
