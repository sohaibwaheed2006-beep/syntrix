const STYLES: Record<string, { dot: string; cls: string; label: string }> = {
  draft:                   { dot: "bg-slate-400",   cls: "bg-slate-500/10 text-slate-600 dark:text-slate-300",       label: "Draft" },
  analyzing:               { dot: "bg-sky-500",     cls: "bg-sky-500/10 text-sky-700 dark:text-sky-300",             label: "Analyzing" },
  configured:              { dot: "bg-amber-500",   cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300",       label: "Configured" },
  generating:              { dot: "bg-indigo-500",  cls: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",    label: "Generating" },
  completed:               { dot: "bg-emerald-500", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", label: "Completed" },
  completed_with_warnings: { dot: "bg-amber-500",   cls: "bg-amber-500/10 text-amber-800 dark:text-amber-300",       label: "Completed with warnings" },
  failed:                  { dot: "bg-red-500",     cls: "bg-red-500/10 text-red-700 dark:text-red-300",             label: "Failed" },
  error:                   { dot: "bg-red-500",     cls: "bg-red-500/10 text-red-700 dark:text-red-300",             label: "Error" },
};

export default function StatusBadge({ status }: { status?: string | null }) {
  const key = (status || "draft").toLowerCase();
  const style = STYLES[key] || {
    ...STYLES.draft,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  };
  const pulse = key === "generating" || key === "analyzing" ? "animate-pulse" : "";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${style.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${pulse}`} />
      {style.label}
    </span>
  );
}
