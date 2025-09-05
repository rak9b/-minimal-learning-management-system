import { Search } from "lucide-react";
import React from "react";
interface DashboardSearchBarProps {
  searchQuery: string;
  handleSearchChange: (search: string) => void;
  placeholder?: string;
}
const DashboardSearchBar = ({
  searchQuery,
  handleSearchChange,
  placeholder = "Search courses...",
}: DashboardSearchBarProps) => {
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
        />
      </div>
    </div>
  );
};

export default DashboardSearchBar;
