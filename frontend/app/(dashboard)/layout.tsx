"use client";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette"; // Import the palette
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<section className="flex bg-slate-50 min-h-screen">
      <CommandPalette />
      
      {/* 1. Added relative and z-[60] here to ensure the sidebar 
          is physically on a higher layer than the main content */}
      <div className="relative shrink-0">
        <Sidebar />
      </div>
      
      {/* 2. Added z-0 to the main area to keep it below the sidebar's popouts */}
      <main className="flex-1 lg:p-8 p-4 relative z-0"> 
        <div className="max-w-350 mx-auto"> 
          {children}
        </div>
      </main>
      
      <MobileNav/>
    </section>
  );
}