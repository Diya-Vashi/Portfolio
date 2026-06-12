import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-background text-foreground flex font-sans">
        <AdminSidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
