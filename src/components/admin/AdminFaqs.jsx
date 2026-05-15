"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Edit3, Trash2, Plus, X, HelpCircle, ChevronDown, 
  ChevronUp, CheckCircle2, XCircle, Clock 
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { cn } from "@/lib/utils";
import NewDataTable from "../common/NewDataTable";

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/faqs");
      if (!res.ok) {
        toast.error("Could not load FAQs");
        setFaqs([]);
      } else {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
      toast.error("Could not load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ ...faq });
    } else {
      setEditingFaq(null);
      setFormData({
        question: "",
        answer: "",
        sort_order: faqs.length,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        const res = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const updated = await res.json();
        if (!res.ok) {
          toast.error(updated?.error || "Could not save FAQ");
          return;
        }
        setFaqs(faqs.map(f => f.id === updated.id ? updated : f));
        toast.success("FAQ updated");
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const created = await res.json();
        if (!res.ok) {
          toast.error(created?.error || "Could not create FAQ");
          return;
        }
        setFaqs([...faqs, created]);
        toast.success("FAQ created");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save FAQ", error);
      toast.error("Could not save FAQ");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
        if (res.ok) {
          setFaqs(faqs.filter((f) => f.id !== id));
          toast.success("FAQ deleted");
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.error || "Could not delete FAQ");
        }
      } catch (error) {
        console.error("Failed to delete FAQ", error);
        toast.error("Could not delete FAQ");
      }
    }
  };

  const filteredFaqs = faqs?.filter(f => 
    f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "question",
      label: "Question & Answer",
      render: (row) => (
        <div className="max-w-md">
          <p className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{row.question}</p>
          <p className="text-xs text-slate-500 line-clamp-2 sm:line-clamp-none">{row.answer}</p>
        </div>
      )
    },
    {
      key: "sortOrder",
      label: "Order",
      className: "hidden sm:table-cell",
      render: (row) => (
        <div className="flex items-center gap-2 font-bold text-slate-600">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs border border-slate-100">
            {row.sortOrder}
          </div>
        </div>
      )
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          row.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
        )}>
          {row.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {row.isActive ? "Active" : "Inactive"}
        </div>
      )
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
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
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-4 px-1 sm:px-0">
        {/* <div>
          <h3 className="text-2xl font-serif text-slate-900">FAQ Management</h3>
          <p className="text-sm text-slate-500">Manage frequently asked questions</p>
        </div> */}
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#e8611a] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/20 hover:bg-[#c14a0e] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add New FAQ
        </button>
      </div>

      <div className="space-y-4 bg-white border border-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
        <NewDataTable 
          columns={columns}
          rows={filteredFaqs}
          isLoading={isLoading}
          searchPlaceholder="Search FAQs..."
          onSearch={setSearchQuery}
        />
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
            <div className="bg-white border-b border-slate-100 px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-slate-900">{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Help travelers with clear answers</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 sm:space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Question</label>
                <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm" placeholder="e.g. What is your refund policy?" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Answer</label>
                <textarea required rows="4" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium resize-none text-sm" placeholder="Provide a detailed answer..."></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sort Order</label>
                  <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</label>
                  <div className="flex items-center gap-3 mt-1 sm:mt-2">
                    <button type="button" onClick={() => setFormData({...formData, is_active: true})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${formData.is_active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      Active
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, is_active: false})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${!formData.is_active ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors order-2 sm:order-1">
                  Cancel
                </button>
                <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-sm bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all order-1 sm:order-2">
                  {editingFaq ? "Save Changes" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
