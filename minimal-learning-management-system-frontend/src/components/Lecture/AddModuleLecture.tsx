"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Upload, Plus, Trash2, FileText, Video } from "lucide-react";
import LectureFrom from "@/components/Lecture/LectureFrom";
import AddModuleFrom from "@/components/Module/AddModuleFrom";
import axios from "axios";
import { URL } from "@/constants/url";
import Swal from "sweetalert2";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import DashboardSelector from "../textInput/DashboardSelector";

interface LectureData {
  title: string;
  videoUrl: string;
  pdfNotes: FileList | null;
}

interface ModuleFormData {
  moduleTitle: string;
  lectures: LectureData[];
}
const AddModuleAndLecture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedLecture, setDraggedLecture] = useState<number | null>(null);
  const [courseId, setSelectedCourse] = useState<string>("");
  const { data: courseData } = useGetCoursesQuery({});
  const courseDataMap = courseData?.data.map(
    (course: { _id: string; title: string }) => {
      return {
        value: course._id,
        label: course.title,
      };
    }
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ModuleFormData>({
    defaultValues: {
      moduleTitle: "",
      lectures: [{ title: "", videoUrl: "", pdfNotes: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectures",
  });

  const onSubmit = async (data: ModuleFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const modulePayload = {
        title: data.moduleTitle,
        courseId: courseId, // Assuming you want to associate this module with a course
      };
      formData.append("module", JSON.stringify(modulePayload));
      data.lectures.forEach((lecture, index) => {
        const lecturePayload = {
          title: lecture.title,
          videoURl: lecture.videoUrl,
          courseId: courseId,
        };

        formData.append("lectures", JSON.stringify(lecturePayload));
        if (lecture.pdfNotes) {
          Array.from(lecture.pdfNotes).forEach((file) => {
            formData.append(`files`, file);
          });
        }
      });

      // Here you would send formData to your backend
      console.log("[v0] Module data prepared for submission:", formData);
      const result = await axios.post(`${URL}module/insert`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.data.success) {
        Swal.fire({
          title: "Success",
          text: "Module and Lecture created successfully!",
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
          Upload Module & Lecture
        </h1>
        <p className="text-muted-foreground">
          Create a new module with lectures and resources
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Module Title Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Course Information
          </h2>

          <div>
            {/* <label
              htmlFor="moduleTitle"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Module Title *
            </label> */}
            <DashboardSelector
              bg="bg-white"
              data={courseDataMap}
              setSelect={(value: string | number) => {
                setSelectedCourse(value as string);
              }}
              optionLevel="Select Course"
            />
          </div>
        </div>

        <AddModuleFrom errors={errors} register={register} />

        <LectureFrom
          fields={fields}
          addLecture={addLecture}
          register={register}
          removeLecture={removeLecture}
          errors={errors}
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
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Module
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddModuleAndLecture;
