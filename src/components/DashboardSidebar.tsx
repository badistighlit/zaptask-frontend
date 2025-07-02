"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Home,
  Workflow,
  Settings,
  List,
  Server,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { deleteUserInfo } from "@/utils/authentication";

const navItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Build workflow", href: "/workflow", icon: Workflow },
  { name: "Mes workflows", href: "/myWorkflows", icon: List },
  { name: "Mes services", href: "/services", icon: Server },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Paramètres", href: "/settings", icon: Settings },
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
        "h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed top-0 left-0 z-40 shadow-sm transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top: Logo + Nav */}
      <div className="p-5">
        {/* Logo */}
        <div className="flex justify-center mb-10">
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
                "flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors",
                collapsed && "justify-center"
              )}
            >
              <Icon size={20} className="text-blue-500" />
              {!collapsed && <span className="text-sm font-medium">{name}</span>}
            </Link>
          ))}

          {/* Bouton Déconnexion */}
          <button
            onClick={handleLogout}
            className={clsx(
              "mt-4 flex items-center gap-3 p-2 rounded-md text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors w-full",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </nav>
      </div>

      {/* Bottom: Toggle Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 hover:bg-blue-100 rounded-md text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          {!collapsed && <span className="ml-2 text-sm">Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
