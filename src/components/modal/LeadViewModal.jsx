"use client";

import React from "react";
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Clock,
  ShieldCheck,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSourceIcon } from "@/lib/helpers";

export default function LeadViewModal({ isOpen, onClose, lead }) {
  if (!isOpen || !lead) return null;

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10",
      contacted: "bg-purple-50 text-purple-700 ring-1 ring-purple-700/10",
      qualified: "bg-orange-50 text-orange-700 ring-1 ring-orange-700/10",
      proposal_sent: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10",
      negotiation: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-700/10",
      won: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/10",
      lost: "bg-red-50 text-red-700 ring-1 ring-red-700/10",
    };
    return colors[status] || "bg-slate-50 text-slate-600 ring-1 ring-slate-600/10";
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 group">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />}
        <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value || "—"}</span>
    </div>
  );
  console.log("lead ", lead)

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Compact Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
              {lead.fullName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none mb-1.5">
                {lead.fullName}
              </h2>
              <div className="flex items-center gap-2">
                 <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  getStatusColor(lead.status)
                )}>
                  {lead.status?.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  via {lead.source}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Contact Section */}
            <section>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="h-3 w-3" />
                Contact Details
              </h3>
              <div className="space-y-1">
                <InfoRow icon={Phone} label="Phone" value={lead.phone} />
                <InfoRow icon={Mail} label="Email" value={lead.email} />
                <InfoRow icon={Clock} label="Received" value={new Date(lead.createdAt).toLocaleDateString()} />
              </div>
            </section>

            {/* Trip Section */}
            <section>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Trip Intent
              </h3>
              <div className="space-y-1">
                <InfoRow label="Destination" value={lead.package?.title || lead.destinationInterest?.title || "General"} />
                <InfoRow icon={Calendar} label="Travel Date" value={lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "Flexible"} />
                <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">Duration</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {lead.days || "—"} Days / {lead.night || "—"} Nights
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">Peoples / Budget</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {lead.numberOfPeople || "—"} / {lead.budget ? `₹${new Intl.NumberFormat('en-IN').format(lead.budget)}` : "—"}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Notes Section */}
          <section className="mt-8">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              Requirements & Notes
            </h3>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 min-h-[80px]">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {lead.message || "No specific requirements provided."}
              </p>
            </div>
          </section>

          {/* Staff Assignment */}
          <section className="mt-8 pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between bg-orange-50/40 p-4 rounded-xl border border-orange-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-orange-100 text-orange-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-0.5">Assigned Agent</p>
                    <p className="text-sm font-bold text-slate-900">
                      {lead.assignee ? lead.assignee.name : "Waiting for assignment"}
                    </p>
                  </div>
                </div>
                {lead.assignee && (
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-slate-400">{lead.assignee.email}</p>
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
