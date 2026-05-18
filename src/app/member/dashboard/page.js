/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect, useCallback } from "react";

import { 
  Clock, ArrowRight, 
  Users, Timer, Trophy, Sparkles, MapPin, Phone, Mail, Eye, Loader2
} from "lucide-react";
import Link from "next/link";
import NewDataTable from "@/components/common/NewDataTable";
import MemberViewLeadModal from "@/components/member/modals/MemberViewLeadModal";
import { getSourceIcon } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MemberDashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, new: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingField, setUpdatingField] = useState({ id: null, field: null });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch("/api/member/leads"),
        fetch("/api/member/stats")
      ]);
      
      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();
      
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  },[])

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);



  const handleUpdateSuccess = (updatedLead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? { ...l, ...updatedLead } : l))
    );
    setSelectedLead((prev) =>
      prev?.id === updatedLead.id ? { ...prev, ...updatedLead } : prev
    );
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
        toast.success("Lead updated successfully")
      }
    } catch (error) {
      console.error("Failed to update lead field", error);
    } finally {
      setUpdatingField({ id: null, field: null });
    }
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

  const columns = [
    {
      key: "traveler",
      label: "Traveler",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-100 shrink-0">
            {row.fullName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{row.fullName}</p>
            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Clock className="h-2.5 w-2.5" />
              {new Date(row.createdAt).toLocaleDateString()}
            </p>
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
      key: "interest",
      label: "Interest",
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
      label: "",
      className: "text-right",
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLead(row);
          }}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-500 transition-all active:scale-95 whitespace-nowrap"
        >
          Details
          <Eye className="h-3.5 w-3.5" />
        </button>
      )
    }
  ];

  const statCards = [
    { label: "Total Assigned", value: stats.total, icon: Users, color: "blue" },
    { label: "New Leads", value: stats.new, icon: Sparkles, color: "orange" },
    { label: "In Progress", value: stats.pending, icon: Timer, color: "purple" },
    { label: "Won Leads", value: stats.completed, icon: Trophy, color: "emerald" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-serif text-slate-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-500 text-balance">Track your performance and manage your assigned leads</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700",
              `bg-${stat.color}-600`
            )} />
            <div className="relative flex flex-col gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                `bg-${stat.color}-50 text-${stat.color}-600`
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recently Assigned</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Latest inquiries that need attention</p>
          </div>
          <Link
            href="/member/leads"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0 transition-colors"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-2 sm:p-4">
          <NewDataTable
            columns={columns}
            rows={leads.slice(0, 5)}
            loading={isLoading}
            pagination={false}
            emptyMessage="No leads assigned to you yet"
            rowKey="id"
            onRowClick={(row) => setSelectedLead(row)}
          />
        </div>
      </div>

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
