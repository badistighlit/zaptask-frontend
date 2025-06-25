import React from "react";
import "../styles/globals.css";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = {
  title: "Zaptask",
  description: "description",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex bg-white text-[#1a1a1a]">
        <DashboardSidebar />
        <main className="ml-64 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
