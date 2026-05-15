"use client";

function formatOfferUntil(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function sharingPriceFrom(pkg) {
  const opts = pkg.roomSharingOptions;
  if (!opts?.length) return null;
  const nums = opts.map((o) => Number(o.price)).filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  return Math.min(...nums);
}

export default function PackageListingCard({ pkg, onOpen }) {
  const offerUntil = formatOfferUntil(pkg.offerValidUntil);
  const shareFrom = sharingPriceFrom(pkg);

  return (
    <div className="package-card reveal in">
      <div className="pkg-img">
        <img src={pkg.thumbnail} alt={pkg.title} loading="lazy" />
        {pkg.offerTitle && (
          <div className="pkg-badge" style={{ background: "#ea580c", color: "#fff" }}>
            {pkg.offerTitle}
          </div>
        )}
      </div>
      <div className="pkg-body">
        <div className="pkg-meta">
          <span>
            <i className="fa-solid fa-location-dot"></i> {pkg.location || pkg.destination}
          </span>
          <span>
            <i className="fa-solid fa-calendar-days"></i> {pkg.durationDays}D / {pkg.durationDays - 1}N
          </span>
        </div>
        <div className="pkg-title">{pkg.title}</div>
        {pkg.isUpcoming && pkg.upcomingLabel && (
          <p className="text-xs font-bold text-orange-600 mb-1 -mt-1">{pkg.upcomingLabel}</p>
        )}
        <div className="pkg-desc line-clamp-2">{pkg.shortDescription || pkg.description || pkg.desc}</div>
        {pkg.offerDescription && (
          <p className="text-xs text-slate-600 mt-2 leading-snug line-clamp-2">{pkg.offerDescription}</p>
        )}
        {offerUntil && (
          <p className="text-[11px] font-semibold text-amber-700 mt-1">Offer valid till {offerUntil}</p>
        )}
        <div className="pkg-footer">
          <div className="pkg-price">
            <span className="pkg-price-from">Starting from</span>
            <div className="pkg-price-row">
              <span className="pkg-price-val">₹{pkg.currentPrice}</span>
              {pkg.oldPrice && <span className="pkg-price-old">₹{pkg.oldPrice}</span>}
            </div>
            {shareFrom != null ? (
              <span className="pkg-price-per text-[11px] text-slate-500">Room sharing from ₹{shareFrom}</span>
            ) : (
              <span className="pkg-price-per">per person</span>
            )}
          </div>
          <button type="button" className="btn-itinerary" onClick={() => onOpen(pkg)}>
            View Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
