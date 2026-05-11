"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  return (
    <>
      <nav className={`home-nav ${scrolled ? "scrolled" : ""}`} id="navbar">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpg" alt="Logo" />
          <div>
            KISHORI <b>TRAVELS</b>
        
          </div>
        </Link>

        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#packages">Tour Packages</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact" className="nav-cta">Book Now</a></li>
        </ul>

        <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`} onClick={toggleMenu} id="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} id="mobileMenu">
        <a href="#hero" onClick={toggleMenu}>Home</a>
        <a href="#packages" onClick={toggleMenu}>Tour Packages</a>
        <a href="#gallery" onClick={toggleMenu}>Gallery</a>
        <a href="#faq" onClick={toggleMenu}>FAQ</a>
        <a href="#contact" className="nav-cta" onClick={toggleMenu}>Book Now</a>
      </div>
    </>
  );
}
