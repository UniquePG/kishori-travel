"use client";

import { useState, useEffect } from "react";
import { Trash2, Film, Image as ImageIcon, ExternalLink, Plus, X, Edit3 } from "lucide-react";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaType: "photo",
    mediaUrl: "",
    thumbnailUrl: "",
    category: "General"
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this media?")) {
      try {
        const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
        if (res.ok) {
          setItems(items.filter((i) => i.id !== id));
        } else {
          alert("Failed to delete media");
        }
      } catch (error) {
        console.error("Failed to delete media", error);
      }
    }
  };

  const handleOpenModal = (item = null) => {
    setError("");
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || "",
        description: item.description || "",
        mediaType: item.mediaType || "photo",
        mediaUrl: item.mediaUrl || "",
        thumbnailUrl: item.thumbnailUrl || "",
        category: item.category || "General"
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        mediaType: "photo",
        mediaUrl: "",
        thumbnailUrl: "",
        category: "General"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError("");
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    
    // Size Validations
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const fileSizeMB = file.size / (1024 * 1024);

    if (isImage && fileSizeMB > 5) {
      setError("Image file size cannot exceed 5MB.");
      return;
    }
    if (isVideo && fileSizeMB > 20) {
      setError("Video file size cannot exceed 20MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [field]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = editingItem ? `/api/gallery/${editingItem.id}` : "/api/gallery";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save gallery item");
      }

      const savedItem = await res.json();
      
      if (editingItem) {
        setItems(items?.map((i) => (i.id === savedItem.id ? savedItem : i)));
      } else {
        setItems([savedItem, ...items]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving gallery item:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

   console.log("items ", items)
  const photoCount = items?.filter(i => i.mediaType !== "video").length;
  const videoCount = items?.filter(i => i.mediaType === "video").length;
  const filteredItems = mediaFilter === "all" ? items
    : mediaFilter === "video" ? items?.filter(i => i.mediaType === "video")
    : items?.filter(i => i.mediaType !== "video");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery Management</h1>
          <p className="text-slate-500 text-sm mt-1">Add or manage photos and videos for your website.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Media
        </button>
      </div>

      {/* Media Type Toggle */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[
          { key: "all",   label: "All Media",  count: items.length },
          { key: "photo", label: "Photos",     count: photoCount },
          { key: "video", label: "Videos",     count: videoCount },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setMediaFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              mediaFilter === key
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {key === "photo" ? <ImageIcon className="h-4 w-4" /> : key === "video" ? <Film className="h-4 w-4" /> : null}
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              mediaFilter === key ? "bg-orange-100 text-orange-600" : "bg-slate-200 text-slate-500"
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-16 text-slate-400">
          {mediaFilter === "photo" ? <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-30" /> : <Film className="h-10 w-10 mx-auto mb-3 opacity-30" />}
          <p className="font-medium">No {mediaFilter === "all" ? "media" : mediaFilter + "s"} found</p>
          <p className="text-sm mt-1">Add some using the button above</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
          >
            {item.mediaType === "video" ? (
              <div className="relative h-full w-full">
                <video
                  src={item.mediaUrl}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  muted
                  poster={item.thumbnailUrl}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-black/50 p-3 rounded-full text-white backdrop-blur-sm">
                      <Film className="h-6 w-6" />
                   </div>
                </div>
              </div>
            ) : (
              <img
                src={item.mediaUrl}
                alt={item.title || "Gallery Image"}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg text-white">
                  {item.mediaType === "video" ? <Film className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="bg-white text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-md mb-1">{item.category}</span>
                {item.title && <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>}
                {item.description && <p className="text-white/80 text-xs line-clamp-1 mt-0.5">{item.description}</p>}
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 text-[10px] font-bold uppercase tracking-wider hover:text-white mt-2"
                >
                  View Original <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingItem ? "Edit Media" : "Add Media"}</h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                  <X className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Media Type</label>
                    <select value={formData.mediaType} onChange={e => setFormData({...formData, mediaType: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm">
                      <option value="photo">Photo / Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Tour, Hotel, Activity" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Media Source (URL or Upload)</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input 
                        type="url" 
                        value={formData.mediaUrl.startsWith('data:') ? '' : formData.mediaUrl} 
                        onChange={e => setFormData({...formData, mediaUrl: e.target.value})} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" 
                        placeholder="Paste image/video URL here..." 
                        required={!formData.mediaUrl.startsWith('data:')} 
                      />
                    </div>
                    <div className="flex items-center justify-center relative px-2">
                      <span className="text-xs font-bold text-slate-400">OR</span>
                    </div>
                    <div className="relative flex-1">
                      <input 
                        type="file" 
                        accept={formData.mediaType === 'photo' ? "image/*" : "video/*"} 
                        onChange={(e) => handleFileChange(e, 'mediaUrl')} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="flex items-center justify-center w-full h-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm hover:bg-slate-100 transition-colors truncate">
                        {formData.mediaUrl.startsWith('data:') ? 'File Selected' : `Upload ${formData.mediaType === 'photo' ? 'Image' : 'Video'}`}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Max size: {formData.mediaType === 'photo' ? '5MB (Image)' : '20MB (Video)'}
                  </p>
                  
                  {formData.mediaUrl && (
                    <div className="mt-4 aspect-video w-full sm:w-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
                      {formData.mediaType === 'photo' ? (
                        <img src={formData.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <video src={formData.mediaUrl} className="w-full h-full object-cover" controls />
                      )}
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, mediaUrl: ""})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {formData.mediaType === "video" && (
                  <div className="space-y-1.5 pt-4 border-t border-slate-100">
                    <label className="text-sm font-semibold text-slate-700">Video Thumbnail (Optional Image)</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input type="url" value={formData.thumbnailUrl.startsWith('data:') ? '' : formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="https://..." />
                      <div className="flex items-center justify-center relative px-2">
                        <span className="text-xs font-bold text-slate-400">OR</span>
                      </div>
                      <div className="relative flex-1">
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnailUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex items-center justify-center w-full h-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm hover:bg-slate-100 transition-colors truncate">
                          {formData.thumbnailUrl.startsWith('data:') ? 'Thumbnail Selected' : 'Upload Thumbnail'}
                        </div>
                      </div>
                    </div>
                    {formData.thumbnailUrl && (
                      <div className="mt-2 h-24 w-32 rounded-lg overflow-hidden border border-slate-200 relative group">
                        <img src={formData.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, thumbnailUrl: ""})}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                  <label className="text-sm font-semibold text-slate-700">Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Taj Mahal at Sunset" required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Description (Optional)</label>
                  <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm resize-none" placeholder="A short description..."></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md shadow-orange-200 flex items-center gap-2"
                >
                  {isLoading ? "Saving..." : editingItem ? "Update Media" : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

