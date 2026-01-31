"use client";

import Link from "next/link";
import Image from "next/image";
import StockBadge from "./StockBadge";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
};


export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="
        group block rounded-2xl border border-(--border)
        bg-(--card)
        transition
        hover:shadow-lg hover:-translate-y-0.5
      "
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-gray-100">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-(--text) leading-tight">
            {product.name}
          </h3>
          <StockBadge stock={product.stock} />
        </div>

        <p className="text-xs text-(--muted)">SKU: {product.sku}</p>

        <p className="text-lg font-bold text-(--text)">
          ৳ {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
