import EditLectureForm from "@/components/Lecture/EditLecture";
import Loading from "@/helpers/Loading";
import React from "react";
interface EditLecturePageProps {
  params: Promise<{ id: string }>;
}
const EditLecturePage = async ({ params }: EditLecturePageProps) => {
  const { id } = await params;
  if (!id) return <Loading />;
  return (
    <div>
      <EditLectureForm id={id} />
    </div>
  );
};

export default EditLecturePage;
