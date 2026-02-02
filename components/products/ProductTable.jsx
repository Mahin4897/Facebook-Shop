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

// Stock badge component
function StockBadge({ stock }) {
  if (stock > 20) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        In Stock ({stock})
      </span>
    );
  } else if (stock > 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Low Stock ({stock})
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
        <XCircle className="h-3 w-3 mr-1" />
        Out of Stock
      </span>
    );
  }
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

  // Filter and sort products
  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase()),
    );

    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "price" || sortField === "stock") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  // Reset page when filter/search changes
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  // Handle view details click
  const handleViewDetails = (e, productId) => {
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  // Handle edit click
  const handleEditClick = (e, productId) => {
    e.stopPropagation();
    router.push(`/products/${productId}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="rounded-2xl border overflow-hidden bg-(--card)">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-(--muted/5) border-b">
              <tr>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Package className="h-4 w-4" />
                    {r1}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("sku")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Hash className="h-4 w-4" />
                    {r2}
                    {sortField === "sku" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <DollarSign className="h-4 w-4" />
                    {r3}
                    {sortField === "price" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("stock")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Layers className="h-4 w-4" />
                    {r4}
                    {sortField === "stock" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading State */}
              {loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-(--muted)">Loading products...</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State */}
              {!loading && paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-(--muted)" />
                      <p className="text-(--muted)">No products found</p>
                      {search && (
                        <p className="text-sm text-(--muted)">
                          Try adjusting your search
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Products */}
              {!loading &&
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="border-b border-(--border/50) hover:bg-(--muted/5) transition cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Product Image/Avatar */}
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold shrink-0 overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Package className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.category && (
                            <p className="text-sm text-(--muted)">
                              {product.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-(--muted)" />
                        <div>
                          <p className="font-medium">{product.sku}</p>
                          {product.variants && product.variants > 0 && (
                            <p className="text-sm text-(--muted)">
                              {product.variants} variants
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-(--muted)" />
                        <p className="font-semibold">
                          ৳ {product.price.toLocaleString()}
                        </p>
                      </div>
                      {product.costPrice && (
                        <p className="text-sm text-(--muted) mt-1">
                          Cost: ৳ {product.costPrice.toLocaleString()}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <StockBadge stock={product.stock} />
                      {product.minStockLevel && (
                        <p className="text-sm text-(--muted) mt-1">
                          Min: {product.minStockLevel}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleViewDetails(e, product.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleEditClick(e, product.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle quick add to stock
                          }}
                          className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
                          title="Add Stock"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-(--muted) hover:text-(--text) hover:bg-(--muted/10) rounded-lg transition">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-t">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-(--muted)">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, filteredAndSorted.length)} of{" "}
                {filteredAndSorted.length} products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 min-w-10 rounded-lg transition ${
                        page === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border border-(--border) hover:bg-(--muted/10)"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
