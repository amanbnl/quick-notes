import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"; // Professional font

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProNotes | Your Second Brain",
  description: "Enterprise grade note taking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar will go here in Phase 2 */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}