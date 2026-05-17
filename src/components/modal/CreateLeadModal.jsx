"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const INITIAL_FORM_STATE = {
  fullName: "",
  phone: "",
  email: "",
  destinationInterest: "",
  travelDate: "",
  numberOfPeople: "",
  budget: "",
  message: "",
  days: "",
  night: "",
  source: "phone",
  status: "new",
  assignee_to: "",
};

function CreateLeadModal({ isOpen, onClose, onSuccess, editingLead = null }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch members and packages
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [membersRes, packagesRes] = await Promise.all([
          fetch("/api/admin/members"),
          fetch("/api/packages?activeOnly=1"),
        ]);
        
        const membersData = await membersRes.json();
        const packagesData = await packagesRes.json();
        
        setMembers(membersData);
        setPackages(packagesData);
      } catch (error) {
        console.error("Failed to fetch modal data", error);
        toast.error("Could not load form data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Sync formData when editingLead changes or modal opens
  useEffect(() => {
    if (editingLead) {
      setFormData({
        ...editingLead,
        travelDate: editingLead.travelDate
          ? new Date(editingLead.travelDate).toISOString().split("T")[0]
          : "",
        assignee_to: editingLead.assignee?.id || editingLead.assignedTo || "",
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [editingLead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = "/api/admin/leads";
      const method = editingLead ? "PUT" : "POST";
      const body = editingLead ? { ...formData, id: editingLead.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.ok) {
        if (onSuccess) onSuccess(result);
        onClose();
        toast.success(editingLead ? "Lead updated" : "Lead created");
      } else {
        toast.error(result.error || "Could not save lead");
      }
    } catch (error) {
      console.error("Failed to save lead", error);
      toast.error("Could not save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-slate-900">
              {editingLead ? "Edit Lead Details" : "Add Manual Lead"}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Fill in traveler information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 space-y-5 sm:space-y-6"
        >
          {isLoadingData && (
            <div className="flex items-center justify-center py-4 text-orange-500 gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Loading packages & staff...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Full Name
              </label>
              <input
                required
                type="text"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Phone Number
              </label>
              <input
                required
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Package Interest
              </label>
              <select
                value={formData.destinationInterest || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationInterest: e.target.value,
                  })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              >
                <option value="">-- Select Package --</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} ({pkg.location})
                  </option>
                ))}
                <option value="other">Other / Custom</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Travel Date
              </label>
              <input
                type="date"
                value={formData.travelDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, travelDate: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Budget (INR)
              </label>
              <input
                type="number"
                value={formData.budget || ""}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Number of People
              </label>
              <input
                type="number"
                value={formData.numberOfPeople || ""}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfPeople: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Days
              </label>
              <input
                type="number"
                value={formData.days || ""}
                onChange={(e) =>
                  setFormData({ ...formData, days: e.target.value })
                }
                placeholder="No. of days"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Nights
              </label>
              <input
                type="number"
                value={formData.night || ""}
                onChange={(e) =>
                  setFormData({ ...formData, night: e.target.value })
                }
                placeholder="No. of nights"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Notes / Requirements
            </label>
            <textarea
              rows="3"
              value={formData.message || ""}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium resize-none text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Source
              </label>
              <select
                value={formData.source || "phone"}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium text-sm"
              >
                <option value="phone">Phone</option>
                <option value="website">Website</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="referral">Referral</option>
                <option value="walk_in">Walk-in</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status
              </label>
              <select
                value={formData.status || "new"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium text-sm"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-orange-600">
                Assign To Staff
              </label>
              <select
                value={formData.assignee_to || ""}
                onChange={(e) =>
                  setFormData({ ...formData, assignee_to: e.target.value })
                }
                className="w-full px-5 py-3 rounded-2xl border border-orange-200 bg-orange-50/30 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium text-sm"
              >
                <option value="">-- Unassigned --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors order-2 sm:order-1 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-3 rounded-2xl font-bold text-sm bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all order-1 sm:order-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingLead ? (
                "Update Lead"
              ) : (
                "Add Lead"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLeadModal;
