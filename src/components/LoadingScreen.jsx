"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const containerRef = useRef(null);
  const taglineRef = useRef(null);
  const logoRef = useRef(null);
  const underlineRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // fadeInUp animations for tagline, logo, and underline
      // These match the reference's fadeInUp 0.6s/0.7s with 0.1s/0.2s delays
      tl.fromTo(
        [taglineRef.current, logoRef.current, underlineRef.current],
        { opacity: 0, y: 12 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          stagger: 0.1,
          ease: "power2.out" 
        }
      );

      // preload animation (the bar fill)
      // Matches the reference's preload 1.8s ease-out 0.3s forwards
      tl.fromTo(
        fillRef.current,
        { width: "0%" },
        { width: "100%", duration: 1.8, ease: "power1.inOut" },
        "-=0.4"
      );

      // fade out the whole screen
      // Matches the reference's fadeOut 0.4s ease forwards
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1a1208]"
    >
      <div className="flex flex-col items-start gap-[0.3rem]">
        <p 
          ref={taglineRef} 
          className="font-['DM_Sans'] text-[0.95rem] text-white/55 font-light tracking-[0.03em] mb-[0.1rem]"
        >
          Welcome to
        </p>
        <div 
          ref={logoRef} 
          className="font-['Cormorant_Garamond'] text-5xl font-medium text-[#d4a017] tracking-[0.04em] leading-[1.1]"
        >
          Kishori <span className="text-[#d4a017]">Travels</span>
        </div>
        <div 
          ref={underlineRef} 
          className="w-full h-[2px] bg-white/10 rounded-[2px] overflow-hidden mt-[0.5rem]"
        >
          <div 
            ref={fillRef} 
            className="h-full bg-[#e8611a] rounded-[2px] w-0" 
          />
        </div>
      </div>
    </div>
  );
}

