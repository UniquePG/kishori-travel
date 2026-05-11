"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, 
  Users, DollarSign, MessageSquare, Clock, CheckCircle2,
  Save, AlertCircle
} from "lucide-react";

export default function LeadDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const fetchLead = async () => {
    try {
      const res = await fetch("/api/member/leads");
      const data = await res.json();
      const currentLead = data.find(l => l.id === params.id);
      if (currentLead) {
        setLead(currentLead);
        setStatus(currentLead.status);
      } else {
        router.push("/member/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch lead", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/member/leads/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        setNote("");
        fetchLead();
        alert("Lead updated successfully");
      }
    } catch (error) {
      alert("Failed to update lead");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading details...</div>;
  if (!lead) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold transition-colors group"
      >
        <div className="p-2 rounded-full bg-white group-hover:bg-slate-100 border border-slate-100 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[5rem] -z-0 opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500 text-white p-3 rounded-2xl">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif text-slate-900">{lead.full_name}</h1>
                  <p className="text-slate-500 font-medium">Inquiry from {lead.source}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-500" />
                      {lead.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-orange-500" />
                      {lead.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination</p>
                    <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {lead.destination_interest || "Flexible"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Travel Date</p>
                    <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      {lead.travel_date ? new Date(lead.travel_date).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                </div>
              </div>

              {lead.message && (
                <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Requirements & History
                  </p>
                  <div className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {lead.message}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Update Status */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-orange-500" />
              Update Lead
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-white"
                >
                  <option className="bg-slate-900" value="new">New Inquiry</option>
                  <option className="bg-slate-900" value="contacted">Contacted</option>
                  <option className="bg-slate-900" value="qualified">Qualified</option>
                  <option className="bg-slate-900" value="proposal_sent">Proposal Sent</option>
                  <option className="bg-slate-900" value="negotiation">In Negotiation</option>
                  <option className="bg-slate-900" value="won">Booking Won</option>
                  <option className="bg-slate-900" value="lost">Lead Lost</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Internal Note</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What happened on the call?"
                  rows="4"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-white resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? <Clock className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Save Updates
              </button>
            </form>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h4 className="font-bold text-sm uppercase tracking-widest">Reminder</h4>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Always update the status immediately after talking to the traveler to keep the pipeline accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
