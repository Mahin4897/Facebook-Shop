export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-(--border)
                   bg-transparent px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/10
                   dark:focus:ring-white/10"
      />
    </div>
  );
}
