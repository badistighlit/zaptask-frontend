// app/components/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { Home, Workflow, Settings, List, Server, FileText } from "lucide-react"; // Icônes
import clsx from "clsx";

const navItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Build workflow", href: "/workflow", icon: Workflow },
  { name: "Mes workflows", href: "/myworkflows", icon: List },
  { name: "Mes services", href: "/services", icon: Server },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export default function DashboardSidebar() {
  return (
<aside className="w-64 h-screen bg-white border-r border-gray-200 p-5 fixed top-0 left-0 z-40 shadow-sm">
  <div className="text-2xl font-semibold text-blue-700 mb-8 tracking-tight">Zaptask</div>
  <nav className="flex flex-col gap-1">
    {navItems.map(({ name, href, icon: Icon }) => (
      <Link
        key={href}
        href={href}
        className={clsx(
          "flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        )}
      >
        <Icon size={18} className="text-blue-500" />
        <span className="text-sm font-medium">{name}</span>
      </Link>
    ))}
  </nav>
</aside>

  );
}
