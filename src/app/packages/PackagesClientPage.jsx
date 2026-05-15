"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ItineraryModal from "@/components/modals/ItineraryModal";
import HomeFooter from "@/components/Home/HomeFooter";
import HomeSearchBar from "@/components/Home/HomeSearchBar";
import PackageListingCard from "@/components/packages/PackageListingCard";

export default function PackagesClientPage({ packages = [] }) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { regular, upcoming } = useMemo(() => {
    const list = Array.isArray(packages) ? packages : [];
    return {
      regular: list.filter((p) => !p?.isUpcoming),
      upcoming: list.filter((p) => p?.isUpcoming),
    };
  }, [packages]);

  const openItinerary = (pkg) => {
    setSelectedPackage(pkg);
    document.body.style.overflow = "hidden";
  };

  const closeItinerary = () => {
    setSelectedPackage(null);
    document.body.style.overflow = "";
  };

  const empty = packages.length === 0;

  return (
    <div className="packages-page-wrapper pt-20">
      <section className="packages-hero bg-white py-16 border-b border-[#f0eae0]">
        <div className="container">
          <div className="packages-hero-content flex flex-col items-center mb-8 text-center max-w-[800px] mx-auto">
            <div className="section-label">All Destinations</div>

            <h1 className="section-title mt-4 text-[2.5rem] md:text-[3.5rem]">
              Our Complete <em>Collection</em>
            </h1>

            <p className="section-sub">
              Browse our entire catalog of handpicked experiences. Whether you&apos;re seeking spiritual peace in the
              Himalayas or vibrant cultural tours, your perfect journey awaits.
            </p>
          </div>

          <HomeSearchBar />
        </div>
      </section>

      <section id="packages" className="bg-[#fdfcfb] py-20 min-h-[60vh]">
        <div className="container space-y-20">
          {!empty && upcoming.length > 0 && (
            <div>
              <h2 className="font-['Cormorant_Garamond',serif] text-3xl md:text-4xl text-slate-900 mb-2">
                Upcoming <em className="text-orange-600 not-italic">trips</em>
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl mb-8">
                Plan ahead for these future departures. Contact us to register interest or hold a spot.
              </p>
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
            </div>
          )}

          <div>
            {!empty && (
              <h2 className="font-['Cormorant_Garamond',serif] text-3xl md:text-4xl text-slate-900 mb-8">
                {upcoming.length > 0 ? (
                  <>
                    Available <em className="text-orange-600 not-italic">now</em>
                  </>
                ) : (
                  <>
                    All <em className="text-orange-600 not-italic">packages</em>
                  </>
                )}
              </h2>
            )}
            <div className="packages-grid">
              {!empty ? (
                regular.length > 0 ? (
                  regular.map((pkg) => <PackageListingCard key={pkg.id} pkg={pkg} onOpen={openItinerary} />)
                ) : (
                  <div className="col-span-full text-center py-16 w-full">
                    <h3 className='font-["Cormorant_Garamond",serif] text-[2rem]'>No current packages match your filters.</h3>
                    <button className="btn-primary mt-6" type="button" onClick={() => router.push("/packages")}>
                      Clear All Filters
                    </button>
                  </div>
                )
              ) : (
                <div className="col-span-full text-center py-16 w-full">
                  <h3 className='font-["Cormorant_Garamond",serif] text-[2rem]'>No packages found matching your filters.</h3>
                  <button className="btn-primary mt-6" type="button" onClick={() => router.push("/packages")}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />

      <ItineraryModal selectedPackage={selectedPackage} isOpen={!!selectedPackage} onClose={closeItinerary} />
    </div>
  );
}
