import { ChevronDown } from "lucide-react";
import React from "react";

interface DashboardTextSelectorProps {
  limit?: number;
  pageSize: number;
  setPageSize: (size: number) => void;
}
const DashboardTextSelector = ({
  limit,
  pageSize,
  setPageSize,
}: DashboardTextSelectorProps) => {
  return (
    <div className="relative">
      <select
        value={limit || pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value={5}>Show 5</option>
        <option value={10}>Show 10</option>
        <option value={20}>Show 20</option>
        <option value={50}>Show 50</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
};

export default DashboardTextSelector;
