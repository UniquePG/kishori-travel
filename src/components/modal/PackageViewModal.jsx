"use client";

import { X, MapPin, Clock, Check, Star, Info, ShieldCheck, Share2, Tag, FileText } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export default function PackageViewModal({ isOpen, onClose, pkg }) {
  if (!isOpen || !pkg) return null;

  const inclusions = pkg.inclusions?.filter(i => i.type === "included") || [];
  const exclusions = pkg.inclusions?.filter(i => i.type === "excluded") || [];
  const itinerary = pkg.itinerary || [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Header Actions (Floating) */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-black/20 backdrop-blur-md text-white hover:bg-black/40 rounded-lg transition-all border border-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-2xl">
          
          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-72 w-full shrink-0">
            <img 
              src={pkg.thumbnail || "https://placehold.co/1200x600?text=No+Image"} 
              alt={pkg.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-md border border-white/10">
                  {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                </span>
                {pkg.isFeatured && (
                  <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-sm">
                    <Star className="h-3 w-3 fill-white" /> Featured
                  </span>
                )}
                {pkg.isUpcoming && (
                  <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-md shadow-sm">
                    Upcoming
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{pkg.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-white/90">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  {pkg.location}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Card */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Starting Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{formatCurrency(pkg.currentPrice)}</span>
                  {pkg.oldPrice && (
                    <span className="text-sm font-medium text-slate-400 line-through">
                      {formatCurrency(pkg.oldPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Per person, including taxes</p>
              </div>

              {/* Offer Card or Details */}
              {pkg.offerTitle ? (
                <div className="md:col-span-2 bg-orange-50/50 p-5 rounded-xl border border-orange-100 flex items-start gap-4">
                  <div className="p-2.5 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Special Offer</p>
                    <h4 className="text-base font-bold text-slate-900">{pkg.offerTitle}</h4>
                    {pkg.offerDescription && <p className="text-sm text-slate-600 mt-1 font-medium">{pkg.offerDescription}</p>}
                    {pkg.offerValidUntil && (
                      <p className="text-xs font-semibold text-orange-700 mt-2">
                        Valid until {new Date(pkg.offerValidUntil).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white shadow-sm rounded-lg border border-slate-100 text-slate-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</p>
                      <p className="text-sm font-bold text-slate-900">{pkg.durationDays} Days</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 bg-white shadow-sm rounded-lg border border-slate-100", pkg.isActive ? "text-green-600" : "text-slate-400")}>
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</p>
                      <p className="text-sm font-bold text-slate-900">{pkg.isActive ? "Active & Bookable" : "Inactive / Draft"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-400" />
                Tour Overview
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {pkg.description || "No description provided for this package."}
              </p>
            </div>

            {/* Grid Layout for Inclusions/Exclusions & Room Sharing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Inclusions & Exclusions */}
              <div className="space-y-8">
                {/* Inclusions */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    What's Included
                  </h3>
                  <div className="space-y-2.5">
                    {inclusions.length > 0 ? inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                        <div className="mt-0.5 p-1 bg-green-100 rounded-md shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{item.title}</span>
                      </div>
                    )) : <p className="text-sm text-slate-500 italic font-medium">No inclusions listed.</p>}
                  </div>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <X className="h-5 w-5 text-red-500" />
                    What's Not Included
                  </h3>
                  <div className="space-y-2.5">
                    {exclusions.length > 0 ? exclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                        <div className="mt-0.5 p-1 bg-red-100 rounded-md shrink-0">
                          <X className="h-3 w-3 text-red-600" />
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{item.title}</span>
                      </div>
                    )) : <p className="text-sm text-slate-500 italic font-medium">No exclusions listed.</p>}
                  </div>
                </div>
              </div>

              {/* Right Column: Room Sharing */}
              <div className="space-y-8">
                {pkg.roomSharingOptions && pkg.roomSharingOptions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-slate-400" />
                      Room Sharing Prices
                    </h3>
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Occupancy Type</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-600">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[...pkg.roomSharingOptions]
                            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                            .map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-700">{row.label}</td>
                                <td className="px-4 py-3 font-bold text-slate-900 text-right">{formatCurrency(row.price)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Itinerary */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                Day-wise Itinerary
              </h3>
              
              <div className="space-y-4">
                {itinerary.length > 0 ? (
                  itinerary.map((day, idx) => (
                    <div key={idx} className="flex gap-4 sm:gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-orange-200 transition-colors">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                          D{day.dayNumber}
                        </div>
                      </div>
                      <div className="flex-1 pt-0.5">
                        <h4 className="text-base font-bold text-slate-900 mb-2">{day.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{day.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic font-medium bg-slate-50 p-5 rounded-xl border border-slate-200">
                    Itinerary details not provided.
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            {pkg.terms && pkg.terms.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-400" />
                  Terms & Conditions
                </h3>
                <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 space-y-3">
                  {pkg.terms
                    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    .map((term, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"></div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{term.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
