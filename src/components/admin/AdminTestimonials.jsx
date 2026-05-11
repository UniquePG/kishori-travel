"use client";

import { useState, useEffect } from "react";
import { Trash2, Star, User, Plus, X, Edit3, CheckCircle2, XCircle } from "lucide-react";
import NewDataTable from "../common/NewDataTable";
import { cn } from "@/lib/utils";


export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    rating: 5,
    review: "",
    isActive: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await fetch(`/api/testimonials/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive
        }),
      });
      const updated = await res.json();
      if (res.ok) {
        setTestimonials(testimonials.map(t => t.id === updated.id ? updated : t));
      }
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this review?")) {
      try {
        await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
        setTestimonials(testimonials.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Failed to delete testimonial", error);
      }
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        customerName: item.customerName || "",
        location: item.location || "",
        rating: item.rating || 5,
        review: item.review || "",
        isActive: item.isActive ?? true
      });
    } else {
      setEditingItem(null);
      setFormData({
        customerName: "",
        location: "",
        rating: 5,
        review: "",
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      rating: Number(formData.rating)
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/testimonials/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updatedItem = await res.json();
        setTestimonials(testimonials.map((t) => (t.id === updatedItem.id ? updatedItem : t)));
      } else {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const newItem = await res.json();
        setTestimonials([...testimonials, newItem]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  const columns = [
    {
      key: "customerName",
      label: "Customer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.customerName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.location}</p>
          </div>
        </div>
      )
    },
    {
      key: "review",
      label: "Review",
      render: (row) => (
        <p className="text-sm text-slate-600 line-clamp-2 italic italic max-w-md">
          &ldquo;{row.review}&rdquo;
        </p>
      )
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < row.rating ? "fill-current" : "text-slate-200"}`}
            />
          ))}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
            row.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
          )}
        >
          {row.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {row.isActive ? "Active" : "Inactive"}
        </button>
      )
    },
    {
      key: "actions",
      label: "Actions",

      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredData = testimonials.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.review?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        {/* <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonial Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage what your clients are saying about you.</p>
        </div> */}
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-[#e8611a] hover:bg-[#c14a0e] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      <div className="space-y-4 bg-white border border-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
        <NewDataTable 
          columns={columns}
          rows={filteredData}
          isLoading={isLoading}
          searchPlaceholder="Search testimonials..."
          onSearch={setSearchQuery}
        />
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingItem ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Name</label>
                    <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Mumbai, India" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
                  <select required value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="space-y-1.5">

                  <label className="text-sm font-semibold text-slate-700">Review</label>
                  <textarea required rows="4" value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm resize-none" placeholder="What did they say about the trip?"></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Display Status</label>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, isActive: true})}
                      className={cn(
                        "flex-1 py-3 rounded-2xl text-xs font-bold transition-all border",
                        formData.isActive 
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                      )}
                    >
                      Active
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, isActive: false})}
                      className={cn(
                        "flex-1 py-3 rounded-2xl text-xs font-bold transition-all border",
                        !formData.isActive 
                          ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                      )}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors shadow-md shadow-orange-200">
                  {editingItem ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
