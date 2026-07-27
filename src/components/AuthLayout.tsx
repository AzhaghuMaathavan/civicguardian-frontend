"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  LifeBuoy, 
  HeartHandshake, 
  Map, 
  AlertTriangle, 
  FileText, 
  Settings,
  LogOut,
  Moon,
  Sun,
  Languages,
  Megaphone
} from "lucide-react";
import { useLanguage, Language } from "@/contexts/ThemeLanguageContext";
import { useTheme } from "next-themes";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, username, roles } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, router, pathname, mounted]);

  if (!mounted) return null;
  if (!isAuthenticated && pathname !== "/login") return null;
  if (pathname === "/login") return <>{children}</>;

  const navItems = [
    { name: t("nav.dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("nav.analytics"), href: "/analytics", icon: Users },
    { name: t("nav.shelter"), href: "/shelters", icon: Home },
    { name: t("nav.rescue"), href: "/rescue", icon: LifeBuoy },
    { name: t("nav.volunteer"), href: "/volunteers", icon: HeartHandshake },
    { name: t("nav.disaster"), href: "/map", icon: Map },
    { name: t("nav.highrisk"), href: "/high-risk", icon: AlertTriangle },
    { name: t("nav.reports"), href: "/reports", icon: FileText },
    { name: t("nav.settings"), href: "/settings", icon: Settings },
  ];

  if (roles?.includes("ROLE_GOVERNMENT") || roles?.includes("ROLE_ADMIN")) {
    navItems.splice(7, 0, { name: "Broadcast Alert", href: "/broadcast", icon: Megaphone });
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl" aria-label="Sidebar Navigation">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-400">CivicGuardian</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider" aria-hidden="true">Command Center</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold">{username}</p>
            <p className="text-xs text-slate-400 truncate">{roles?.join(", ")}</p>
          </div>
          <button
            onClick={() => dispatch(logout())}
            aria-label="Sign Out"
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {navItems.find(i => i.href === pathname)?.name || t("nav.dashboard")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Languages size={20} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
                <option value="nan-TW">台灣閩南語 (Taiwanese Hokkien)</option>
                <option value="hak-TW">客家語 (Hakka)</option>
                <option value="ami">阿美語 (Amis)</option>
              </select>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" aria-hidden="true" /> : <Moon size={20} className="text-slate-600" aria-hidden="true" />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
