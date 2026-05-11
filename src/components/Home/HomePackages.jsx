"use client";

import { useState } from "react";

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
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card reveal in">
              <div className="pkg-img">
                <img src={pkg.imageURL || pkg.image || pkg.img} alt={pkg.title} loading="lazy" />
                {pkg.tag && <div className={`pkg-badge ${pkg.tagType || ""}`}>{pkg.tag}</div>}
              </div>
              <div className="pkg-body">
                <div className="pkg-meta">
                  <span><i className="fa-solid fa-location-dot"></i> {pkg.location || pkg.dest}</span>
                  <span><i className="fa-solid fa-calendar-days"></i> {pkg.duration || `${pkg.days}D / ${pkg.nights}N`}</span>
                </div>
                <div className="pkg-title">{pkg.title}</div>
                <div className="pkg-desc">{pkg.description || pkg.desc}</div>
                <div className="pkg-footer">
                  <div className="pkg-price">
                    <span className="pkg-price-from">Starting from</span>
                    <div className="pkg-price-row">
                      <span className="pkg-price-val">₹{pkg.price}</span>
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

      {/* Itinerary Modal */}
      {selectedPackage && (
        <div className="itin-overlay active" id="itinOverlay" onClick={(e) => e.target.id === "itinOverlay" && closeItinerary()}>
          <div className="itin-box" id="itinBox">
            <button className="itin-close" onClick={closeItinerary}>✕</button>

            <img className="itin-hero" src={selectedPackage.imageURL || selectedPackage.image || selectedPackage.img} alt={selectedPackage.title} />

            <div className="itin-header">
              <div className="itin-meta">
                <span><i className="fa-solid fa-calendar-days"></i> {selectedPackage.duration || `${selectedPackage.days}D / ${selectedPackage.nights}N`}</span>
                <span><i className="fa-solid fa-users"></i> 2–10 People</span>
                <span><i className="fa-solid fa-indian-rupee-sign"></i> From ₹{selectedPackage.price}/person</span>
              </div>
              <div className="itin-title">{selectedPackage.title}</div>
            </div>

            <div className="itin-divider"></div>

            <div className="itin-days">
              {(selectedPackage.itinerary || []).map((day, idx) => (
                <div key={idx} className="day-acc">
                  <div className="day-acc-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle("open")}>
                    <div className="day-acc-badge">Day {day.day}</div>
                    <span className="day-acc-title">{day.title}</span>
                    <svg className="day-acc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  <div className="day-acc-body">
                    <div className="day-acc-point">{day.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="itin-divider"></div>

            <div className="itin-inc-exc">
              <div className="inc-exc-grid">
                <div>
                  <div className="inc-exc-label inc">✦ Package Inclusions</div>
                  <ul className="inc-exc-list">
                    {(selectedPackage.inclusions || []).map((item, idx) => (
                      <li key={idx}>
                        <div className="ie-icon check">✓</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="inc-exc-label exc">✗ Package not Included</div>
                  <ul className="inc-exc-list">
                    {(selectedPackage.exclusions || []).map((item, idx) => (
                      <li key={idx}>
                        <div className="ie-icon cross">✕</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="itin-footer">
              <button className="itin-book-btn" onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSf_7w8-m0wzlxezAvCzsbDRv9K50a181_qE1d5bSHSjApoagQ/viewform", "_blank")}>
                Book This Package →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
