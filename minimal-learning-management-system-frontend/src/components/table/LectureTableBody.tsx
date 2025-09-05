/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteCourseMutation } from "@/redux/api/courseApi";
import { Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DeleteModal from "../ui/DeleteModal";
import { useDeleteLectureMutation } from "@/redux/api/lectureApi";

interface LectureTableBodyProps {
  lectureData: any[]; // Replace 'any' with the actual type of your lecture data
}
const LectureTableBody = ({ lectureData }: LectureTableBodyProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [id, setId] = useState<string>("");
  const [deleteLecture, {}] = useDeleteLectureMutation();

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
    <tbody>
      {lectureData?.map((lecture) => (
        <tr
          key={lecture?._id}
          className="border-b border-border hover:bg-muted/30"
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground">
                {lecture.title}
              </span>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground">
                {lecture?.courseId?.title}
              </span>
            </div>
          </td>

          <td className="py-4 px-6">
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
          title="Delete Lecture"
          description="This will permanently remove the lecture and all its associated data. This action cannot be undone."
          isLoading={isDeleting}
        />
      )}
    </tbody>
  );
};

export default LectureTableBody;
