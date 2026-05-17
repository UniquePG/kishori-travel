"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  CalendarCheck,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Target,
  User,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || data?.user?.role !== "admin") {
          router.push("/login");
          toast.error("Please sign in as admin");
        }
      } catch (error) {
        router.push("/login");
        toast.error("Session check failed");
      }
    };
    checkAuth();
  }, [router]);

  // Close sidebar on route change (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    localStorage.removeItem("admin_auth");
    toast.success("Signed out");
    router.push("/login");
  };

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "packages", name: "Tour Packages", icon: Package, href: "/admin/packages" },
    { id: "bookings", name: "Bookings", icon: CalendarCheck, href: "/admin/bookings" },
    { id: "leads", name: "Lead Management", icon: Target, href: "/admin/leads" },
    { id: "members", name: "Staff/Members", icon: Users, href: "/admin/members" },
    { id: "faqs", name: "FAQs", icon: HelpCircle, href: "/admin/faqs" },
    { id: "gallery", name: "Media Gallery", icon: ImageIcon, href: "/admin/gallery" },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
  ];

  const activeTab = tabs.find((t) => pathname.startsWith(t.href));
  const activeTabName = activeTab?.name || "Dashboard";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <span className="text-2xl font-serif font-bold text-orange-600">Kishori Admin</span>
        {/* Close button – only shown inside mobile drawer */}
        <button
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Links */}
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

      {/* Sign Out */}
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

      {/* ── Desktop Sidebar (lg+) ── */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0 relative">

        {/* Top Navbar */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Hamburger – mobile only */}
            <button
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Active page name – shown on mobile instead of search */}
            <span className="text-base font-bold text-slate-800 lg:hidden">{activeTabName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <button className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-4 lg:p-4 flex-1">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-slate-900">
                {activeTabName} Management
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">Manage items showing on your public website.</p>
            </div>
          </header>

          <div className="w-full max-w-full overflow-hidden min-h-[500px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
