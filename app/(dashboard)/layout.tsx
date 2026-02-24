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
      {/* Global Command Palette - Always listening */}
      <CommandPalette />
      
      <Sidebar />
      
      <main className="flex-1 lg:p-8 p-4"> 
        {/* Added responsive padding ^ */}
        <div className="max-w-[1400px] mx-auto"> 
          {/* Increased max-width for that "Elite" spacious feel */}
          {children}
        </div>
      </main>
      <MobileNav/>
    </section>
  );
}