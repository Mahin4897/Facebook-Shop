export default function AuthCard({ title, subtitle, children }) {
  return (
    <div
      className="w-full max-w-md rounded-2xl border border-(--border) 
                    bg-(--card) p-8 shadow-lg"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-(--muted)">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
