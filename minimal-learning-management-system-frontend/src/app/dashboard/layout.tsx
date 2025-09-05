import Sidebar from "@/components/sideBar/Sidebar";
import type React from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
