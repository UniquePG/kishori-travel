"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Search, MapPin, Calendar, Clock, Wallet, ChevronDown } from "lucide-react";

function FilterDropdown({ label, icon: Icon, options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex flex-1 items-center gap-3 px-4 py-3 lg:py-2 transition-colors rounded-xl hover:bg-slate-50 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
      <div className="h-10 w-10 shrink-0 rounded-full bg-orange-50 flex items-center justify-center transition-colors group-hover:bg-orange-100">
        <Icon className="h-5 w-5 text-orange-500" />
      </div>
      <div className="flex flex-col text-left flex-1 min-w-0">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800 truncate">
            {value || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[9999]">
          {options.map((option) => (
            <button
              key={option}
              onClick={(e) => {
                e.stopPropagation();
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                value === option ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-600 font-medium"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const searchRef = useRef(null);

  const [filters, setFilters] = useState({
    destination: "All Destinations",
    tripType: "All Types",
    duration: "Any Duration",
    budget: "Any Budget"
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.5 }
      );
      gsap.fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 }
      );
      gsap.fromTo(
        searchRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)", delay: 1.1 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[97vh] w-full ">
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/himalayas/1920/1080?brightness=0.6"
          alt="Mountains"
          className="h-full w-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
      </div>

      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center lg:px-8">
        <p className="mb-4 text-xs font-semibold tracking-[0.4em] text-orange-400 uppercase">
          Curated Journeys - Unique Experiences
        </p>
        <h1
          ref={titleRef}
          className="max-w-4xl font-serif text-5xl leading-tight text-white md:text-7xl lg:text-8xl"
        >
          Explore <span className="italic text-orange-500">Incredible India</span> with Kishori Travel
        </h1>
        <p
          ref={subRef}
          className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed md:text-xl"
        >
          From Himalayan peaks to coastal shores - discover every shade of India through curated
          journeys crafted with heart.
        </p>

        <div
          ref={searchRef}
          className="mt-12 w-full max-w-5xl rounded-3xl bg-white/10 p-2 backdrop-blur-xl relative z-50"
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 bg-white p-3 rounded-[1.5rem] shadow-2xl">
            <FilterDropdown
              label="Destination"
              icon={MapPin}
              options={["All Destinations", "Rajasthan", "Kerala", "Himalayas"]}
              value={filters.destination}
              onChange={(val) => setFilters({ ...filters, destination: val })}
            />

            <div className="hidden lg:block w-px h-10 bg-slate-100" />

            <FilterDropdown
              label="Trip Type"
              icon={Calendar}
              options={["All Types", "Adventure", "Spiritual", "Luxury"]}
              value={filters.tripType}
              onChange={(val) => setFilters({ ...filters, tripType: val })}
            />

            <div className="hidden lg:block w-px h-10 bg-slate-100" />

            <FilterDropdown
              label="Duration"
              icon={Clock}
              options={["Any Duration", "3-5 Days", "6-9 Days", "10+ Days"]}
              value={filters.duration}
              onChange={(val) => setFilters({ ...filters, duration: val })}
            />

            <div className="hidden lg:block w-px h-10 bg-slate-100" />

            <FilterDropdown
              label="Budget (PP)"
              icon={Wallet}
              options={["Any Budget", "Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "Above ₹50,000"]}
              value={filters.budget}
              onChange={(val) => setFilters({ ...filters, budget: val })}
            />

            <button className="mt-2 lg:mt-0 flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-4 lg:py-0 h-14 text-base font-bold text-white transition-all shadow-lg shadow-orange-500/30 hover:bg-orange-700 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0">
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 flex flex-col items-center gap-2 opacity-60">
          <div className="h-10 w-[2px] bg-gradient-to-b from-orange-500 to-transparent" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-white">Scroll</span>
        </div>
      </div>
    </section>
  );
}
