"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Image as ImageIcon, Upload, Loader2, Check, Info, DollarSign, MapPin, Clock, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PackageModal({ isOpen, onClose, onSave, editingPackage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    location: "",
    durationDays: 1,
    currentPrice: "",
    oldPrice: "",
    thumbnail: "",
    isFeatured: false,
    isActive: true,
    inclusions: [],
    itinerary: [],
    terms: [""]
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        ...editingPackage,
        currentPrice: editingPackage.currentPrice?.toString() || "",
        oldPrice: editingPackage.oldPrice?.toString() || "",
        inclusions: editingPackage.inclusions || [],
        itinerary: editingPackage.itinerary || [],
        terms: editingPackage.terms?.map(t => t.content) || [""]
      });
      setPreviewImage(editingPackage.thumbnail);
    } else {
      setFormData({
        title: "",
        slug: "",
        shortDescription: "",
        description: "",
        location: "",
        durationDays: 1,
        currentPrice: "",
        oldPrice: "",
        thumbnail: "",
        isFeatured: false,
        isActive: true,
        inclusions: [
          { type: "included", title: "Accommodation" },
          { type: "included", title: "Breakfast" },
          { type: "excluded", title: "Personal Expenses" }
        ],
        itinerary: [
          { dayNumber: 1, title: "Arrival", description: "Arrive at the destination and check-in." }
        ],
        terms: [""]
      });
      setPreviewImage(null);
      setSelectedFile(null);
    }
    setActiveTab("basic");
  }, [editingPackage, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { 
        dayNumber: prev.itinerary.length + 1, 
        title: "", 
        description: "" 
      }]
    }));
  };

  const removeItineraryDay = (index) => {
    setFormData(prev => {
      const newItinerary = prev.itinerary.filter((_, i) => i !== index);
      return {
        ...prev,
        itinerary: newItinerary.map((item, i) => ({ ...item, dayNumber: i + 1 }))
      };
    });
  };

  const updateItineraryItem = (index, field, value) => {
    setFormData(prev => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const addInclusion = (type) => {
    setFormData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, { type, title: "" }]
    }));
  };

  const removeInclusion = (index) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const updateInclusion = (index, title) => {
    setFormData(prev => {
      const newInclusions = [...prev.inclusions];
      newInclusions[index] = { ...newInclusions[index], title };
      return { ...prev, inclusions: newInclusions };
    });
  };

  const addTerm = () => {
    setFormData(prev => ({
      ...prev,
      terms: [...prev.terms, ""]
    }));
  };

  const removeTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index)
    }));
  };

  const updateTerm = (index, value) => {
    setFormData(prev => {
      const newTerms = [...prev.terms];
      newTerms[index] = value;
      return { ...prev, terms: newTerms };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // If we have a selected file, append it
      if (selectedFile) {
        formDataToSend.append("thumbnail", selectedFile);
      }
      
      // Append the rest of the data as a JSON string
      formDataToSend.append("data", JSON.stringify(formData));

      const url = editingPackage 
        ? `/api/packages/${editingPackage.id}` 
        : "/api/packages";
      
      const method = editingPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save package");
      }

      const savedPackage = await res.json();
      onSave(savedPackage);
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Info },
    { id: "pricing", label: "Pricing & Media", icon: DollarSign },
    { id: "itinerary", label: "Itinerary", icon: Clock },
    { id: "inclusions", label: "Inclusions", icon: Check },
    { id: "terms", label: "Terms", icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {editingPackage ? "Edit Package" : "Create New Package"}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Fill in the details to publish your tour package.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-2xl transition-all active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-slate-50/50 gap-1 shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-white text-orange-600 shadow-sm shadow-orange-500/10" 
                  : "text-slate-500 hover:bg-white/50"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar">
          
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Package Title</label>
                  <input 
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Royal Rajasthan Heritage Tour"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      required
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Jaipur, Rajasthan"
                      className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Duration (Days)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      required
                      type="number"
                      name="durationDays"
                      min="1"
                      value={formData.durationDays}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-6 pb-2 pl-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Featured Package</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-green-600 transition-colors">Active</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Short Description</label>
                <textarea 
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="A catchy 1-2 sentence summary..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Description</label>
                <textarea 
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Detailed information about the package..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900 resize-none"
                />
              </div>
            </div>
          )}

          {/* Pricing & Media Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Current Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input 
                      required
                      type="number"
                      name="currentPrice"
                      value={formData.currentPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Old Price (₹) - Optional</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input 
                      type="number"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 ml-1">Package Thumbnail</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option 1: Paste Image URL</span>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                          name="thumbnail"
                          value={typeof formData.thumbnail === 'string' ? formData.thumbnail : ''}
                          onChange={handleInputChange}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                        />
                      </div>
                    </div>
                    
                    <div className="relative flex items-center gap-4 py-2">
                      <div className="flex-1 h-px bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                      <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option 2: Upload File (Cloudinary)</span>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full group flex flex-col items-center justify-center gap-3 py-8 px-6 bg-orange-50/50 border-2 border-dashed border-orange-100 rounded-[2rem] hover:bg-orange-50 hover:border-orange-300 transition-all active:scale-[0.98]"
                      >
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-700">Choose a file</p>
                          <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or WEBP (Max 2MB)</p>
                        </div>
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview</span>
                    <div className="relative aspect-video rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                      {previewImage ? (
                        <>
                          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setSelectedFile(null);
                              setFormData(prev => ({ ...prev, thumbnail: "" }));
                            }}
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur shadow-lg text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <ImageIcon className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                          <p className="text-sm font-bold text-slate-300">No Image Selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === "itinerary" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Tour Itinerary</h3>
                <button 
                  type="button" 
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Day
                </button>
              </div>

              {formData.itinerary.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                  <Clock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">No itinerary days added yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.itinerary.map((day, idx) => (
                    <div key={idx} className="group relative bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-orange-200 rounded-[2rem] p-6 transition-all">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm ring-4 ring-orange-50">
                            {day.dayNumber}
                          </div>
                          <div className="flex-1 w-0.5 bg-slate-100 my-2 group-last:hidden"></div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <input 
                              required
                              placeholder="Day Title (e.g. Exploring the Pink City)"
                              value={day.title}
                              onChange={(e) => updateItineraryItem(idx, "title", e.target.value)}
                              className="flex-1 bg-transparent border-none text-base font-black text-slate-900 placeholder:text-slate-300 focus:ring-0 p-0"
                            />
                            <button 
                              type="button"
                              onClick={() => removeItineraryDay(idx)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <textarea 
                            required
                            placeholder="Describe activities for this day..."
                            value={day.description}
                            onChange={(e) => updateItineraryItem(idx, "description", e.target.value)}
                            rows="2"
                            className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-600 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all resize-none shadow-sm shadow-slate-200/50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inclusions Tab */}
          {activeTab === "inclusions" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-black text-slate-900">What's Included</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => addInclusion("included")}
                      className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.inclusions.filter(i => i.type === "included").map((item, idx) => {
                      const realIdx = formData.inclusions.findIndex(inc => inc === item);
                      return (
                        <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                          <input 
                            required
                            placeholder="e.g. AC Private Vehicle"
                            value={item.title}
                            onChange={(e) => updateInclusion(realIdx, e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white outline-none transition-all"
                          />
                          <button 
                            type="button"
                            onClick={() => removeInclusion(realIdx)}
                            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                        <X className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-black text-slate-900">What's Excluded</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => addInclusion("excluded")}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.inclusions.filter(i => i.type === "excluded").map((item, idx) => {
                      const realIdx = formData.inclusions.findIndex(inc => inc === item);
                      return (
                        <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                          <input 
                            required
                            placeholder="e.g. Airfare"
                            value={item.title}
                            onChange={(e) => updateInclusion(realIdx, e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white outline-none transition-all"
                          />
                          <button 
                            type="button"
                            onClick={() => removeInclusion(realIdx)}
                            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Conditions Tab */}
          {activeTab === "terms" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Terms & Conditions</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addTerm}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Term
                </button>
              </div>

              <div className="space-y-4">
                {formData.terms.map((term, idx) => (
                  <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex-1">
                      <input 
                        required
                        placeholder="e.g. 25% non-refundable deposit required"
                        value={term}
                        onChange={(e) => updateTerm(idx, e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                      />
                    </div>
                    {formData.terms.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeTerm(idx)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <p className="text-[10px] text-slate-400 font-medium ml-1 mt-2 flex items-center gap-1.5">
                  <Info className="h-3 w-3" />
                  Each term will be displayed as a separate point in the package details.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-b-[2.5rem]">
          <div className="flex items-center gap-2 text-slate-400">
            {isLoading && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Saving Package...</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
            >
              Discard
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-10 py-3.5 bg-[#e8611a] text-white rounded-2xl text-sm font-black shadow-xl shadow-[#e8611a]/20 hover:bg-[#e8611a]/80 hover:shadow-[#e8611a]/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {isLoading ? "Saving..." : editingPackage ? "Save Changes" : "Publish Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
