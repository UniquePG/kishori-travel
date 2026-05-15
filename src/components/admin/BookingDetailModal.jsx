"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  X,
  User,
  Phone,
  Mail,
  Package,
  Calendar,
  Users,
  IndianRupee,
  CreditCard,
  FileText,
  Target,
  Loader2,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

const BOOKING_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
];

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const cls = {
    confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    pending: "bg-amber-50 text-amber-800 ring-amber-200",
    cancelled: "bg-red-50 text-red-800 ring-red-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 capitalize",
        cls[status] || cls.pending
      )}
    >
      {status}
    </span>
  );
}

export default function BookingDetailModal({ booking, onClose, onUpdated }) {
  const [bookingStatus, setBookingStatus] = useState(booking?.bookingStatus || "pending");
  const [paymentStatus, setPaymentStatus] = useState(booking?.paymentStatus || "pending");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!booking) return null;

  const lead = booking.lead;
  const assignee = lead?.assignee;
  const pkg = booking.package;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus, paymentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      onUpdated?.(data);
      toast.success("Booking updated");
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">Booking #{booking.id}</h2>
            <p className="text-sm text-slate-500 mt-0.5">Created {fmtDate(booking.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={booking.bookingStatus} />
            <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 text-sm font-semibold px-4 py-3 border border-red-100">
              {error}
            </div>
          )}

          <section className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
            <div className="flex items-center gap-2 text-orange-800 font-black text-xs uppercase tracking-wider mb-3">
              <Package className="h-4 w-4" />
              Package & travel
            </div>
            <p className="text-lg font-black text-slate-900">{pkg?.title || "—"}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 text-orange-500 shrink-0" />
                <span>
                  <span className="text-slate-400">Travel start:</span>{" "}
                  <strong className="text-slate-900">{fmtDate(booking.travelStartDate)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4 text-orange-500 shrink-0" />
                <span>
                  <span className="text-slate-400">Travelers:</span>{" "}
                  <strong className="text-slate-900">{booking.travelersCount}</strong>
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Customer (booking)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: User, label: "Name", value: booking.customerName },
                { icon: Mail, label: "Email", value: booking.customerEmail || "—" },
                { icon: Phone, label: "Phone", value: booking.customerPhone || "—" },
                {
                  icon: IndianRupee,
                  label: "Total amount",
                  value: formatCurrency(booking.totalAmount),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                    <p className="text-sm font-bold text-slate-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {lead && (
            <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-wider">
                <Target className="h-4 w-4 text-orange-500" />
                Original lead #{lead.id}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Lead status</p>
                  <p className="font-bold text-slate-900 capitalize">{lead.status}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Source</p>
                  <p className="font-bold text-slate-900 capitalize">{lead.source || "—"}</p>
                </div>
                {lead.destinationInterest && (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Destination interest</p>
                    <p className="font-bold text-slate-900">{lead.destinationInterest.title}</p>
                  </div>
                )}
                {lead.message && (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Message
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap mt-1">{lead.message}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Assigned member (during lead stage)
                </p>
                {assignee ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-slate-400">Name:</span>{" "}
                      <strong className="text-slate-900">{assignee.name}</strong>
                    </p>
                    <p>
                      <span className="text-slate-400">Email:</span>{" "}
                      <strong className="text-slate-900">{assignee.email || "—"}</strong>
                    </p>
                    <p className="sm:col-span-2">
                      <span className="text-slate-400">Phone:</span>{" "}
                      <strong className="text-slate-900">{assignee.phone || "—"}</strong>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 font-medium">No assignee on this lead.</p>
                )}
              </div>
            </section>
          )}

          {booking.notes && (
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Booking notes</h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-xl p-4 border border-slate-100">
                {booking.notes}
              </p>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <CreditCard className="h-4 w-4 text-orange-500" />
              Update status
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Booking status</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                >
                  {BOOKING_STATUS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Payment status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                >
                  {PAYMENT_STATUS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Use <strong>Cancelled</strong> when the customer cancels after confirmation. Lead record stays for history;
              this only updates the booking row.
            </p>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-black disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
