"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Package, Image as ImageIcon, MessageSquare, LogOut, Plus, LayoutDashboard, Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/login");
  };

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "packages", name: "Tour Packages", icon: Package, href: "/admin/packages" },
    { id: "gallery", name: "Media Gallery", icon: ImageIcon, href: "/admin/gallery" },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
  ];

  const activeTabName = tabs.find((t) => pathname.includes(t.href))?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6 border-b border-slate-100 flex items-center justify-center">
          <span className="text-2xl font-serif font-bold text-orange-600">Kishori Admin</span>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const isActive = pathname.includes(tab.href);
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
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Admin Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-serif text-slate-900">
                {activeTabName} Management
              </h2>
              <p className="text-slate-500 text-sm">Manage items showing on your public website.</p>
            </div>
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden min-h-[500px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
