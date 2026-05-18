/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  MessageSquare,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSourceIcon } from "@/lib/helpers";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const statusStyles = {
  new: "bg-blue-50 text-blue-700 ring-blue-100",
  contacted: "bg-purple-50 text-purple-700 ring-purple-100",
  qualified: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  proposal_sent: "bg-orange-50 text-orange-700 ring-orange-100",
  negotiation: "bg-amber-50 text-amber-700 ring-amber-100",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  lost: "bg-red-50 text-red-700 ring-red-100",
};

function DetailItem({ icon: Icon, label, value, iconNode }) {
  if (!value) return null;
  return (
    <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-white text-slate-400">
          {iconNode ?? (Icon && <Icon className="h-3.5 w-3.5" />)}
        </span>
        <p className="truncate text-sm font-medium text-slate-800 capitalize">{value}</p>
      </div>
    </div>
  );
}

export default function MemberViewLeadModal({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead?.status || "new");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || "new");
      setNote("");
      setSaved(false);
    }
  }, [lead]);

  const hasChanges = status !== lead?.status || note.trim().length > 0;

  const handleUpdate = async () => {
    if (!hasChanges || isSubmitting) return;
    setIsSubmitting(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/member/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      });

      if (res.ok) {
        const updatedLead = await res.json();
        onUpdate(updatedLead);
        setSaved(true);
        setNote("");
        setTimeout(() => setSaved(false), 2500);
        onClose()
      }
    } catch (error) {
      console.error("Failed to update lead", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  const destination = lead.destinationInterest?.title || "General inquiry";
  const travelDate = lead.travelDate
    ? new Date(lead.travelDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const pax = lead.numberOfPeople ? `${lead.numberOfPeople} travelers` : null;
  const sourceLabel = lead.source?.replace(/_/g, " ") || "—";

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-h-[92vh] sm:max-h-[88vh] max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-400">Lead #{lead.id}</p>
            <h2 className="mt-0.5 truncate text-lg font-semibold text-slate-900">{lead.fullName}</h2>
            <span
              className={cn(
                "mt-2 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
                statusStyles[lead.status] || "bg-slate-50 text-slate-600 ring-slate-100"
              )}
            >
              {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label || lead.status}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Contact & trip */}
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DetailItem icon={Phone} label="Phone" value={lead.phone} />
              <DetailItem icon={Mail} label="Email" value={lead.email} />
              <DetailItem icon={MapPin} label="Interest" value={destination} />
              <DetailItem icon={Calendar} label="Travel date" value={travelDate} />
              <DetailItem icon={Users} label="Group size" value={pax} />
              <DetailItem label="Source" value={sourceLabel} iconNode={getSourceIcon(lead.source)} />
            </div>
          </section>

          {lead.message && (
            <div >
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <MessageSquare className="h-3.5 w-3.5" />
                Message
              </h3>
              <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                {lead.message}
              </p>
            </div>
          )}

          {/* Status update */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Update status</h3>
            <div className="mt-3 space-y-3">
              <div>
                <label htmlFor="lead-status" className="sr-only">
                  Status
                </label>
                <select
                  id="lead-status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setSaved(false);
                  }}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full rounded-lg border-0 px-3 py-2.5 text-sm font-medium ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-60",
                    statusStyles[status] || "bg-slate-50 text-slate-700 ring-slate-200"
                  )}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lead-note" className="mb-1.5 block text-xs font-medium text-slate-500">
                  Note <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="lead-note"
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setSaved(false);
                  }}
                  disabled={isSubmitting}
                  placeholder="Brief update from your last interaction…"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4">
          <p className="text-[11px] text-slate-400">
            Updated {new Date(lead.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </p>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <Check className="h-3.5 w-3.5" />
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/80 transition-colors disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isSubmitting || !hasChanges}
              className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
