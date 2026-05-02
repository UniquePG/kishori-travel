"use client";

import { Package, Image as ImageIcon, MessageSquare, TrendingUp, Users, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Packages",
      value: "24",
      change: "+12%",
      isPositive: true,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Media Items",
      value: "145",
      change: "+5%",
      isPositive: true,
      icon: ImageIcon,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Testimonials",
      value: "38",
      change: "+18%",
      isPositive: true,
      icon: MessageSquare,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Bookings",
      value: "156",
      change: "+24%",
      isPositive: true,
      icon: Calendar,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const recentActivity = [
    { id: 1, action: "New Booking", detail: "Golden Triangle Tour", time: "2 hours ago", icon: Calendar, color: "text-orange-500" },
    { id: 2, action: "Package Updated", detail: "Kerala Backwaters", time: "5 hours ago", icon: Package, color: "text-blue-500" },
    { id: 3, action: "New Testimonial", detail: "Sarah Jenkins rated 5 stars", time: "1 day ago", icon: MessageSquare, color: "text-green-500" },
    { id: 4, action: "Image Added", detail: "Taj Mahal Sunset", time: "2 days ago", icon: ImageIcon, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/packages" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">Manage Packages</p>
                <p className="text-xs text-slate-500">Add or edit tours</p>
              </div>
            </Link>
            <Link href="/admin/gallery" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">Update Gallery</p>
                <p className="text-xs text-slate-500">Upload new photos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-slate-200 ring-4 ring-slate-50"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.detail}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
