import CourseDetails from "@/components/course/CourseDetails";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>;
}

const CourseDetailsPage = async ({ params }: CourseDetailsPageProps) => {
  const { id } = await params;

  return (
    <div>
      <Navbar />
      <CourseDetails id={id} />
    </div>
  );
};

export default CourseDetailsPage;
