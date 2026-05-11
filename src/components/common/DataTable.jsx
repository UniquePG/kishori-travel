"use client";

import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Filter,
  MoreVertical,
  Search,
} from "lucide-react";
import { useState } from "react";

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  searchPlaceholder = "Search records...",
  onSearch,
  headerActions,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="w-full lg:max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {headerActions}

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
                    col.className,
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                </th>
              ))}

              <th className="w-12 px-4 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <TableSkeleton columns={columns} />
            ) : data.length === 0 ? (
              <EmptyState colSpan={columns.length + 1} />
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="transition-colors hover:bg-slate-50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-4 text-sm text-slate-700 align-middle",
                        col.className,
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE SCROLL HINT ================= */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-xs text-slate-500 sm:hidden">
        Swipe horizontally to view all columns
      </div>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">{data.length}</span>{" "}
            records
          </p>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition",
                    page === 1
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SKELETON ================= */
function TableSkeleton({ columns }) {
  return Array.from({ length: 5 }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {columns.map((_, colIndex) => (
        <td key={colIndex} className="px-4 py-4">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        </td>
      ))}

      <td className="px-4 py-4">
        <div className="ml-auto h-4 w-4 animate-pulse rounded bg-slate-200" />
      </td>
    </tr>
  ));
}

/* ================= EMPTY STATE ================= */
function EmptyState({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Database className="h-6 w-6 text-slate-400" />
          </div>

          <h3 className="text-sm font-semibold text-slate-900">
            No records found
          </h3>

          <p className="mt-1 max-w-xs text-sm text-slate-500">
            We couldn&apos;t find any results matching your current filters.
          </p>
        </div>
      </td>
    </tr>
  );
}
