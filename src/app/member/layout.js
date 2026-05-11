"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut, LayoutDashboard, Bell, User, Menu, X, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MemberLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || (data.user.role !== 'member' && data.user.role !== 'manager' && data.user.role !== 'admin')) {
          router.push("/login");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth"); // Cleanup old if exists
    // We should ideally call a logout API to clear the cookie
    router.push("/login");
  };

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/member/dashboard" },
    { id: "leads", name: "Leads", icon: Target, href: "/member/leads" },
  ];


  const activeTab = tabs.find((t) => pathname.startsWith(t.href));
  const activeTabName = activeTab?.name || "Dashboard";

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <span className="text-2xl font-serif font-bold text-orange-600">Kishori Staff</span>
        <button
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-orange-50 text-orange-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className="h-5 w-5 shrink-0" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-bold text-slate-800 lg:hidden">{activeTabName}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-700">{user?.name || "Staff"}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
