"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, Calendar, User, Phone, Mail, MapPin,
  Package, Users, CreditCard, Clock, ChevronDown, X,
  Eye, CheckCircle, XCircle, AlertCircle, Download, RefreshCw,
  TrendingUp, IndianRupee, CalendarCheck, Loader
} from "lucide-react";

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const PACKAGES = [
  "Golden Triangle Tour",
  "Kerala Backwaters Escape",
  "Rajasthan Royal Heritage",
  "Goa Beach Paradise",
  "Himalayan Adventure Trek",
  "Varanasi Spiritual Journey",
  "Andaman Island Retreat",
  "Coorg Coffee Trail",
];

const STATUS_CONFIG = {
  Confirmed: { color: "emerald", icon: CheckCircle },
  Pending:   { color: "amber",   icon: AlertCircle },
  Cancelled: { color: "red",     icon: XCircle },
  Completed: { color: "blue",    icon: CheckCircle },
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtCurrency(n) { return `₹${n.toLocaleString("en-IN")}`; }

const DUMMY_BOOKINGS = Array.from({ length: 42 }, (_, i) => {
  const pkg = PACKAGES[i % PACKAGES.length];
  const adults = Math.ceil(Math.random() * 4);
  const children = Math.floor(Math.random() * 3);
  const basePrice = [24999, 35999, 42999, 19999, 55999, 18999, 48999, 22999][i % 8];
  const totalGuests = adults + children;
  const totalAmount = basePrice * adults + Math.floor(basePrice * 0.5) * children;
  const travelDate = new Date(2026, Math.floor(Math.random() * 12), Math.floor(Math.random() * 27) + 1);
  const bookingDate = new Date(travelDate - Math.random() * 30 * 86400000);
  const statuses = ["Confirmed", "Pending", "Cancelled", "Completed"];
  return {
    id: `KT-${String(1000 + i + 1)}`,
    bookingDate: bookingDate.toISOString().split("T")[0],
    travelDate: travelDate.toISOString().split("T")[0],
    package: pkg,
    status: statuses[i % 4],
    fullName: ["Rahul Sharma", "Priya Patel", "Amit Singh", "Sneha Gupta", "Vikram Joshi",
               "Kavya Reddy", "Arjun Mehta", "Divya Nair", "Rohan Kapoor", "Ananya Bose",
               "Siddharth Roy", "Meera Iyer", "Karan Malhotra", "Pooja Verma", "Nikhil Das"][i % 15],
    email: `user${i + 1}@example.com`,
    phone: `+91 ${String(9000000000 + i)}`,
    adults,
    children,
    totalGuests,
    totalAmount,
    specialRequests: i % 3 === 0 ? "Vegetarian meals preferred. Need wheelchair access." : i % 5 === 0 ? "Anniversary trip, please arrange a surprise." : "",
    accommodation: ["Luxury Hotel", "Budget Hotel", "Homestay", "Resort"][i % 4],
    pickupLocation: ["Delhi Airport", "Mumbai Airport", "Bangalore Airport", "Chennai Airport", "Home Address"][i % 5],
    paymentStatus: i % 3 === 0 ? "Full Payment" : "Advance Paid",
    amountPaid: i % 3 === 0 ? totalAmount : Math.floor(totalAmount * 0.3),
    nationality: "Indian",
  };
});

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }) {
  const colors = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const c = cfg.color;
  const cls = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber:   "bg-amber-50  text-amber-700  ring-amber-200",
    red:     "bg-red-50    text-red-700    ring-red-200",
    blue:    "bg-blue-50   text-blue-700   ring-blue-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${cls[c]}`}>
      <cfg.icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

// ─── Booking Detail Modal ──────────────────────────────────────────────────────
function BookingModal({ booking, onClose }) {
  if (!booking) return null;
  const remaining = booking.totalAmount - booking.amountPaid;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
            <p className="text-sm text-slate-500 font-mono mt-0.5">{booking.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} />
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Package & Dates */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-orange-100 rounded-xl">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{booking.package}</h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarCheck className="h-4 w-4 text-orange-500" />
                    <span><span className="text-slate-400">Travel:</span> <strong>{fmtDate(booking.travelDate)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span><span className="text-slate-400">Booked on:</span> <strong>{fmtDate(booking.bookingDate)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Guest Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: User,    label: "Full Name",    value: booking.fullName },
                { icon: Mail,    label: "Email",        value: booking.email },
                { icon: Phone,   label: "Phone",        value: booking.phone },
                { icon: MapPin,  label: "Pickup From",  value: booking.pickupLocation },
                { icon: Users,   label: "Adults",       value: booking.adults },
                { icon: Users,   label: "Children",     value: booking.children },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <Icon className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Preferences */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Trip Preferences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Accommodation</p>
                  <p className="text-sm font-semibold text-slate-800">{booking.accommodation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <Users className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Nationality</p>
                  <p className="text-sm font-semibold text-slate-800">{booking.nationality}</p>
                </div>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-600 font-semibold mb-1">Special Requests</p>
                <p className="text-sm text-slate-700">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Summary</h4>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-bold text-slate-900">{fmtCurrency(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-semibold text-emerald-600">{fmtCurrency(booking.amountPaid)}</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Balance Due</span>
                <span className={`font-bold ${remaining > 0 ? "text-red-500" : "text-emerald-600"}`}>
                  {remaining > 0 ? fmtCurrency(remaining) : "Fully Paid"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Payment Status</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${booking.paymentStatus === "Full Payment" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateField, setDateField] = useState("travelDate");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    return DUMMY_BOOKINGS.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.fullName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone.includes(q);
      const matchPackage = selectedPackage === "All" || b.package === selectedPackage;
      const matchStatus = selectedStatus === "All" || b.status === selectedStatus;
      const bDate = b[dateField];
      const matchFrom = !dateFrom || bDate >= dateFrom;
      const matchTo = !dateTo || bDate <= dateTo;
      return matchSearch && matchPackage && matchStatus && matchFrom && matchTo;
    });
  }, [search, selectedPackage, selectedStatus, dateFrom, dateTo, dateField]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const stats = useMemo(() => ({
    total: DUMMY_BOOKINGS.length,
    confirmed: DUMMY_BOOKINGS.filter((b) => b.status === "Confirmed").length,
    pending: DUMMY_BOOKINGS.filter((b) => b.status === "Pending").length,
    revenue: DUMMY_BOOKINGS.filter((b) => b.status !== "Cancelled").reduce((s, b) => s + b.amountPaid, 0),
  }), []);

  const resetFilters = () => {
    setSearch(""); setSelectedPackage("All"); setSelectedStatus("All");
    setDateFrom(""); setDateTo(""); setCurrentPage(1);
  };

  const hasFilters = search || selectedPackage !== "All" || selectedStatus !== "All" || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} icon={CalendarCheck} color="orange" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle} color="emerald" />
        <StatCard label="Pending Review" value={stats.pending} icon={AlertCircle} color="amber" />
        <StatCard label="Total Revenue" value={`₹${(stats.revenue / 100000).toFixed(1)}L`} icon={IndianRupee} color="blue" sub="Advance + Full payments" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-slate-700">Filters</span>
            {hasFilters && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Active</span>
            )}
          </div>
          {hasFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors font-medium">
              <RefreshCw className="h-3.5 w-3.5" /> Reset all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Name, ID, email, phone…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Package Filter */}
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedPackage}
              onChange={(e) => { setSelectedPackage(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
            >
              <option value="All">All Packages</option>
              {PACKAGES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
            >
              <option value="All">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Date Filter Toggle */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={dateField}
              onChange={(e) => setDateField(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
            >
              <option value="travelDate">Filter by Travel Date</option>
              <option value="bookingDate">Filter by Booking Date</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Date Range Row */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Date range:</span>
            <input
              type="date" value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              className="flex-1 min-w-[130px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date" value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
              className="flex-1 min-w-[130px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
            />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filtered.length}</strong> of {DUMMY_BOOKINGS.length} bookings
          </p>
        </div>
      </div>

      {/* ── Mobile Card View (hidden on lg+) ── */}
      <div className="lg:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400">
            <CalendarCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No bookings found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : paginated.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-orange-500">{b.id}</p>
                <p className="font-bold text-slate-900 text-base leading-tight">{b.fullName}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{b.email}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>

            {/* Package + dates */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100 space-y-1.5">
              <div className="flex items-start gap-2">
                <Package className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                <p className="text-sm font-semibold text-slate-700 leading-snug">{b.package}</p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3 w-3 text-orange-400" />
                  Travel: <strong className="text-slate-700">{fmtDate(b.travelDate)}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3 w-3 text-slate-400" />
                  Booked: <strong className="text-slate-700">{fmtDate(b.bookingDate)}</strong>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Guests", value: b.totalGuests },
                { label: "Amount", value: fmtCurrency(b.totalAmount) },
                { label: "Paid", value: b.paymentStatus === "Full Payment" ? "Full" : "Advance",
                  cls: b.paymentStatus === "Full Payment" ? "text-emerald-600" : "text-amber-600" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                  <p className={`font-bold text-slate-800 text-sm mt-0.5 ${cls || ""}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Phone + CTA */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 truncate">{b.phone}</span>
              </div>
              <button
                onClick={() => setSelectedBooking(b)}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                <Eye className="h-3.5 w-3.5" /> Details
              </button>
            </div>
          </div>
        ))}

        {/* Mobile pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">Page <strong>{currentPage}</strong> / <strong>{totalPages}</strong></p>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop Table (lg+) ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Booking ID", "Customer", "Package", "Travel Date", "Guests", "Amount", "Payment", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-400">
                    <CalendarCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-base font-medium">No bookings found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : paginated.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-orange-600">{b.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900 whitespace-nowrap">{b.fullName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{b.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-700 font-medium max-w-[180px] truncate" title={b.package}>{b.package}</p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">{fmtDate(b.travelDate)}</td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-400" />{b.totalGuests}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">{fmtCurrency(b.totalAmount)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 whitespace-nowrap rounded-lg font-semibold ${b.paymentStatus === "Full Payment" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedBooking(b)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></p>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                return <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 text-sm rounded-lg border transition-colors ${page === currentPage ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{page}</button>;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}
