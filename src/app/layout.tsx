import React from "react";
import "../styles/globals.css";
import DashboardSidebar from "@/components/DashboardSidebar";
import { cookies } from "next/headers";
import { NotificationProvider } from "@/components/NotificationProvider";

export const metadata = {
  title: "Zaptask",
  description: "description",
    icons: {
    icon: "/z-logo.png", 
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  // Si pas de token, pas de sidebar
  const isLoggedIn = Boolean(token);

  return (
    <html lang="fr">
  
      <body className="flex bg-white text-[#1a1a1a]">
        {isLoggedIn && <DashboardSidebar />}
        <main className={isLoggedIn ? "ml-64 w-full" : "w-full"}>
          <div className="p-4">

              <NotificationProvider>
                  {children}
            </NotificationProvider>
            
            </div>
        </main>
      </body>
    </html>
  );
}
