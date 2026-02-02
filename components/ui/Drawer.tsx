export default function Drawer({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-100 bg-(--card) p-6 shadow-xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
