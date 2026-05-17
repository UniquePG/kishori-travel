"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import ItineraryModal from "../modals/ItineraryModal";
import PackageListingCard from "@/components/packages/PackageListingCard";

export default function HomePackages({ packages = [], popularPackages, upcomingPackages }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { popular, upcoming } = useMemo(() => {
    if (popularPackages != null || upcomingPackages != null) {
      return {
        popular: popularPackages ?? [],
        upcoming: upcomingPackages ?? [],
      };
    }
    const list = Array.isArray(packages) ? packages : [];
    return {
      popular: list.filter((p) => !p?.isUpcoming).slice(0, 6),
      upcoming: list.filter((p) => p?.isUpcoming),
    };
  }, [packages, popularPackages, upcomingPackages]);

  const openItinerary = (pkg) => {
    setSelectedPackage(pkg);
    document.body.style.overflow = "hidden";
  };

  const closeItinerary = () => {
    setSelectedPackage(null);
    document.body.style.overflow = "";
  };

  return (
    <>
      <section id="packages">
        <div className="container">
          <div className="reveal in">
            <div className="section-label">Exclusive Offers</div>
            <h2 className="section-title">
              Popular Tour <em>Packages</em>
            </h2>
            <p className="section-sub">
              Handpicked journeys that showcase the very best of India&apos;s beauty, heritage, and spirituality.
            </p>
          </div>

          <div className="packages-grid" id="packagesGrid">
            {popular.length === 0 ? (
              <p className="text-slate-500 col-span-full text-center py-8">No packages to show yet.</p>
            ) : (
              popular.map((pkg) => <PackageListingCard key={pkg.id} pkg={pkg} onOpen={openItinerary} />)
            )}
          </div>
        </div>
      </section>

      {/* Matches /packages catalog: dedicated strip + Cormorant headings + same grid/ribbon pattern */}
      <section
        id="upcoming-packages"
        className="bg-[#fdfcfb] py-16 md:py-20 border-t border-[#f0eae0]"
        aria-labelledby="home-upcoming-heading"
      >
        <div className="container">
          <div className="reveal in">
            <h2
              id="home-upcoming-heading"
              className="font-['Cormorant_Garamond',serif] text-3xl md:text-4xl text-slate-900 mb-2"
            >
              Upcoming <em className="text-orange-600 not-italic">trips</em>
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mb-8">
              Plan ahead for these future departures. Contact us to register interest or hold a spot — same list
              style as our full packages page.
            </p>

            {upcoming.length > 0 ? (
              <div className="packages-grid">
                {upcoming.map((pkg) => (
                  <div key={pkg.id} className="relative">
                    <div className="absolute -top-2 left-4 z-10 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase tracking-wide shadow">
                      Upcoming
                    </div>
                    <PackageListingCard pkg={pkg} onOpen={openItinerary} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center">
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  There are no upcoming trips listed yet. When the team marks packages as upcoming, they will appear
                  here and on the{" "}
                  <Link href="/packages" className="font-semibold text-orange-600 hover:text-orange-700 underline-offset-2 hover:underline">
                    packages
                  </Link>{" "}
                  page.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                View all packages
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ItineraryModal selectedPackage={selectedPackage} isOpen={!!selectedPackage} onClose={closeItinerary} />
    </>
  );
}
