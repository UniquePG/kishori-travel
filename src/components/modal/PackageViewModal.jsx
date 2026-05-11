"use client";

import { X, MapPin, Clock, Check, Star, Info, ShieldCheck, Heart, Share2, Tag } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export default function PackageViewModal({ isOpen, onClose, pkg }) {
  if (!isOpen || !pkg) return null;

  const inclusions = pkg.inclusions?.filter(i => i.type === "included") || [];
  const exclusions = pkg.inclusions?.filter(i => i.type === "excluded") || [];
  const itinerary = pkg.itinerary || [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-300">
        
        {/* Header Image Section */}
        <div className="relative h-64 sm:h-80 shrink-0">
          <img 
            src={pkg.thumbnail || "https://placehold.co/1200x600?text=No+Image"} 
            alt={pkg.title} 
            className="w-full h-full object-cover rounded-t-[3rem]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Top Actions */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-2xl transition-all">
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl transition-all shadow-xl active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Featured Badge */}
          {pkg.isFeatured && (
            <div className="absolute top-6 left-6 px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </div>
          )}

          {/* Basic Info Floating on Image */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/20">
                {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
              </span>
              <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-orange-500/20">
                Premium Tour
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{pkg.title}</h2>
            <div className="flex items-center gap-4 mt-3 text-white/80">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <MapPin className="h-4 w-4 text-orange-400" />
                {pkg.location}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                Verified Package
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-12 custom-scrollbar">
          
          {/* Quick Stats & Price */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">{formatCurrency(pkg.currentPrice)}</span>
                  {pkg.oldPrice && (
                    <span className="text-lg font-bold text-slate-300 line-through decoration-orange-500/50 decoration-2">
                      {formatCurrency(pkg.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Per Person</p>
                <p className="text-sm font-bold text-slate-600">Including Taxes</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-black text-slate-700">{pkg.durationDays} Days</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-black text-slate-700">Wishlist</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-orange-500" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Tour Overview</h3>
            </div>
            <p className="text-lg font-bold text-slate-600 leading-relaxed max-w-4xl">
              {pkg.shortDescription}
            </p>
            <div className="text-base text-slate-500 leading-relaxed whitespace-pre-wrap font-medium">
              {pkg.description}
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Day-wise Itinerary</h3>
              </div>
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-xl">
                Planned Schedule
              </span>
            </div>
            
            <div className="space-y-4">
              {itinerary.length > 0 ? (
                itinerary.map((day, idx) => (
                  <div key={idx} className="group flex gap-8">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-slate-900/10 group-hover:bg-orange-500 group-hover:shadow-orange-500/20 transition-all duration-300">
                        {day.dayNumber}
                      </div>
                      <div className="flex-1 w-1 bg-slate-100 my-4 group-last:hidden rounded-full"></div>
                    </div>
                    <div className="flex-1 pt-2 pb-8">
                      <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{day.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{day.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 font-bold italic">Itinerary details not provided.</p>
              )}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Inclusions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Inclusions</h3>
              </div>
              <div className="bg-green-50/30 rounded-[2rem] p-6 space-y-4 border border-green-50">
                {inclusions.length > 0 ? (
                  inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                      <p className="text-sm font-bold text-slate-700">{item.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-bold text-slate-400">No specific inclusions listed.</p>
                )}
              </div>
            </div>

            {/* Exclusions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <X className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Exclusions</h3>
              </div>
              <div className="bg-red-50/30 rounded-[2rem] p-6 space-y-4 border border-red-50">
                {exclusions.length > 0 ? (
                  exclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                      <p className="text-sm font-bold text-slate-700">{item.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-bold text-slate-400">No specific exclusions listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-b-[3rem]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Tag className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Package Status</p>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", pkg.isActive ? "bg-green-500" : "bg-red-500")}></div>
                <p className="text-xs font-black text-slate-700">{pkg.isActive ? "Active & Bookable" : "Currently Inactive"}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
