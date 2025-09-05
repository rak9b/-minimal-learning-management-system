/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type React from "react";

import { Upload, X, FileText, DollarSign, Type, FileUp } from "lucide-react";
import axios from "axios";
import { URL } from "@/constants/url";
import Swal from "sweetalert2";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/redux/api/courseApi";
import Loading from "@/helpers/Loading";
interface CourseFormData {
  title: string;
  price: number;
  description: string;
}

const UpdateCourse = ({ id }: { id: string }) => {
  const { data: courseData, isLoading } = useGetCourseByIdQuery(id);
  const [updateCourse] = useUpdateCourseMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CourseFormData>({
    defaultValues: {
      title: courseData?.title,
      price: courseData?.price,
      description: courseData?.description,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);
  if (isLoading) return <Loading />;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  console.log("Course Data:", courseData);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  //   const [updateCourse] = useUpdateCourseMutation(id);

  const onSubmit = async (data: CourseFormData) => {
    try {
      const submitData = new FormData();
      const submitPayload = {
        title: data.title,
        price: parseInt(data?.price as any),
        description: data.description,
      };
      submitData.append("data", JSON.stringify(submitPayload));
      if (selectedFile) {
        submitData.append("file", selectedFile);
      }

      const result = await axios.put(`${URL}course/${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // const result = await updateCourse({ id, ...submitPayload }).unwrap();

      if (result.data.success) {
        console.log("Course Update successfully:", result);
        Swal.fire({
          title: "Success",
          text: "Course Update successfully!",
          icon: "success",
        });
        reset();
        setSelectedFile(null);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to create course. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Update Course
        </h1>
        <p className="text-muted-foreground">
          Create a new course by filling out the form below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Type className="h-4 w-4" />
              Course Title
            </label>
            <input
              type="text"
              id="title"
              defaultValue={courseData?.title || ""}
              {...register("title", {
                required: "Course title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Title must be less than 100 characters",
                },
              })}
              className={`w-full px-3 py-2 border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.title
                  ? "border-destructive bg-destructive/5"
                  : "border-input bg-background"
              }`}
              placeholder="Enter course title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Course Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <DollarSign className="h-4 w-4" />
              Price
            </label>
            <input
              type="number"
              defaultValue={courseData?.price || 0}
              id="price"
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be 0 or greater",
                },
                max: {
                  value: 10000,
                  message: "Price must be less than $10,000",
                },
              })}
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.price
                  ? "border-destructive bg-destructive/5"
                  : "border-input bg-background"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <FileText className="h-4 w-4" />
              Description
            </label>
            <textarea
              id="description"
              defaultValue={courseData?.description || ""}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long",
                },
                maxLength: {
                  value: 1000,
                  message: "Description must be less than 1000 characters",
                },
              })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical ${
                errors.description
                  ? "border-destructive bg-destructive/5"
                  : "border-input bg-background"
              }`}
              placeholder="Enter course description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileUp className="h-4 w-4" />
              Course Materials
            </label>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                //     accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4,.mov,.avi"
              />

              {!selectedFile ? (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      Drop your files here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports: PDF, DOC, DOCX, PPT, PPTX, ZIP, MP4, MOV, AVI
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 p-4 bg-background rounded-md border border-border">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">
                        {selectedFile.name}
                      </p>
                      {/* <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p> */}
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;
