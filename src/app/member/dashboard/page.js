"use client";

import { useState, useEffect } from "react";

import { 
  Target, Clock, ArrowRight, CheckCircle2, XCircle, 
  Users, Timer, Trophy, Sparkles, MapPin, Phone
} from "lucide-react";
import Link from "next/link";
import NewDataTable from "@/components/common/NewDataTable";
import { cn } from "@/lib/utils";

export default function MemberDashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, new: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-50 text-blue-600 border-blue-100",
      contacted: "bg-purple-50 text-purple-600 border-purple-100",
      qualified: "bg-orange-50 text-orange-600 border-orange-100",
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
      key: "interest",
      label: "Interest",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          <span className="truncate max-w-[150px]">{row.destinationInterest || "General"}</span>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          getStatusColor(row.status)
        )}>
          {row.status}
        </div>
      )
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (row) => (
        <Link 
          href={`/member/leads?id=${row.id}`}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-500 transition-all active:scale-95 whitespace-nowrap"
        >
          Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
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
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-serif text-slate-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-500 text-balance">Track your performance and manage your assigned leads</p>
      </div>

      {/* Stats Grid */}
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

      {/* Recent Leads Table */}
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
          />
        </div>
      </div>
    </div>
  );
}

