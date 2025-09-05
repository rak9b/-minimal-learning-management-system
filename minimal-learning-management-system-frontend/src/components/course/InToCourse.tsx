/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Courses from "@/components/course/Courses";
import SearchBar from "@/components/ui/Searchbar";
import Loading from "@/helpers/Loading";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { ICourse } from "@/types/course";
import { Pagination } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function InToCourse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const query: Record<string, any> = {};
  if (searchQuery) {
    query["searchTerm"] = searchQuery;
  }
  query["page"] = currentPage;
  query["limit"] = coursesPerPage;
  const { data, isLoading } = useGetCoursesQuery(query);

  if (isLoading) return <Loading />;

  const totalPage = data?.meta?.totalPages || 1;
  const coursesData = data?.data || [];
  console.log(coursesData);
  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handlePageChange = (event: any, page: any) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Featured Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our most popular courses taught by industry experts. Start
            learning today and advance your career.
          </p>

          <SearchBar
            value={searchQuery || ""}
            onChange={handleSearchChange}
            placeholder="Search courses, instructors, or categories..."
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coursesData?.map((course: ICourse) => (
            <Courses key={course._id} {...course} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Pagination
            count={totalPage}
            onChange={handlePageChange}
            page={data?.meta?.page || 1}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </main>
    </div>
  );
}
