"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Home,
  Workflow,
  List,
  Server,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  ChartPie,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { deleteUserInfo } from "@/utils/authentication";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Build workflow", href: "/workflows", icon: Workflow },
  { name: "My workflows", href: "/myWorkflows", icon: List },
  { name: "Logs", href: "/workflowLogs", icon: FileText },
  { name: "Statistics", href: "/stats", icon: ChartPie },
  { name: "My services", href: "/services", icon: Server },

];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    deleteUserInfo();
    window.location.href = "/";
  }

  return (
    <aside
      className={clsx(
        "h-screen fixed top-0 left-0 z-40 flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        "bg-slate-200 border-r border-gray-300 shadow-lg"
      )}
    >
      {/* Top: Logo + Nav */}
      <div className="p-5">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src={collapsed ? "/z-logo.png" : "/logo-transparent.png"}
            alt="Logo"
            width={collapsed ? 32 : 120}
            height={40}
            className="transition-all duration-200"
            unoptimized
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg text-slate-800 hover:bg-slate-300 hover:text-indigo-700 hover:scale-[1.01] transform transition-all",
                collapsed && "justify-center"
              )}
            >
              <Icon size={20} className="text-indigo-600" />
              {!collapsed && <span className="text-sm font-medium">{name}</span>}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={clsx(
              "mt-4 flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-600 hover:scale-[1.01] transition-all w-full",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </nav>
      </div>

      {/* Bottom: Collapse Button */}
      <div className="p-4 border-t border-gray-300">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 hover:bg-slate-300 rounded-md text-indigo-700 transition"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          {!collapsed && <span className="ml-2 text-sm font-medium">Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
