"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          barRef.current,
          { width: "0%" },
          { width: "100%", duration: 1.5, ease: "power2.inOut" },
          "-=0.5"
        )
        .to(containerRef.current, {
          y: "-100%",
          duration: 0.8,
          ease: "expo.inOut",
          delay: 0.2,
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0502] text-white"
    >
      <div className="relative overflow-hidden px-8 py-4">
        <div ref={textRef} className="flex flex-col items-center">
          <span className="text-secondary mb-2 text-sm font-medium tracking-[0.3em] uppercase">
            Experience India
          </span>
          <h1 className="font-serif text-4xl font-light tracking-wider md:text-6xl">
            Kishori <span className="text-orange-500">Travel</span>
          </h1>
        </div>
        <div className="mt-8 h-[2px] w-full max-w-[300px] bg-white/10">
          <div ref={barRef} className="h-full bg-orange-500" />
        </div>
      </div>
    </div>
  );
}
