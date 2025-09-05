"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Upload, Plus, Trash2, FileText, Video } from "lucide-react";
import LectureFrom from "@/components/Lecture/LectureFrom";
import AddModuleFrom from "@/components/Module/AddModuleFrom";
import axios from "axios";
import { URL } from "@/constants/url";
import Swal from "sweetalert2";
import { useGetLectureByIdQuery } from "@/redux/api/lectureApi";
import Loading from "@/helpers/Loading";

interface LectureData {
  title: string;
  videoUrl: string;
  pdfNotes: FileList | null;
}

interface ModuleFormData {
  moduleTitle: string;
  lectures: LectureData[];
}
const EditLectureForm = ({ id }: { id: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useGetLectureByIdQuery(id);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ModuleFormData>({
    defaultValues: {
      lectures: [
        { title: data?.title, videoUrl: data?.videoURL, pdfNotes: null },
      ],
    },
  });

  console.log("Lecture Data:", data);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectures",
  });
  if (isLoading) return <Loading />;
  const onSubmit = async (data: ModuleFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      data.lectures.forEach((lecture, index) => {
        const lecturePayload = {
          title: lecture.title,
          videoURl: lecture.videoUrl,
          courseId: id,
        };

        formData.append("lecture", JSON.stringify(lecturePayload));
        if (lecture.pdfNotes) {
          Array.from(lecture.pdfNotes).forEach((file) => {
            formData.append(`files`, file);
          });
        }
      });

      const result = await axios.put(`${URL}lecture/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.data.success) {
        Swal.fire({
          title: "Success",
          text: "Lecture Update successfully!",
          icon: "success",
        });
        reset();
      }
    } catch (error) {
      console.error("[v0] Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLecture = () => {
    append({ title: "", videoUrl: "", pdfNotes: null });
  };

  const removeLecture = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Upload Module
        </h1>
        <p className="text-muted-foreground">
          Create a new module with lectures and resources
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <LectureFrom
          fields={fields}
          addLecture={addLecture}
          register={register}
          removeLecture={removeLecture}
          errors={errors}
          isAddLectureDisabled={false}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                updating...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Update Lecture
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLectureForm;
