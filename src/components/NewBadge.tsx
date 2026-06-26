export function NewBadge({ label = "New" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 font-serif text-[10px] font-medium uppercase tracking-wider text-accent">
      {label}
    </span>
  );
}
