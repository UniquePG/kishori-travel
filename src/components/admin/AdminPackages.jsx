"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit3, Trash2, MapPin, Clock, Plus, Eye, Star, AlertCircle, Loader2 } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import PackageModal from "../modal/PackageModal";
import PackageViewModal from "../modal/PackageViewModal";
import NewDataTable from "@/components/common/NewDataTable";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
      toast.error("Could not load packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsEditModalOpen(true);
  };

  const handleOpenViewModal = (pkg) => {
    setViewingPackage(pkg);
    setIsViewModalOpen(true);
  };

  const handleSave = (savedPkg) => {
    if (selectedPackage) {
      setPackages(prev => prev.map(p => p.id === savedPkg.id ? savedPkg : p));
    } else {
      setPackages(prev => [savedPkg, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this package? This will perform a soft delete.")) {
      try {
        const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete package");
        setPackages(prev => prev.filter((p) => p.id !== id));
        toast.success("Package removed");
      } catch (error) {
        console.error("Failed to delete package", error);
        toast.error("Could not delete package");
      }
    }
  };

  const columns = [
    {
      key: "details",
      label: "Package Details",
      render: (pkg) => (
        <div className="flex items-center gap-4 py-1">
          <div className="relative h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 shrink-0 shadow-sm">
            <img 
              src={pkg.thumbnail || "https://placehold.co/100"} 
              alt="" 
              className="h-full w-full object-cover transition-transform duration-500" 
            />
            {pkg.isFeatured && (
              <div className="absolute top-1 right-1 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                <Star className="h-2 w-2 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-black text-slate-900 truncate max-w-[200px]">{pkg.title}</div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black text-[#e8611a] uppercase tracking-tight bg-orange-50 px-2 py-0.5 rounded-md">
                {pkg.durationDays} Days
              </span>
              {pkg.isFeatured && (
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight bg-blue-50 px-2 py-0.5 rounded-md">
                  Featured
                </span>
              )}
              {pkg.isUpcoming && (
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-tight bg-amber-100 px-2 py-0.5 rounded-md">
                  Upcoming
                </span>
              )}
              {pkg.offerTitle && (
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tight bg-emerald-50 px-2 py-0.5 rounded-md max-w-[120px] truncate" title={pkg.offerTitle}>
                  Offer
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (pkg) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {pkg.location}
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (pkg) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-900">{formatCurrency(pkg.currentPrice)}</span>
          {pkg.oldPrice && (
            <span className="text-[10px] font-bold text-slate-300 line-through">
              {formatCurrency(pkg.oldPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (pkg) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
          pkg.isActive 
            ? "bg-green-50 text-green-600 border border-green-100" 
            : "bg-slate-50 text-slate-400 border border-slate-100"
        )}>
          <div className={cn("h-1.5 w-1.5 rounded-full", pkg.isActive ? "bg-green-500" : "bg-slate-300")}></div>
          {pkg.isActive ? "Active" : "Draft"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (pkg) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleOpenViewModal(pkg)}
            title="View Details"
            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleOpenEditModal(pkg)}
            title="Edit Package"
            className="p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(pkg.id)}
            title="Delete Package"
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ];

  if (isLoading && packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-[#e8611a] tracking-tight">Tour Packages</h3>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor all your travel offerings.</p>
        </div>
        <button 
          onClick={() => handleOpenEditModal()}
          className="flex items-center gap-2 bg-[#e8611a] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#e8611a]/10 hover:bg-[#e8611a] transition-all active:scale-95 group"
        >
          <Plus className="h-4 w-4 group-hover:rotate-90  transition-transform duration-300" />
          Add New Package
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
            <AlertCircle className="h-8 w-8 text-slate-300" />
          </div>
          <h4 className="text-lg font-black text-slate-900">No packages found</h4>
          <p className="text-sm text-slate-500 font-medium mt-1">Start by creating your first tour package.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <NewDataTable
            columns={columns}
            rows={packages}
            loading={isLoading}
            rowKey="id"
            className="border-none"
          />
        </div>
      )}

      {/* Modals */}
      <PackageModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleSave}
        editingPackage={selectedPackage}
      />
      
      <PackageViewModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        pkg={viewingPackage}
      />
    </div>
  );
}
