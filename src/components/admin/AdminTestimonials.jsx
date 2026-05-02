"use client";

import { useState, useEffect } from "react";
import { Trash2, Star, User, Plus, X, Edit3 } from "lucide-react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 5,
    review: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setIsLoading(false);
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
        name: item.name || "",
        location: item.location || "",
        rating: item.rating || 5,
        review: item.review || ""
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        location: "",
        rating: 5,
        review: ""
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

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonial Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage what your clients are saying about you.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Testimonial
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
            No testimonials found.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="group p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start gap-4 hover:bg-white hover:shadow-sm hover:border-orange-100 transition-all relative"
            >
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < t.rating ? "fill-current" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {t.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-red-50 group-hover:text-red-500 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
            </div>
          ))
        )}
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
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. John Doe" />
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
