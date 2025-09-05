import UpdateCourse from "@/components/dashboard/course/UpdateCourse";
import React from "react";

interface UpdateCoursePageProps {
  params: Promise<{ id: string }>;
}

const UpdateCoursePage = async ({ params }: UpdateCoursePageProps) => {
  const { id } = await params;

  return (
    <div>
      <UpdateCourse id={id} />
    </div>
  );
};

export default UpdateCoursePage;
