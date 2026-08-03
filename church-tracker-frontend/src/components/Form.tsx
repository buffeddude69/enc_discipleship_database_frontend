export const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-sage-light focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine text-base bg-white";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
      {children}
    </div>
  );
}
