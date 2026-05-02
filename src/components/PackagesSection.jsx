"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PackageCard from "./PackageCard";
import PackageDetailsModal from "./PackageDetailsModal";

export default function PackagesSection({ packages = [] }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <section id="packages" className="bg-[#fcf8f3] py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">
            Curated Journeys
          </span>
          <h2 className="mt-2 font-serif text-4xl text-slate-900 md:text-5xl">
            Explore Our <span className="italic text-orange-500">Pick of the Season</span>
          </h2>
          <p className="mt-4 max-w-2xl text-slate-500">
            Handpicked experiences across India&apos;s most breathtaking destinations - with
            detailed day-wise itineraries and local expertise.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12">No packages available.</div>
          ) : (
            packages.slice(0, 6).map((pkg) => (
              <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className="cursor-pointer">
                <PackageCard pkg={pkg} />
              </div>
            ))
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/packages" className="group flex items-center gap-2 rounded-full border border-slate-200 px-8 py-4 font-semibold text-slate-800 transition-all hover:border-orange-500 hover:text-orange-500 hover:shadow-lg">
            View All Packages
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {selectedPackage && (
        <PackageDetailsModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}
    </section>
  );
}
