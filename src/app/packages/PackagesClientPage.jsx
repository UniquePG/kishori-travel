"use client";

import { useState } from "react";
import PackageCard from "@/components/PackageCard";
import PackageDetailsModal from "@/components/PackageDetailsModal";
import { Compass } from "lucide-react";

export default function PackagesClientPage({ packages = [] }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className="min-h-screen bg-[#fcf8f3] flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        <div className="mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Compass className="h-8 w-8" />
          </div>
          <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">
            All Destinations
          </span>
          <h1 className="mt-4 font-serif text-5xl text-slate-900 md:text-7xl">
            Our Complete <span className="italic text-orange-500">Collection</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
            Browse our entire catalog of handpicked experiences. Whether you are seeking spiritual peace in the Himalayas or vibrant cultural tours across the plains, your perfect journey awaits.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 px-6 lg:px-8 flex-1">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {packages.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-serif text-slate-900 mb-2">No Packages Found</h3>
                <p>We are currently curating new experiences. Please check back later.</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className="cursor-pointer">
                  <PackageCard pkg={pkg} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedPackage && (
        <PackageDetailsModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}
    </div>
  );
}
