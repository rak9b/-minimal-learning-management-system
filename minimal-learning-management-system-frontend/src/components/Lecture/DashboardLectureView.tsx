"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/helpers/Loading";
import {
  useDeleteLectureMutation,
  useGetAllLectureQuery,
} from "@/redux/api/lectureApi";
import React, { useState } from "react";
import DashboardSearchBar from "../textInput/DashboardSearchBar";
import DashboardTextSelector from "../textInput/DashboardTextSelector";
import Link from "next/link";
import TableHead from "../table/TableHead";
import LectureTableBody from "../table/LectureTableBody";
import { Edit, Trash2 } from "lucide-react";
import { Pagination } from "@mui/material";
import { useGetAllModuleQuery } from "@/redux/api/moduleApi";
import DashboardSelector from "../textInput/DashboardSelector";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import Swal from "sweetalert2";
import DeleteModal from "../ui/DeleteModal";

const DashboardLectureView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [id, setId] = useState<string>("");
  const [deleteLecture, {}] = useDeleteLectureMutation();

  const query: Record<string, any> = {};
  if (searchQuery) {
    query["searchTerm"] = searchQuery;
  }
  if (selectedModule) {
    query["moduleId"] = selectedModule;
  }
  if (selectedCourse) {
    query["courseId"] = selectedCourse;
  }
  query["page"] = currentPage;
  query["limit"] = pageSize;
  const { data, isLoading } = useGetAllLectureQuery(query);
  const { data: moduleData } = useGetAllModuleQuery({});
  const { data: courseData } = useGetCoursesQuery({});
  const courseDataMap = courseData?.data.map(
    (course: { _id: string; title: string }) => {
      return {
        value: course._id,
        label: course.title,
      };
    }
  );
  console.log("courseDataMap", courseDataMap);

  if (isLoading) return <Loading />;

  const totalPage = data?.meta?.totalPages || 1;
  const lectureData = data || [];
  const moduleDataMap = moduleData?.data?.map(
    (module: { _id: string; title: string }) => {
      return {
        value: module._id,
        label: module.title,
      };
    }
  );
  console.log("moduleDataMap", moduleDataMap);
  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handlePageChange = (event: any, page: any) => {
    setCurrentPage(page);
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteLecture(id);
    if (response?.data) {
      Swal.fire({
        title: "Success",
        text: "Lecture delete successfully!",
        icon: "success",
      });
      setIsDeleting(false);
      setId(id);
    }
  };

  const handleDeleteClick = (id: string) => {
    setIsDeleting(true);
    setId(id);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setId(id);
  };
  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header with Search and Limit */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            Lecture Management
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}

            <DashboardSearchBar
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              placeholder="Search by lecture title"
            />

            {/* <DashboardTextSelector
              pageSize={pageSize}
              setPageSize={setPageSize}
              limit={data?.meta?.limit}
            /> */}
            <DashboardSelector
              data={moduleDataMap}
              setSelect={(value: string | number) => {
                setSelectedModule(value as string);
              }}
              optionLevel="Select Module"
            />
            <DashboardSelector
              data={courseDataMap}
              setSelect={(value: string | number) => {
                setSelectedCourse(value as string);
              }}
              optionLevel="Select Course"
            />
            <Link
              href="/dashboard/add-module"
              className="bg-primary/90 px-4  rounded-md text-white py-2"
            >
              Add Module & Lecture
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <TableHead
            tableHeadings={["Module Title", "Course Title", "Action"]}
          />

          <LectureTableBody lectureData={lectureData} />
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-border">
          {lectureData.map((lecture: any) => (
            <div key={lecture._id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-card-foreground mb-1">
                    {lecture.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-card-foreground">
                      {lecture.courseId?.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/all-lecture/edit/${lecture._id}`}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(lecture._id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isDeleting && (
        <DeleteModal
          isOpen={isDeleting}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Lecture"
          description="This will permanently remove the lecture and all its associated data. This action cannot be undone."
          isLoading={isDeleting}
        />
      )}
      {/* // Pagination */}
      <div className="flex justify-center py-8">
        <Pagination
          count={totalPage}
          onChange={handlePageChange}
          page={data?.meta?.page || 1}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default DashboardLectureView;
