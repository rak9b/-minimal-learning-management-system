import ViewModule from "@/components/Module/ViewModule";
import React from "react";
interface CourseWatchPageProps {
  params: Promise<{ id: string }>;
}
const ViewModulePage = async ({ params }: CourseWatchPageProps) => {
  const { id } = await params;
  return (
    <div>
      <ViewModule id={id} />
    </div>
  );
};

export default ViewModulePage;
