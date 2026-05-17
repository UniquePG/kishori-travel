"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, User, Calendar, MapPin, Tag, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MemberLeadsModal({ member, onClose }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchLeads();
    }
  }, [member]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${member.id}/leads`);
      if (!res.ok) {
        toast.error("Could not load assigned leads");
        setLeads([]);
      } else {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      }

    } catch (error) {
      console.error("Failed to fetch leads", error);
      toast.error("Could not load assigned leads");
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    new: "bg-blue-50 text-blue-600 border-blue-100",
    contacted: "bg-purple-50 text-purple-600 border-purple-100",
    qualified: "bg-indigo-50 text-indigo-600 border-indigo-100",
    proposal_sent: "bg-orange-50 text-orange-600 border-orange-100",
    negotiation: "bg-amber-50 text-amber-600 border-amber-100",
    won: "bg-emerald-50 text-emerald-600 border-emerald-100",
    lost: "bg-red-50 text-red-600 border-red-100",
    dropped: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const statusStats = Array.isArray(leads) ? leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {}) : {};


  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-60 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl  sm:text-2xl font-serif text-slate-900">{member.name}'s Assigned Leads</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">Tracking {leads.length} active opportunities</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Loading leads data...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-2">
                <AlertCircle className="h-8 w-8" />
              </div>
              <p className="text-slate-900 font-semibold text-lg">No Leads Assigned</p>
              <p className="text-slate-500 text-sm max-w-xs">This team member currently has no leads assigned to them.</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Total Assigned</p>
                  <p className="text-2xl font-semibold text-slate-900">{leads.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600/60 mb-1">Won/Closed</p>
                  <p className="text-2xl font-semibold text-emerald-600">{statusStats.won || 0}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-600/60 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {leads.length - (statusStats.won || 0) - (statusStats.lost || 0) - (statusStats.dropped || 0)}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600/60 mb-1">New Leads</p>
                  <p className="text-2xl font-bold text-indigo-600">{statusStats.new || 0}</p>
                </div>
              </div>

              {/* Leads List */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Lead Breakdown & Progress
                </h3>
                
                <div className="grid gap-4">
                  {leads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">{lead.fullName}</h4>
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                              statusColors[lead.status] || "bg-slate-50 text-slate-600 border-slate-100"
                            )}>
                              {lead.status.replace("_", " ")}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-y-2 gap-x-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {lead.destinationInterest?.title || "Not Specified"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "TBD"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Tag className="h-3.5 w-3.5 text-slate-400" />
                              Source: {lead.source}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                           <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Budget</p>
                              <p className="font-semibold text-slate-900">₹{parseFloat(lead.budget || 0).toLocaleString()}</p>
                           </div>
                           <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(lead.createdAt).toLocaleDateString()}
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
