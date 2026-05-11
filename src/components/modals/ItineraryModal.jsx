"use client";

export default function ItineraryModal({ selectedPackage, isOpen, onClose }) {
  if (!isOpen || !selectedPackage) return null;

  return (
    <div className="itin-overlay active" id="itinOverlay" onClick={(e) => e.target.id === "itinOverlay" && onClose()}>
      <div className="itin-box" id="itinBox">
        <button className="itin-close" onClick={onClose}>✕</button>

        <img className="itin-hero" src={selectedPackage.thumbnail} alt={selectedPackage.title} />

        <div className="itin-header">
          <div className="itin-meta">
            <span><i className="fa-solid fa-calendar-days"></i> {selectedPackage.durationDays}D / {selectedPackage.durationDays - 1}N</span>
            <span><i className="fa-solid fa-users"></i> 2–10 People</span>
            <span><i className="fa-solid fa-indian-rupee-sign"></i> From ₹{selectedPackage.currentPrice}/person</span>
          </div>
          <div className="itin-title">{selectedPackage.title}</div>
        </div>

        <div className="itin-divider"></div>

        <div className="itin-days">
          {(selectedPackage.itinerary || []).map((day, idx) => (
            <div key={idx} className="day-acc">
              <div className="day-acc-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle("open")}>
                <div className="day-acc-badge">Day {day.dayNumber}</div>
                <span className="day-acc-title">{day.title}</span>
                <svg className="day-acc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="day-acc-body">
                <div className="day-acc-point">{day.description}</div>
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
                {(selectedPackage.inclusions || []).filter(inc => inc.type === 'included').map((item, idx) => (
                  <li key={idx}>
                    <div className="ie-icon check">✓</div>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="inc-exc-label exc">✗ Package not Included</div>
              <ul className="inc-exc-list">
                {(selectedPackage.inclusions || []).filter(inc => inc.type === 'excluded').map((item, idx) => (
                  <li key={idx}>
                    <div className="ie-icon cross">✕</div>
                    <span>{item.title}</span>
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
  );
}
