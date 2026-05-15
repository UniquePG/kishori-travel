"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Edit3,
  Trash2,
  Plus,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Filter,
  Search,
  Target,
  MessageSquare,
  Clock,
  Globe,
  Instagram,
  MessageCircle,
  Facebook,
  Store,
  Eye,
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { cn } from "@/lib/utils";
import CreateLeadModal from "@/components/modal/CreateLeadModal";
import LeadViewModal from "@/components/modal/LeadViewModal";
import { getSourceIcon } from "@/lib/helpers";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    fetchLeads();
    fetchMembers();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) {
        toast.error("Could not load leads");
        setLeads([]);
      } else {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
      toast.error("Could not load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
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
  };

  const handleUpdateLeadField = async (id, field, value) => {
    try {
      const lead = leads.find((l) => l.id === id);
      const res = await fetch(`/api/admin/leads`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, [field]: value, id }),
      });
      const updated = await res.json();
      if (res.ok) {
        setLeads(leads.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        toast.error(updated?.error || "Could not update lead");
      }
    } catch (error) {
      console.error("Failed to update lead field", error);
      toast.error("Could not update lead");
    }
  };

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

  const handleModalSuccess = (result) => {
    if (editingLead) {
      setLeads(leads.map((l) => (l.id === result.id ? result : l)));
    } else {
      setLeads([result, ...leads]);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        const res = await fetch(`/api/admin/leads?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setLeads(leads.filter((l) => l.id !== id));
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

  const filteredLeads = leads?.filter(
    (l) =>
      l.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.destinationInterest?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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


  const columns = [
    {
      key: "fullName",
      label: "Traveler Detail",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm border border-orange-100">
            {row?.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm sm:text-base">
              {row.fullName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            </div>
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
      key: "destination",
      label: "Destination",
      render: (row) => (
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            {row.destinationInterest || "General"}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {row.numberOfPeople ? `${row.numberOfPeople} Pax` : "Inquiry"}
          </p>
        </div>
      ),
    },
    {
      key: "source",
      label: "Source",
      render: (row) => (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200",
          )}
        >
          {getSourceIcon(row.source)}
          {row.source}
        </div>
      ),
    },
    {
      key: "assigned_to",
      label: "Assignee",
      render: (row) => (
        <select
          value={row.assignee?.id || ""}
          onChange={(e) =>
            handleUpdateLeadField(row.id, "assignee_to", e.target.value)
          }
          className="text-xs font-bold bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer w-full max-w-[120px]"
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) =>
            handleUpdateLeadField(row.id, "status", e.target.value)
          }
          className={cn(
            "text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 border-none focus:ring-2 transition-all cursor-pointer",
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
      key: "actions",
      label: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenViewModal(row)}
            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 px-1 sm:px-0">
        {/* <div>
          <h3 className="text-2xl font-serif text-slate-900">Lead Pipeline</h3>
          <p className="text-sm text-slate-500">
            Track and assign travel inquiries
          </p>
        </div> */}
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Lead Manually
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        isLoading={isLoading}
        searchPlaceholder="Search leads..."
        onSearch={setSearchQuery}
      />

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
