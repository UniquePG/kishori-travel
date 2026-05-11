"use client";

import { useState, useEffect } from "react";
import { 
  Edit3, Trash2, Plus, X, User, Phone, Mail, 
  Shield, ShieldCheck, UserCog, Clock, CheckCircle2, XCircle, TrendingUp 
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { cn } from "@/lib/utils";
import MemberLeadsModal from "./modals/MemberLeadsModal";
import NewDataTable from "../common/NewDataTable";

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingLeadsMember, setViewingLeadsMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    is_active: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/members");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ 
        ...member,
        password: "" // Don't show password
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "member",
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingMember) {
        const res = await fetch(`/api/admin/members`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editingMember.id })
        });
        const updated = await res.json();
        if (res.ok) {
          setMembers(members.map(m => m.id === updated.id ? updated : m));
          handleCloseModal();
        } else {
          alert(updated.error || "Failed to update");
        }
      } else {
        const res = await fetch("/api/admin/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const created = await res.json();
        if (res.ok) {
          setMembers([created, ...members]);
          handleCloseModal();
        } else {
          alert(created.error || "Failed to create");
        }
      }
    } catch (error) {
      console.error("Failed to save member", error);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        const res = await fetch(`/api/admin/members?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          setMembers(members.filter((m) => m.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete member", error);
      }
    }
  };

  const filteredMembers = members?.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Staff Member",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mt-0.5">{row.role}</p>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "Contact Info",
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none">{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Phone className="h-3 w-3 shrink-0" />
              {row.phone}
            </div>
          )}
        </div>
      )
    },
    {
      key: "assigned_leads",
      label: "Assigned Leads",
      render: (row) => (
        <button 
          onClick={() => setViewingLeadsMember(row)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-200 transition-all"
        >
          <TrendingUp className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-500" />
          <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600">{row.assignedLeadsCount || 0}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Leads</span>
        </button>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          row.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {row.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {row.isActive ? "Active" : "Disabled"}
        </div>
      )
    },
    {
      key: "created_at",
      label: "Joined",
      className: "hidden md:table-cell",
      render: (row) => (
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => setViewingLeadsMember(row)}
            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
            title="View Leads"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleOpenModal(row)}
            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all"
            title="Edit Member"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
            title="Delete Member"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 px-1 sm:px-0">
        {/* <div>
          <h3 className="text-2xl font-serif text-slate-900">Team Management</h3>
          <p className="text-sm text-slate-500">Manage staff access and lead assignments</p>
        </div> */}
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#e8611a] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/20 hover:bg-[#c14a0e] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>
      <div className="space-y-4 bg-white border border-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
          
          <NewDataTable 
            columns={columns}
            rows={filteredMembers}
            isLoading={isLoading}
            searchPlaceholder="Search staff..."
            onSearch={setSearchQuery}
          />
      </div>


      {/* Member Leads Modal */}
      {viewingLeadsMember && (
        <MemberLeadsModal 
          member={viewingLeadsMember} 
          onClose={() => setViewingLeadsMember(null)} 
        />
      )}


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-slate-900">{editingMember ? "Edit Account" : "Create Account"}</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Staff member portal access</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone (Optional)</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {editingMember ? "New Password (empty to keep)" : "Password"}
                </label>
                <input 
                  required={!editingMember} 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm">
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button type="button" onClick={() => setFormData({...formData, isActive: true})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${formData.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}`}>Active</button>
                    <button type="button" onClick={() => setFormData({...formData, isActive: false})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${!formData.isActive ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 text-slate-400'}`}>Disabled</button>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors order-2 sm:order-1">
                  Cancel
                </button>
                <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-sm bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-500/20 active:scale-95 transition-all order-1 sm:order-2">
                  {editingMember ? "Update Account" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
