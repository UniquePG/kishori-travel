"use client";

import { useState } from "react";
import ItineraryModal from "../modals/ItineraryModal";

export default function HomePackages({ packages = [] }) {
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
    <section id="packages">
      <div className="container">
        <div className="reveal in">
          <div className="section-label">Exclusive Offers</div>
          <h2 className="section-title">Popular Tour <em>Packages</em></h2>
          <p className="section-sub">
            Handpicked journeys that showcase the very best of India's beauty, heritage, and spirituality.
          </p>
        </div>

        <div className="packages-grid" id="packagesGrid">
          {packages.slice(0,6).map((pkg) => (
            <div key={pkg.id} className="package-card reveal in">
              <div className="pkg-img">
                <img src={pkg.thumbnail} alt={pkg.title} loading="lazy" />
                {/* {pkg.tag && <div className={`pkg-badge ${pkg.tagType || ""}`}>{pkg.tag}</div>} */}
              </div>
              <div className="pkg-body">
                <div className="pkg-meta">
                  <span><i className="fa-solid fa-location-dot"></i> {pkg.location || pkg.destination}</span>
                  <span><i className="fa-solid fa-calendar-days"></i> {pkg.durationDays}D / {pkg.durationDays - 1}N</span>
                </div>
                <div className="pkg-title">{pkg.title}</div>
                <div className="pkg-desc">{pkg.description || pkg.desc}</div>
                <div className="pkg-footer">
                  <div className="pkg-price">
                    <span className="pkg-price-from">Starting from</span>
                    <div className="pkg-price-row">
                      <span className="pkg-price-val">₹{pkg.currentPrice}</span>
                      {pkg.oldPrice && <span className="pkg-price-old">₹{pkg.oldPrice}</span>}
                    </div>
                    <span className="pkg-price-per">per person</span>
                  </div>
                  <button className="btn-itinerary" onClick={() => openItinerary(pkg)}>View Itinerary</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ItineraryModal 
        selectedPackage={selectedPackage} 
        isOpen={!!selectedPackage} 
        onClose={closeItinerary} 
      />
    </section>
  );
}
