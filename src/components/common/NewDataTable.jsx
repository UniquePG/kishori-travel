import { useEffect, useMemo, useState } from "react";

/**
 * Modern DataTable Component
 *
 * Features:
 * - Mobile responsive
 * - Horizontal scroll on small screens
 * - Frontend + backend pagination
 * - Sorting
 * - Custom render cell
 * - Loading state
 * - Empty state
 * - Column width support
 * - Sticky header
 * - Row click support
 * - Minimal Tailwind styling
 *
 * Column Structure:
 * {
 *   key: "name",
 *   label: "Name",
 *   width: "200px",
 *   sortable: true,
 *   render: (row) => <div>{row.name}</div>
 * }
 */

const NewDataTable = ({
  columns = [],
  rows = [],

  // Pagination
  pagination = true,
  backendPagination = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,

  // Frontend pagination
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],

  // States
  loading = false,
  emptyMessage = "No data found",

  // Sorting
  defaultSort = null,
  onSortChange,

  // Row
  rowKey = "id",
  onRowClick,

  // UI
  className = "",
  tableClassName = "",
}) => {
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const [sortConfig, setSortConfig] = useState(defaultSort);

  useEffect(() => {
    if (backendPagination) {
      setCurrentPage(page);
    }
  }, [page, backendPagination]);

  // Sorting
  const sortedRows = useMemo(() => {
    if (backendPagination) return rows;

    if (!sortConfig?.key) return rows;

    const sorted = [...rows].sort((a, b) => {
      const aValue = a?.[sortConfig.key];
      const bValue = b?.[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;

      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });

    return sorted;
  }, [rows, sortConfig, backendPagination]);

  // Frontend Pagination
  const paginatedRows = useMemo(() => {
    if (backendPagination) return rows;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return sortedRows.slice(start, end);
  }, [sortedRows, currentPage, pageSize, backendPagination, rows]);

  const frontendTotalPages = Math.ceil(sortedRows.length / pageSize);

  const finalTotalPages = backendPagination ? totalPages : frontendTotalPages;

  const finalRows = backendPagination ? rows : paginatedRows;

  const handleSort = (column) => {
    if (!column.sortable) return;

    let direction = "asc";

    if (sortConfig?.key === column.key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const newSort = {
      key: column.key,
      direction,
    };

    setSortConfig(newSort);

    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > finalTotalPages) return;

    if (backendPagination) {
      onPageChange?.(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;

    if (sortConfig?.key !== column.key) {
      return <span className="text-gray-400">↕</span>;
    }

    return sortConfig.direction === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className={` ${className}`}>
      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className={`w-full min-w-max border-collapse ${tableClassName}`}>
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column)}
                  style={{
                    width: column.width || "auto",
                    minWidth: column.minWidth || "120px",
                  }}
                  className={`
                    border-b border-gray-200
                    px-4 py-3
                    text-left text-sm font-semibold text-gray-700
                    whitespace-nowrap
                    ${column.sortable ? "cursor-pointer select-none" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="border-b border-gray-100 px-4 py-4"
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : finalRows.length > 0 ? (
              finalRows.map((row, rowIndex) => (
                <tr
                  key={row[rowKey] || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    border-b border-gray-100
                    transition-colors
                    hover:bg-gray-50
                    ${onRowClick ? "cursor-pointer" : ""}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(row)
                        : (row?.[column.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {pagination && !loading && finalRows.length > 0 && (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>
              Showing{" "}
              {backendPagination
                ? rows.length
                : Math.min(
                    (currentPage - 1) * pageSize + 1,
                    sortedRows.length,
                  )}{" "}
              -{" "}
              {backendPagination
                ? rows.length
                : Math.min(currentPage * pageSize, sortedRows.length)}
            </span>

            {!backendPagination && (
              <>
                <span>•</span>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setPageSize(Number(e.target.value));
                  }}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </>
            )}

            {backendPagination && totalRecords > 0 && (
              <>
                <span>•</span>
                <span>{totalRecords} total</span>
              </>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handlePageChange(backendPagination ? page - 1 : currentPage - 1)
              }
              disabled={backendPagination ? page === 1 : currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: finalTotalPages }, (_, index) => index + 1)
                .slice(0, 5)
                .map((pageNumber) => {
                  const active = backendPagination
                    ? page === pageNumber
                    : currentPage === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`
                        h-9 min-w-[36px] rounded-lg px-3 text-sm
                        ${
                          active
                            ? "bg-black text-white"
                            : "border border-gray-200"
                        }
                      `}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() =>
                handlePageChange(backendPagination ? page + 1 : currentPage + 1)
              }
              disabled={
                backendPagination
                  ? page === totalPages
                  : currentPage === finalTotalPages
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDataTable;
