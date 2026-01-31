export default function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
        Out of stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="rounded-full bg-yellow-500 px-2.5 py-1 text-xs font-semibold text-black">
        Low stock
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
      In stock
    </span>
  );
}
