"use client";

import { useState, useEffect } from "react";
import { Edit3, Trash2, MapPin, Clock, Plus, X } from "lucide-react";
import { formatCurrency } from "../../lib/utils";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    imageURL: "",
    category: "Luxury",
    tag: "",
    itinerary: []
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({ ...pkg });
    } else {
      setEditingPackage(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        duration: "",
        location: "",
        imageURL: "",
        category: "Luxury",
        tag: "",
        itinerary: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: "", activity: "" }]
    });
  };

  const removeItineraryDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    // Reassign day numbers
    newItinerary.forEach((item, i) => {
      item.day = i + 1;
    });
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure price is a number
    const payload = {
      ...formData,
      price: Number(formData.price)
    };

    try {
      if (editingPackage) {
        const res = await fetch(`/api/packages/${editingPackage.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        setPackages(packages.map(p => p.id === updated.id ? updated : p));
      } else {
        const res = await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        setPackages([...packages, created]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save package", error);
      alert("Failed to save package");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await fetch(`/api/packages/${id}`, { method: "DELETE" });
        setPackages(packages.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Failed to delete package", error);
        alert("Failed to delete package");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500">Loading packages...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Manage Tour Packages</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all select-none active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Package</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          No packages found. Add one to get started.
        </div>
      ) : (
        <>
          {/* Mobile: Card list */}
          <div className="space-y-3 md:hidden">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="h-14 w-14 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 shrink-0">
                  <img src={pkg.imageURL || "https://placehold.co/400"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{pkg.title}</p>
                  <p className="text-[10px] text-orange-500 font-bold uppercase">{pkg.category}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{pkg.location}</span>
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(pkg.price)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => handleOpenModal(pkg)} className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="pb-4 pt-2 pl-2">Package</th>
                  <th className="pb-4 pt-2">Location</th>
                  <th className="pb-4 pt-2">Price</th>
                  <th className="pb-4 pt-2">Duration</th>
                  <th className="pb-4 pt-2 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-slate-100 shrink-0">
                          <img src={pkg.imageURL || "https://placehold.co/400"} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{pkg.title}</div>
                          <div className="text-[10px] text-orange-500 font-bold uppercase tracking-tight">{pkg.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{pkg.location}</div>
                    </td>
                    <td className="py-4 font-bold text-slate-900">{formatCurrency(pkg.price)}</td>
                    <td className="py-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{pkg.duration}</div>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(pkg)} className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(pkg.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingPackage ? "Edit Package" : "Add New Package"}</h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Package Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Royal Rajasthan" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Rajasthan, India" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Price (INR)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. 25000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Duration</label>
                  <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. 5N / 6D" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm">
                    <option value="Luxury">Luxury</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Tag (Optional)</label>
                  <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Best Seller" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Image</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input type="url" value={formData.imageURL.startsWith('data:') ? '' : formData.imageURL} onChange={e => setFormData({...formData, imageURL: e.target.value})} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="Image URL (https://...)" />
                    <div className="flex items-center justify-center relative px-2">
                      <span className="text-sm font-medium text-slate-500">OR</span>
                    </div>
                    <div className="relative flex-1">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex items-center justify-center w-full h-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm hover:bg-slate-100 transition-colors">
                        {formData.imageURL.startsWith('data:') ? 'Local Image Selected' : 'Upload Local Image'}
                      </div>
                    </div>
                  </div>
                  {formData.imageURL && (
                    <div className="mt-2 h-32 w-48 rounded-lg overflow-hidden border border-slate-200">
                      <img src={formData.imageURL} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm resize-none" placeholder="Short description of the package..."></textarea>
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-700">Itinerary</label>
                  <button type="button" onClick={addItineraryDay} className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                    + Add Day
                  </button>
                </div>
                
                {formData.itinerary.length === 0 ? (
                  <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No itinerary days added.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.itinerary.map((day, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 group">
                        <div className="w-16 shrink-0 text-xs font-bold text-slate-400 pt-3">
                          DAY {day.day}
                        </div>
                        <div className="flex-1 space-y-3">
                          <input required type="text" value={day.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm font-medium" placeholder="Day Title (e.g. Arrival in Jaipur)" />
                          <textarea required rows="2" value={day.activity} onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm resize-none" placeholder="Activities..."></textarea>
                        </div>
                        <button type="button" onClick={() => removeItineraryDay(index)} className="opacity-0 group-hover:opacity-100 shrink-0 self-start p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-sm bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all">
                  {editingPackage ? "Save Changes" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
