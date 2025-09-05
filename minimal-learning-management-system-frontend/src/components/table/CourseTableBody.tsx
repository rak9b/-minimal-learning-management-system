"use client";
import { ICourse } from "@/types/course";
import { Edit, Eye, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import DeleteModal from "../ui/DeleteModal";
import { useDeleteCourseMutation } from "@/redux/api/courseApi";
import Swal from "sweetalert2";
interface CourseTableBodyProps {
  coursesData: ICourse[];
}
const CourseTableBody = ({ coursesData }: CourseTableBodyProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [id, setId] = useState<string>("");
  const [deleteCourse, {}] = useDeleteCourseMutation();

  const handleDeleteConfirm = async () => {
    const response = await deleteCourse(id);
    if (response?.data) {
      Swal.fire({
        title: "Success",
        text: "Course delete successfully!",
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
    <tbody>
      {coursesData?.map((course: ICourse) => (
        <tr
          key={course?._id}
          className="border-b border-border hover:bg-muted/30"
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-4">
              <Image
                height={48}
                width={48}
                src={course.file.url || "/placeholder.svg"}
                alt={course.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-card-foreground">
                  {course.title}
                </h3>
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground">
                ${course.price}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                50
              </span>
            </div>
          </td>
          <td className="py-4 px-6">
            <Link
              href={`/dashboard/add-module/${course?._id}`}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
            >
              Add Module
            </Link>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/view-module/${course._id}`}>
                <Eye className="h-4 w-4" />
              </Link>
              <Link
                href={`/dashboard/all-course/update-course/${course._id}`}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg pointer"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDeleteClick(course._id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}

      {isDeleting && (
        <DeleteModal
          isOpen={isDeleting}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Course"
          description="This will permanently remove the course and all its associated data. This action cannot be undone."
          isLoading={isDeleting}
        />
      )}
    </tbody>
  );
};

export default CourseTableBody;
