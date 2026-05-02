"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plane, User } from "lucide-react";
import { cn } from "../lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Packages", href: "/#packages" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Testimonials", href: "/#reviews" },
    { name: "Contact", href: "/#contact" },
  ];

  const isHome = pathname === "/";

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled || !isHome
          ? "bg-white/80 py-3 backdrop-blur-md shadow-sm"
          : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          {/* <div className="bg-orange-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
             <Plane className="h-6 w-6 text-white" />
          </div> */}
          <Image src={"/logo.jpg"} alt="logo" width={30} height={30} priority />
          <span className={cn(
            "text-2xl font-serif tracking-tight",
            isScrolled || !isHome ? "text-slate-900" : "text-white"
          )}>
            Kishori <span className="text-orange-500">Travel</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-orange-500",
                isScrolled || !isHome ? "text-slate-600" : "text-white/90"
              )}
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/login"
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all",
              isScrolled || !isHome
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            )}
          >
            <User className="h-4 w-4" />
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            "md:hidden",
            isScrolled || !isHome ? "text-slate-900" : "text-white"
          )}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-t bg-white p-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-900 hover:text-orange-500"
              >
                {link.name}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-white font-semibold"
            >
              <User className="h-5 w-5" />
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
