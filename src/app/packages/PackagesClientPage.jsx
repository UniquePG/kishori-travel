"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ItineraryModal from "@/components/modals/ItineraryModal";
import HomeFooter from "@/components/Home/HomeFooter";
import HomeSearchBar from "@/components/Home/HomeSearchBar";

export default function PackagesClientPage({ packages = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const openItinerary = (pkg) => {
    setSelectedPackage(pkg);
    document.body.style.overflow = "hidden";
  };

  const closeItinerary = () => {
    setSelectedPackage(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="packages-page-wrapper pt-20">
      {/* Search Header */}
      <section className="packages-hero bg-white py-16 border-b border-[#f0eae0]">
        <div className="container">
          <div className="packages-hero-content flex flex-col items-center mb-8 text-center max-w-[800px] mx-auto">
            <div className="section-label">All Destinations</div>

            <h1 className="section-title mt-4 text-[2.5rem] md:text-[3.5rem]">
              Our Complete <em>Collection</em>
            </h1>

            <p className="section-sub">
              Browse our entire catalog of handpicked experiences. Whether
              you're seeking spiritual peace in the Himalayas or vibrant
              cultural tours, your perfect journey awaits.
            </p>
          </div>
          
          <HomeSearchBar />
        </div>
      </section>

      {/* Packages Grid */}
      <section id="packages" className="bg-[#fdfcfb] py-20 min-h-[60vh]">
        <div className="container">
          <div className="packages-grid">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div key={pkg.id} className="package-card reveal in">
                  <div className="pkg-img">
                    <img
                      src={pkg.thumbnail}
                      alt={pkg.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="pkg-body">
                    <div className="pkg-meta">
                      <span>
                        <i className="fa-solid fa-location-dot"></i>{" "}
                        {pkg.location || pkg.destination}
                      </span>
                      <span>
                        <i className="fa-solid fa-calendar-days"></i>{" "}
                        {pkg.durationDays}D / {pkg.durationDays - 1}N
                      </span>
                    </div>

                    <div className="pkg-title">{pkg.title}</div>
                    <div className="pkg-desc">
                      {pkg.description || pkg.desc}
                    </div>

                    <div className="pkg-footer">
                      <div className="pkg-price">
                        <span className="pkg-price-from">
                          Starting from
                        </span>

                        <div className="pkg-price-row">
                          <span className="pkg-price-val">
                            ₹{pkg.currentPrice}
                          </span>
                          {pkg.oldPrice && (
                            <span className="pkg-price-old">
                              ₹{pkg.oldPrice}
                            </span>
                          )}
                        </div>

                        <span className="pkg-price-per">
                          per person
                        </span>
                      </div>

                      <button
                        className="btn-itinerary"
                        onClick={() => openItinerary(pkg)}
                      >
                        View Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 w-full">
                <h3 className='font-["Cormorant_Garamond",serif] text-[2rem]'>
                  No packages found matching your filters.
                </h3>

                <button
                  className="btn-primary mt-6"
                  onClick={() => router.push("/packages")}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <HomeFooter />

      <ItineraryModal
        selectedPackage={selectedPackage}
        isOpen={!!selectedPackage}
        onClose={closeItinerary}
      />
    </div>
  );
}
