/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Clock, MapPin, Phone, Mail, 
  Search, Eye, Loader2
} from "lucide-react";
import NewDataTable from "@/components/common/NewDataTable";
import MemberViewLeadModal from "@/components/member/modals/MemberViewLeadModal";
import { cn } from "@/lib/utils";
import { getSourceIcon } from "@/lib/helpers";
import { useSearchParams } from "next/navigation";

export default function MemberLeads() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingField, setUpdatingField] = useState({ id: null, field: null });
  const searchParams = useSearchParams();
  const leadIdFromUrl = searchParams.get("id");

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/member/leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setIsLoading(false);
    }
  },[])

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (leadIdFromUrl && leads.length > 0) {
      const lead = leads.find(l => l.id.toString() === leadIdFromUrl);
      if (lead) setSelectedLead(lead);
    }
  }, [leadIdFromUrl, leads]);



  const handleUpdateSuccess = (updatedLead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? { ...l, ...updatedLead } : l))
    );
    setSelectedLead((prev) =>
      prev?.id === updatedLead.id ? { ...prev, ...updatedLead } : prev
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-50 text-blue-600 border-blue-100",
      contacted: "bg-purple-50 text-purple-600 border-purple-100",
      qualified: "bg-indigo-50 text-indigo-600 border-indigo-100",
      proposal_sent: "bg-orange-50 text-orange-600 border-orange-100",
      negotiation: "bg-amber-50 text-amber-600 border-amber-100",
      won: "bg-emerald-50 text-emerald-600 border-emerald-100",
      lost: "bg-red-50 text-red-600 border-red-100",
    };
    return colors[status] || "bg-slate-100 text-slate-500 border-slate-200";
  };

  const handleUpdateLeadField = async (id, field, value) => {
    setUpdatingField({ id, field });
    try {
      const res = await fetch(`/api/member/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const updated = await res.json();
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
        );
        setSelectedLead((prev) =>
          prev?.id === updated.id ? { ...prev, ...updated } : prev
        );
      }
    } catch (error) {
      console.error("Failed to update lead field", error);
    } finally {
      setUpdatingField({ id: null, field: null });
    }
  };

  const columns = [
    {
      key: "traveler",
      label: "Traveler",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-100 shrink-0">
            {row.fullName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{row.fullName}</p>
            <div className="flex items-center gap-2 mt-0.5">
               <Clock className="h-2.5 w-2.5 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(row.createdAt).toLocaleDateString()}
               </span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Phone className="h-3 w-3 text-slate-400" />
            {row.phone}
          </div>
          {row.email && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Mail className="h-3 w-3 text-slate-400" />
              {row.email}
            </div>
          )}
        </div>
      )
    },
    {
      key: "destination",
      label: "Interest",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          <span className="truncate max-w-[150px]">{row.destinationInterest?.title || "General Inquiry"}</span>
        </div>
      )
    },
    {
      key: "source",
      label: "Source",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {getSourceIcon(row.source)}
          {row.source?.replace("_", " ") || "—"}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) =>
        updatingField.id === row.id && updatingField.field === "status" ? (
          <div className="flex items-center justify-center py-1.5 text-orange-500">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <select
            value={row.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              handleUpdateLeadField(row.id, "status", e.target.value)
            }
            className={cn(
              "text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 border-none focus:ring-2 transition-all cursor-pointer outline-none",
              getStatusColor(row.status)
            )}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal_sent">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        ),
    },

    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <button 
          onClick={() => setSelectedLead(row)}
          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-orange-500 hover:text-white transition-all active:scale-90"
        >
          <Eye className="h-4 w-4" />
        </button>
      )
    }
  ];

  const filteredLeads = leads.filter(l => 
    l.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery) ||
    l.destinationInterest?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-900">Lead Pipeline</h1>
          <p className="text-sm text-slate-500">Manage and track your assigned inquiries</p>
        </div>

        <div className="w-full md:w-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-2 sm:p-4">
        <NewDataTable 
          columns={columns}
          rows={filteredLeads}
          loading={isLoading}
          emptyMessage="No leads match your search"
          rowKey="id"
          onRowClick={(row) => setSelectedLead(row)}
        />
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <MemberViewLeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
