"use client";

import { useState } from "react";
import { 
  X, User, Phone, Mail, MapPin, Calendar, 
  Users, MessageSquare, Clock, Shield, 
  Send, AlertCircle, CheckCircle2, Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSourceIcon } from "@/lib/helpers";

export default function MemberViewLeadModal({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead?.status || "new");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/member/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      
      if (res.ok) {
        const updatedLead = await res.json();
        onUpdate(updatedLead);
        onClose();
      }
    } catch (error) {
      console.error("Failed to update lead", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200 shadow-inner">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-slate-900">{lead.fullName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lead ID: #{lead.id}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Assigned to You</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors active:scale-90">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Lead Details */}
            <div className="md:col-span-2 space-y-8">
              {/* Core Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Contact Information</h3>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{lead.phone}</span>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <Mail className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold truncate">{lead.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          Source: <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{getSourceIcon(lead.source)} {lead.source}</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Travel Preferences</h3>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{lead.destinationInterest || "General Inquiry"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">
                          {lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "Flexible Date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{lead.numberOfPeople || "Not Specified"} Pax</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative">
                <MessageSquare className="absolute top-6 right-6 h-5 w-5 text-slate-200" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Inquiry Message</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {lead.message || "No specific requirements mentioned."}
                </p>
              </div>
            </div>

            {/* Right: Actions & Stats */}
            <div className="space-y-6">
              {/* Status Update */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Update Status</h3>
                <div className="space-y-2">
                  {[
                    { id: 'new', label: 'New Lead', color: 'bg-blue-500' },
                    { id: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
                    { id: 'qualified', label: 'Qualified', color: 'bg-orange-500' },
                    { id: 'proposal_sent', label: 'Proposal', color: 'bg-amber-500' },
                    { id: 'won', label: 'Won / Booked', color: 'bg-emerald-500' },
                    { id: 'lost', label: 'Lost', color: 'bg-red-500' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-sm font-bold",
                        status === s.id 
                          ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200 text-slate-500"
                      )}
                    >
                      {s.label}
                      <div className={cn("w-2 h-2 rounded-full", status === s.id ? s.color : "bg-slate-200")} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Input */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Add Internal Note</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Update about your last call or progress..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            Last updated {new Date(lead.updatedAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all"
            >
              Discard
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isSubmitting || (status === lead.status && !note)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
