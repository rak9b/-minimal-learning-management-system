import EditModule from "@/components/Module/EditModule";
import React from "react";
interface EditModulePageProps {
  params: Promise<{ id: string }>;
}
const EditModulePage = async ({ params }: EditModulePageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditModule id={id} />
    </div>
  );
};

export default EditModulePage;
