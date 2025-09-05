import AddLectureFrom from "@/components/Lecture/AddLecture";
import React from "react";
interface AddLecturePageProps {
  params: Promise<{ id: string }>;
}
const AddLecturePage = async ({ params }: AddLecturePageProps) => {
  const { id } = await params;
  return (
    <div>
      <AddLectureFrom id={id} />
    </div>
  );
};

export default AddLecturePage;
