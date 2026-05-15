"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  CheckCircle,
  AlertCircle,
  XCircle,
  IndianRupee,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Package,
} from "lucide-react";
import NewDataTable from "@/components/common/NewDataTable";
import { formatCurrency, cn } from "@/lib/utils";
import BookingDetailModal from "@/components/admin/BookingDetailModal";

function StatCard({ label, value, icon: Icon, color, sub }) {
  const colors = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all">
      <div className={cn("p-3 rounded-xl", colors[color])}>
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

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function statusBadge(status) {
  const cls = {
    confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span
      className={cn(
        "inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ring-1",
        cls[status] || cls.pending
      )}
    >
      {status}
    </span>
  );
}

export default function AdminBookings() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    bookedValue: "0",
  });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [packageId, setPackageId] = useState("");
  const [travelFrom, setTravelFrom] = useState("");
  const [travelTo, setTravelTo] = useState("");

  const buildQueryString = () => {
    const qs = new URLSearchParams();
    if (search.trim()) qs.set("q", search.trim());
    if (status && status !== "all") qs.set("status", status);
    if (packageId) qs.set("packageId", packageId);
    if (travelFrom) qs.set("travelFrom", travelFrom);
    if (travelTo) qs.set("travelTo", travelTo);
    return qs.toString();
  };

  const load = async () => {
    setLoading(true);
    try {
      const qs = buildQueryString();
      const [bRes, sRes, pRes] = await Promise.all([
        fetch(`/api/admin/bookings${qs ? `?${qs}` : ""}`),
        fetch("/api/admin/bookings/stats"),
        fetch("/api/packages"),
      ]);
      if (bRes.ok) setRows(await bRes.json());
      if (sRes.ok) setStats(await sRes.json());
      if (pRes.ok) setPackages(await pRes.json());
      if (!bRes.ok || !sRes.ok || !pRes.ok) {
        toast.error("Could not load all booking data. Try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not refresh bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only bootstrap; `load` uses latest filter state when invoked via Apply
  }, []);

  const bookedDisplay = useMemo(() => {
    try {
      return formatCurrency(stats.bookedValue);
    } catch {
      return stats.bookedValue;
    }
  }, [stats.bookedValue]);

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "ID",
        width: "72px",
        render: (r) => <span className="font-mono text-xs font-bold text-orange-600">#{r.id}</span>,
      },
      {
        key: "customerName",
        label: "Customer",
        render: (r) => (
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate max-w-[180px]">{r.customerName}</p>
            <p className="text-[11px] text-slate-400 truncate">{r.customerPhone || "—"}</p>
          </div>
        ),
      },
      {
        key: "package",
        label: "Package",
        render: (r) => (
          <span className="text-sm font-semibold text-slate-700 line-clamp-2 max-w-[200px]">
            {r.package?.title || "—"}
          </span>
        ),
      },
      {
        key: "travelStartDate",
        label: "Travel",
        render: (r) => <span className="text-sm text-slate-600 whitespace-nowrap">{fmtDate(r.travelStartDate)}</span>,
      },
      {
        key: "travelersCount",
        label: "Pax",
        width: "56px",
        render: (r) => <span className="text-sm font-bold text-slate-800">{r.travelersCount}</span>,
      },
      {
        key: "totalAmount",
        label: "Amount",
        render: (r) => <span className="text-sm font-black text-slate-900">{formatCurrency(r.totalAmount)}</span>,
      },
      {
        key: "bookingStatus",
        label: "Status",
        render: (r) => statusBadge(r.bookingStatus),
      },
      {
        key: "actions",
        label: "",
        width: "100px",
        className: "text-right",
        render: (r) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(r);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </button>
        ),
      },
    ],
    []
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setPackageId("");
    setTravelFrom("");
    setTravelTo("");
  };

  const hasFilters = search || status !== "all" || packageId || travelFrom || travelTo;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total bookings" value={stats.total} icon={CalendarCheck} color="orange" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle} color="emerald" />
        <StatCard label="Pending" value={stats.pending} icon={AlertCircle} color="amber" />
        <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle} color="red" />
        <StatCard
          label="Booked value"
          value={bookedDisplay}
          icon={IndianRupee}
          color="blue"
          sub="Excl. cancelled"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-slate-700">Filters</span>
            {hasFilters && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Active</span>}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Name, email, phone, or booking #"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none text-slate-700 font-medium"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none text-slate-700 font-medium"
            >
              <option value="">All packages</option>
              {packages.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={travelFrom}
              onChange={(e) => setTravelFrom(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
            <input
              type="date"
              value={travelTo}
              onChange={(e) => setTravelTo(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => load()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
          >
            Apply filters
          </button>
          <p className="text-sm text-slate-500">
            Showing <strong className="text-slate-900">{rows.length}</strong> booking{rows.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4 bg-white border border-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
        <NewDataTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyMessage="No bookings match your filters. Mark a lead as Won (with a destination package) to create one."
          defaultPageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />

      </div>


      {selected && (
        <BookingDetailModal
          key={selected.id}
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => load()}
        />
      )}
    </div>
  );
}
