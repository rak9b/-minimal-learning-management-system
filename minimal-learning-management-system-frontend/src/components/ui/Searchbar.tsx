import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search courses...",
}: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto">
      <div className="absolute  left-0 top-2.5 pl-3 flex items-center ">
        <Search className="h-5 w-5 text-black " />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full border  rounded-lg  bg-white"
      />
    </div>
  );
};
export default SearchBar;
