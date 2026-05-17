"use client";

function formatDisplayDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export default function ItineraryModal({ selectedPackage, isOpen, onClose }) {
  if (!isOpen || !selectedPackage) return null;

  const sharing = [...(selectedPackage.roomSharingOptions || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  const offerUntil = formatDisplayDate(selectedPackage.offerValidUntil);
  const launchAt = formatDisplayDate(selectedPackage.expectedLaunchAt);

  return (
    <div
      className="itin-overlay active"
      id="itinOverlay"
      onClick={(e) => e.target.id === "itinOverlay" && onClose()}
    >
      <div className="itin-box" id="itinBox">
        <button type="button" className="itin-close" onClick={onClose}>
          ✕
        </button>

        <img className="itin-hero" src={selectedPackage.thumbnail} alt={selectedPackage.title} />

        <div className="itin-header">
          <div className="itin-meta">
            <span>
              <i className="fa-solid fa-calendar-days"></i> {selectedPackage.durationDays}D /{" "}
              {selectedPackage.durationDays - 1}N
            </span>
            <span>
              <i className="fa-solid fa-users"></i>{" "}
              {sharing.length > 0 ? "Room sharing options below" : "2–10 People"}
            </span>
            <span>
              <i className="fa-solid fa-indian-rupee-sign"></i> From ₹{selectedPackage.currentPrice}/person
            </span>
          </div>
          <div className="itin-title">{selectedPackage.title}</div>
          {selectedPackage.isUpcoming && (
            <p className="text-sm font-bold text-amber-800 mt-2 bg-amber-50 inline-block px-3 py-1 rounded-lg">
              Upcoming trip
              {selectedPackage.upcomingLabel ? ` · ${selectedPackage.upcomingLabel}` : ""}
              {launchAt ? ` · Expected: ${launchAt}` : ""}
            </p>
          )}
          {selectedPackage.offerTitle && (
            <div
              className="mt-4 p-4 rounded-xl text-left"
              style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", border: "1px solid #fdba74" }}
            >
              <p className="text-xs font-black uppercase tracking-wider text-orange-700 mb-1">Special offer</p>
              <p className="text-lg font-black text-slate-900">{selectedPackage.offerTitle}</p>
              {selectedPackage.offerDescription && (
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">{selectedPackage.offerDescription}</p>
              )}
              {offerUntil && (
                <p className="text-xs font-bold text-amber-800 mt-2">Valid until {offerUntil}</p>
              )}
            </div>
          )}
        </div>

        <div className="itin-divider"></div>

        {selectedPackage.description && (
          <>
            <div className="px-5 py-4">
              <div className="inc-exc-label inc mb-2">
                ✦ Overview
              </div>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedPackage.description}
              </div>
            </div>
            <div className="itin-divider"></div>
          </>
        )}
        {sharing.length > 0 && (
          <>
            <div className="px-5 py-4">
              <div className="inc-exc-label inc" style={{ marginBottom: "12px" }}>
                ✦ Room sharing &amp; per-person price
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                      <th className="px-4 py-2 font-bold text-slate-600">Sharing type</th>
                      <th className="px-4 py-2 font-bold text-slate-600">Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharing.map((row) => (
                      <tr key={row.id ?? `${row.label}-${row.price}`} className="border-t border-slate-100">
                        <td className="px-4 py-2.5 font-medium text-slate-800">{row.label}</td>
                        <td className="px-4 py-2.5 font-black text-slate-900">₹{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Base &quot;from&quot; price on the card uses your package list price; align it with the lowest tier if
                you want them to match.
              </p>
            </div>
            <div className="itin-divider"></div>
          </>
        )}

        <div className="itin-days">
          {(selectedPackage.itinerary || []).map((day, idx) => (
            <div key={idx} className="day-acc">
              <div
                className="day-acc-header"
                onClick={(e) => e.currentTarget.parentElement.classList.toggle("open")}
              >
                <div className="day-acc-badge">Day {day.dayNumber}</div>
                <span className="day-acc-title">{day.title}</span>
                <svg className="day-acc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
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
                {(selectedPackage.inclusions || [])
                  .filter((inc) => inc.type === "included")
                  .map((item, idx) => (
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
                {(selectedPackage.inclusions || [])
                  .filter((inc) => inc.type === "excluded")
                  .map((item, idx) => (
                    <li key={idx}>
                      <div className="ie-icon cross">✕</div>
                      <span>{item.title}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="itin-divider"></div>

          {selectedPackage.terms && selectedPackage.terms.length > 0 && (
            <>
              <div className="itin-terms px-5 py-4">
                <div className="inc-exc-label" style={{ color: "#e8611a" }}>
                  ✦ Terms & Conditions
                </div>
                <ul className="inc-exc-list mt-3">
                  {selectedPackage.terms
                    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    .map((term, idx) => (
                      <li key={idx} className="flex items-start gap-2 mb-2">
                        <div
                          className="ie-icon"
                          style={{
                            background: "#fff7ed",
                            color: "#e8611a",
                            fontSize: "10px",
                            minWidth: "18px",
                            height: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                            marginTop: "2px",
                          }}
                        >
                          •
                        </div>
                        <span className="text-sm text-slate-600 font-medium leading-relaxed">{term.content}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="itin-divider"></div>
            </>
          )}

          <div className="itin-footer">
            <button
              type="button"
              className="itin-book-btn"
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSf_7w8-m0wzlxezAvCzsbDRv9K50a181_qE1d5bSHSjApoagQ/viewform",
                  "_blank"
                )
              }
            >
              Book This Package →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
