import { Clock, MapPin, Star, ArrowRight } from "lucide-react";
import { formatCurrency, cn } from "../lib/utils";

export default function PackageCard({ pkg }) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-[280px] overflow-hidden">
        <img
          src={pkg.imageURL}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {pkg.tag && (
            <span className="rounded-full bg-orange-500 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              {pkg.tag}
            </span>
          )}
          <span className="w-min rounded-full bg-white/20 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {pkg.category}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white">
          <Clock className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-semibold">{pkg.duration}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1 text-xs font-bold text-orange-500 uppercase tracking-widest">
            <MapPin className="h-3 w-3" />
            {pkg.location}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>4.9</span>
          </div>
        </div>

        <h3 className="font-serif text-2xl text-slate-900 group-hover:text-orange-600 transition-colors">
          {pkg.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
          {pkg.description}
        </p>

        <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Starting from
            </span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(pkg.price)}</span>
            <span className="text-xs text-slate-400 font-medium"> / person</span>
          </div>
          <button
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-900 transition-all",
              "group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-[-45deg]"
            )}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
