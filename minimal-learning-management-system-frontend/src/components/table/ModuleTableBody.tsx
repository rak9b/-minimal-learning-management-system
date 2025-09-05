/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteModuleMutation } from "@/redux/api/moduleApi";
import { Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DeleteModal from "../ui/DeleteModal";

interface ModuleTableBodyProps {
  moduleData: any[]; // Replace 'any' with the actual type of your module data
}
const ModuleTableBody = ({ moduleData }: ModuleTableBodyProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [id, setId] = useState<string>("");
  const [deleteModule, {}] = useDeleteModuleMutation();

  const handleDeleteConfirm = async () => {
    const response = await deleteModule(id);
    if (response?.data) {
      Swal.fire({
        title: "Success",
        text: "Module delete successfully!",
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
      {moduleData?.map((module) => (
        <tr
          key={module?._id}
          className="border-b border-border hover:bg-muted/30"
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground">
                {module.title}
              </span>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground">
                {module?.courseId?.title}
              </span>
            </div>
          </td>

          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/all-module/edit/${module._id}`}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg pointer"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDeleteClick(module?._id)}
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
          title="Delete Module"
          description="This will permanently remove the module and all its associated data. This action cannot be undone."
          isLoading={isDeleting}
        />
      )}
    </tbody>
  );
};

export default ModuleTableBody;
