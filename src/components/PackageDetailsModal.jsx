"use client";

import { X, MapPin, Clock, Star, Calendar, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { useEffect } from "react";

export default function PackageDetailsModal({ pkg, onClose }) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header Image Section */}
        <div className="relative h-64 sm:h-80 shrink-0">
          <img
            src={pkg.imageURL}
            alt={pkg.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-2 mb-3">
              {pkg.tag && (
                <span className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  {pkg.tag}
                </span>
              )}
              <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                {pkg.category}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-2 leading-tight">
              {pkg.title}
            </h2>
            <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-orange-400" />
                {pkg.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-400" />
                {pkg.duration}
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                4.9 Review
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 scroll-smooth">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Left Column: Details & Itinerary */}
            <div className="md:col-span-2 space-y-10">
              <section>
                <h3 className="text-2xl font-serif text-slate-900 mb-4">About this Journey</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {pkg.description}
                </p>
              </section>

              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <section>
                  <h3 className="text-2xl font-serif text-slate-900 mb-6">Itinerary</h3>
                  <div className="relative border-l border-slate-200 ml-3 space-y-8">
                    {pkg.itinerary.map((day, index) => (
                      <div key={index} className="relative pl-8">
                        <div className="absolute -left-[17px] top-1 h-8 w-8 rounded-full bg-orange-50 border-4 border-white flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{day.title}</h4>
                        <p className="text-slate-600 leading-relaxed">
                          {day.activities}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Pricing & Actions */}
            <div className="md:col-span-1">
              <div className="sticky top-0 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="mb-6">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Price per person
                  </span>
                  <div className="text-3xl font-bold text-slate-900">
                    {formatCurrency(pkg.price)}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Premium Accommodation
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Expert Local Guide
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Daily Breakfast
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Airport Transfers
                  </div>
                </div>

                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-200 mb-3">
                  Book This Tour
                </button>
                <button className="w-full border border-slate-200 text-slate-700 hover:border-slate-400 font-bold py-4 rounded-xl transition-colors">
                  Inquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
