import React from "react";
interface TableHeadProps {
  tableHeadings: string[];
}
const TableHead = ({ tableHeadings }: TableHeadProps) => {
  return (
    <thead className="bg-white border-b border-border">
      {tableHeadings.map((heading, index) => (
        <th
          key={index}
          className="text-left py-3 px-6 font-medium text-muted-foreground"
        >
          {heading}
        </th>
      ))}
    </thead>
  );
};

export default TableHead;
