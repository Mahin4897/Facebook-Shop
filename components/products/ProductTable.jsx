"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Hash,
  DollarSign,
  Layers,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

/* -------------------- Stock Badge -------------------- */
function StockBadge({ stock }) {
  if (stock > 20) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        {stock}
      </span>
    );
  }
  if (stock > 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {stock}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
      <XCircle className="h-3 w-3 mr-1" />
      Out
    </span>
  );
}

const PAGE_SIZE = 10;

export default function ProductTable({
  products,
  search,
  loading,
  r1 = "Product",
  r2 = "SKU",
  r3 = "Price",
  r4 = "Stock",
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  /* -------------------- Filter + Sort -------------------- */
  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];

      if (sortField === "price" || sortField === "stock") {
        av = Number(av);
        bv = Number(bv);
      }

      if (sortDirection === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

    return filtered;
  }, [products, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  if (page > totalPages && totalPages > 0) setPage(1);

  /* -------------------- Handlers -------------------- */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (e, id) => {
    e.stopPropagation();
    router.push(`/products/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    router.push(`/products/${id}/edit`);
  };

  const handleRowClick = (id) => {
    router.push(`/dashboard/products/${id}`);
  };

  /* -------------------- Skeleton Loading -------------------- */
  const renderSkeleton = () =>
    Array.from({ length: PAGE_SIZE }).map((_, idx) => (
      <tr key={idx} className="animate-pulse">
        <td className="p-4">
          <div className="h-10 w-32 bg-(--muted/10) rounded-lg" />
        </td>
        <td className="p-4">
          <div className="h-6 w-20 bg-(--muted/10) rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-16 bg-(--muted/10) rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-16 bg-(--muted/10) rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-24 bg-(--muted/10) rounded" />
        </td>
      </tr>
    ));

  return (
    <div className="space-y-4">
      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block rounded-2xl bg-(--card) shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-(--muted/20) sticky top-0 z-10">
            <tr>
              {[r1, r2, r3, r4, "Actions"].map((title, idx) => (
                <th key={idx} className="p-4 text-left text-sm text-(--muted)">
                  {title === r1 && (
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <Package className="h-4 w-4" /> {r1}
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === r2 && (
                    <button
                      onClick={() => handleSort("sku")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <Hash className="h-4 w-4" /> {r2}
                      {sortField === "sku" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === r3 && (
                    <button
                      onClick={() => handleSort("price")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <DollarSign className="h-4 w-4" /> {r3}
                      {sortField === "price" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === r4 && (
                    <button
                      onClick={() => handleSort("stock")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <Layers className="h-4 w-4" /> {r4}
                      {sortField === "stock" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === "Actions" && title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border/10)">
            {loading && renderSkeleton()}

            {!loading &&
              paginatedProducts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => handleRowClick(p.id)}
                  className="transition-transform duration-150 hover:scale-[1.01] hover:shadow-sm cursor-pointer"
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white overflow-hidden">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-(--muted)">{p.category}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{p.sku}</td>
                  <td className="p-4 font-medium">
                    ৳ {p.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <StockBadge stock={p.stock} />
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={(e) => handleView(e, p.id)}
                      className="p-2 rounded-full hover:bg-(--muted/30) transition"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => handleEdit(e, p.id)}
                      className="p-2 rounded-full hover:bg-(--muted/30) transition"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-(--muted/30) transition">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="hidden md:flex items-center justify-between px-4 py-3 bg-(--card)">
            <p className="text-sm text-(--muted)">
              Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, filteredAndSorted.length)} of{" "}
              {filteredAndSorted.length} products
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-(--muted/20)"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "hover:bg-(--muted/20)"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-(--muted/20)"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="md:hidden space-y-3">
        {!loading &&
          paginatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => handleRowClick(p.id)}
              className="rounded-2xl bg-(--card) p-4 shadow-sm transition-transform duration-150 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold leading-tight">{p.name}</p>
                  <p className="text-sm text-(--muted)">{p.sku}</p>
                </div>
                <StockBadge stock={p.stock} />
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <div>
                  <p className="text-(--muted)">Price</p>
                  <p className="font-semibold">৳ {p.price.toLocaleString()}</p>
                </div>
                {p.costPrice && (
                  <div className="text-right">
                    <p className="text-(--muted)">Cost</p>
                    <p>৳ {p.costPrice.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-(--border/10) flex justify-between">
                <button
                  onClick={(e) => handleView(e, p.id)}
                  className="flex items-center gap-1 text-blue-600 text-sm"
                >
                  <Eye className="h-4 w-4" /> View
                </button>
                <button
                  onClick={(e) => handleEdit(e, p.id)}
                  className="flex items-center gap-1 text-green-600 text-sm"
                >
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button className="flex items-center gap-1 text-purple-600 text-sm">
                  <Plus className="h-4 w-4" /> Stock
                </button>
              </div>
            </div>
          ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex-1 py-2 rounded-lg text-sm disabled:opacity-50 bg-(--muted/10)"
            >
              Previous
            </button>
            <p className="text-sm text-(--muted)">
              Page {page} / {totalPages}
            </p>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 py-2 rounded-lg text-sm disabled:opacity-50 bg-(--muted/10)"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
