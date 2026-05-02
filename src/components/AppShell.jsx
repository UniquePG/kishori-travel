"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const isExcludedRoute = pathname.startsWith("/admin") || pathname.startsWith("/login");

  return (
    <div className="min-h-screen bg-[#fdfaf6] selection:bg-orange-200">
      {!isExcludedRoute && <Navbar />}
      <main>{children}</main>
      {!isExcludedRoute && <Footer />}
    </div>
  );
}
