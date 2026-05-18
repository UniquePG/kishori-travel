/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import NewDataTable from "@/components/common/NewDataTable";
import CreateLeadModal from "@/components/modal/CreateLeadModal";
import { getSourceIcon } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Target,
  User,
  Eye,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import LeadViewModal from "@/components/modal/LeadViewModal";

export default function DashboardPage() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [updatingField, setUpdatingField] = useState({ id: null, field: null });

  const handleOpenModal = (lead = null) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleOpenViewModal = (lead) => {
    setViewingLead(lead);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingLead(null);
  };


  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/members");
      if (!res.ok) {
        toast.error("Could not load team members");
        setMembers([]);
      } else {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members", error);
      toast.error("Could not load team members");
    }
  }, [])



  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        toast.error("Could not load dashboard");
        setData({});
      } else {
        const json = await res.json();
        setData(json || {});
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
      toast.error("Could not load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMembers();
  }, [fetchStats, fetchMembers]);

  const handleUpdateLeadField = async (id, field, value) => {
    setUpdatingField({ id, field });
    try {
      const lead = (data.recentLeads || []).find((l) => l.id === id);
      if (!lead) {
        toast.error("Lead not found");
        return;
      }
      const res = await fetch(`/api/admin/leads`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, [field]: value, id })
      });
      const updated = await res.json();
      if (res.ok) {
        setData((prevData) => ({
          ...prevData,
          recentLeads: (prevData.recentLeads || []).map((l) =>
            l.id === updated.id ? updated : l
          ),
        }));
        toast.success("Lead updated successfully")
      } else {
        toast.error(updated?.error || "Could not update lead");
      }
    } catch (error) {
      console.error("Failed to update lead field", error);
      toast.error("Could not update lead");
    } finally {
      setUpdatingField({ id: null, field: null });
    }
  };

  const handleDeleteLead = async (id) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        const res = await fetch(`/api/admin/leads?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setData((prev) => ({
            ...prev,
            recentLeads: prev.recentLeads.filter((l) => l.id !== id),
          }));
          toast.success("Lead deleted");
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.error || "Could not delete lead");
        }
      } catch (error) {
        console.error("Failed to delete lead", error);
        toast.error("Could not delete lead");
      }
    }
  };


  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-50 text-blue-600",
      contacted: "bg-purple-50 text-purple-600",
      qualified: "bg-orange-50 text-orange-600",
      won: "bg-emerald-50 text-emerald-600",
      lost: "bg-red-50 text-red-600",
    };
    return colors[status] || "bg-slate-100 text-slate-500";
  };

  const recentLeadcolumns = [
    {
      key: "fullName",
      label: "Traveler",
      render: (row) => (
        <div className="flex flex-col gap-2">
          {row.fullName}

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone className="h-3 w-3" />
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
            {row.phone}
          </div>
          {row.email && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
              {row.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "package",
      label: "Package",
      render: (row) => (
        <div className="space-y-1">
          {row?.destinationInterest?.title ?  row?.destinationInterest?.title : "Custom Package" }
        </div>
      ),
    },

    {
      key: "source",
      label: "Source",
      render: (row) => (
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5",
            getStatusColor(row.source)
          )}
        >
          {getSourceIcon(row.source)}
          {row.source}
        </span>
      ),
    },

    {
      key: "assignedTo",
      label: "Assigned To",
      render: (row) =>
        updatingField.id === row.id && updatingField.field === "assignedTo" ? (
          <div className="flex items-center justify-center w-full max-w-[120px] py-1.5 text-orange-500">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <select
            value={row.assignee?.id || "0"}
            onChange={(e) => handleUpdateLeadField(row.id, "assignedTo", e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer w-full max-w-[120px]"
          >
            <option value="0">Unassigned</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        ),
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
            onChange={(e) =>
              handleUpdateLeadField(row.id, "status", e.target.value)
            }
            className={cn(
              "text-[10px] font-bold  uppercase tracking-widest rounded-lg px-3 py-1.5 border-none focus:ring-2 transition-all cursor-pointer",
              getStatusColor(row.status),
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
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <div className="text-xs text-slate-400 whitespace-nowrap font-semibold">
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenViewModal(row)}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all"
            title="Edit Lead"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteLead(row.id)}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
            title="Delete Lead"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const getIcon = (name) => {
    switch (name) {
      case "Target": return Target;
      case "Package": return Package;
      case "ImageIcon": return ImageIcon;
      case "MessageSquare": return MessageSquare;
      default: return Target;
    }
  };

  const handleModalSuccess = (result) => {
    if (editingLead) {
      setData((prev) => ({ ...prev, recentLeads: prev.recentLeads.map((l) => (l.id === result.id ? result : l)) }));
    } else {
      setData((prev) => ({ ...prev, recentLeads: [result, ...prev.recentLeads] }));
    }
  };

  const statColors = [
    "bg-blue-50 text-blue-600",
    "bg-orange-50 text-orange-600",
    "bg-purple-50 text-purple-600",
    "bg-emerald-50 text-emerald-600"
  ];

  const borderColors = [
    "border-t-2 border-t-blue-500",
    "border-t-2 border-t-orange-500",
    "border-t-2 border-t-purple-500",
    "border-t-2 border-t-emerald-500"
  ];

  const packagesColumns = [
    {
      key: "details",
      label: "Package",
      render: (pkg) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 shrink-0 shadow-sm">
            <img
              src={pkg.thumbnail || "https://placehold.co/100"}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate max-w-[150px]">{pkg.title}</div>
            <div className="text-[10px] font-semibold text-[#e8611a] uppercase">{pkg.durationDays} Days</div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (pkg) => (
        <div className="flex items-center gap-1 text-[12px] font-semibold text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" />
          {pkg.location}
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (pkg) => (
        <div className="font-semibold text-slate-900 text-xs">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(pkg.currentPrice)}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (pkg) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider",
          pkg.isActive ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"
        )}>
          {pkg.isActive ? "Active" : "Draft"}
        </span>
      ),
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 px-1 sm:px-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {(isLoading ? Array.from({ length: 4 }) : data?.stats)?.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all min-w-0",
              borderColors[index % 4]
            )}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-3 sm:space-y-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-xl" />
                <div className="h-3 bg-slate-50 rounded w-1/2" />
                <div className="h-6 bg-slate-50 rounded w-3/4" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div
                    className={`shrink-0 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${statColors[index % 4]} group-hover:scale-110 transition-transform shadow-sm`}
                  >
                    {(() => {
                      const Icon = getIcon(stat.icon);

                      return <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
                    })()}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-slate-400 text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest mb-0.5 truncate">
                      {stat.title}
                    </h3>

                    <p className="text-base sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Recent Leads Table Section */}
      <div className="space-y-4 bg-white border border-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#e8611a] truncate">
              Recent Leads
            </h3>

            <p className="text-[11px] sm:text-sm text-slate-500">
              Latest travel inquiries
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 bg-[#e8611a] text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-xl shadow-[#e8611a]/20 hover:bg-[#e8611a]/90 hover:shadow-[#e8611a]/20 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Lead Manually
          </button>
        </div>


        <NewDataTable
          columns={recentLeadcolumns}
          rows={data?.recentLeads || []}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Packages Table Section */}
      <div className="space-y-4 bg-white border border-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#e8611a] truncate">
              Recent Packages
            </h3>

            <p className="text-[11px] sm:text-sm text-slate-500">
              Latest tour offerings
            </p>
          </div>

          <Link
            href="/admin/packages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#e8611a] text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-xl shadow-[#e8611a]/20 hover:bg-[#e8611a]/90 hover:shadow-[#e8611a]/20 active:scale-[0.98] transition-all"
          >
            Manage Packages
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <NewDataTable
          columns={packagesColumns}
          rows={data?.recentPackages || []}
          isLoading={isLoading}
        />
      </div>


      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingLead={editingLead}
      />

      <LeadViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        lead={viewingLead}
      />

    </div>
  );
}
