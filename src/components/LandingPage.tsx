"use client";

import { Project } from "@/types";
import StatusBadge from "@/components/StatusBadge";

interface LandingPageProps {
  projects: Project[];
  onCreate: () => void;
  onOpenProject: (project: Project) => void;
}

export default function LandingPage({ projects, onCreate, onOpenProject }: LandingPageProps) {
  const recent = projects.slice(0, 6);

  return (
    <div className="min-h-full flex flex-col">
      <TopNav onCreate={onCreate} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-20 grid grid-cols-1 2xl:grid-cols-[1.05fr_1fr] gap-12 2xl:gap-14 items-center">
          <div className="animate-fade-up min-w-0">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-secondary)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              AI-assisted synthetic data generation
            </span>
            <h1 className="text-[2rem] leading-[1.12] sm:text-5xl 2xl:text-[3.4rem] font-bold tracking-tight leading-[1.08] mb-5">
              Production-grade test data,{" "}
              <span className="gradient-text">without the production risk.</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mb-8">
              Syntrix learns the structure of your real datasets and generates realistic, privacy-safe
              tabular, relational and document data on demand. Use it for testing, demos and analytics,
              without ever exposing a real customer record.
            </p>
            <div className="flex flex-col min-[480px]:flex-row gap-3 mb-8">
              <button type="button" onClick={onCreate} className="btn-3d px-6 py-3 text-sm font-semibold">
                Create a project
                <ArrowIcon />
              </button>
              <a href="#how-it-works" className="btn-secondary px-6 py-3 text-sm font-semibold">
                See how it works
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
              {["No real PII", "Referential integrity", "CSV · JSON · SQL export"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckIcon />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up delay-2 min-w-0 max-w-3xl 2xl:max-w-none">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { value: "3", label: "Generation engines" },
            { value: "12", label: "Semantic field types" },
            { value: "3", label: "Export formats" },
            { value: "100%", label: "Synthetic output" },
          ].map((s) => (
            <div key={s.label} className="text-center xl:text-left">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKSPACE ================= */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-2">Your workspace</p>
            <h2 className="text-2xl font-bold tracking-tight">
              {recent.length > 0 ? "Recent projects" : "Start your first project"}
            </h2>
          </div>
          <button type="button" onClick={onCreate} className="btn-secondary px-4 py-2 text-sm font-medium self-start sm:self-auto">
            <PlusIcon />
            New project
          </button>
        </div>

        {recent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProject(p)}
                className="glass lift rounded-xl p-5 text-left group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center shrink-0">
                    <TypeIcon type={p.data_type} />
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="font-semibold truncate group-hover:text-[var(--accent)] transition-colors">{p.name}</p>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mt-1 min-h-[1.25rem]">
                  {p.description || `${capitalize(p.data_type)} dataset`}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                  <span className="capitalize">{p.data_type}</span>
                  <span>Updated {formatDate(p.updated_at || p.created_at)}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-card)] p-10 text-center">
            <div className="w-11 h-11 mx-auto rounded-lg bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center mb-4">
              <PlusIcon size={20} />
            </div>
            <p className="font-semibold mb-1">No projects yet</p>
            <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-sm mx-auto">
              Create a project, upload a sample file or schema, and generate your first synthetic dataset in minutes.
            </p>
            <button type="button" onClick={onCreate} className="btn-3d px-5 py-2.5 text-sm font-semibold">
              Create project
            </button>
          </div>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="border-t border-[var(--border)] bg-[var(--bg-card)] scroll-mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <SectionHeading
            eyebrow="Platform"
            title="Everything you need to replace real data in non-production work"
            text="From schema inference to export, every stage is built to give you data that behaves like production data and contains none of it."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[var(--bg-card)] p-6 sm:p-7">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="border-t border-[var(--border)] scroll-mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <SectionHeading
            eyebrow="Workflow"
            title="From sample to dataset in four steps"
            text="A guided pipeline takes you from a raw file to a validated, export-ready synthetic dataset."
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="glass rounded-xl p-6 relative">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border-strong)] text-sm font-semibold text-[var(--accent)] mb-4">
                  {i + 1}
                </span>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section id="use-cases" className="border-t border-[var(--border)] bg-[var(--bg-card)] scroll-mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20 grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-10 xl:gap-16">
          <div>
            <p className="eyebrow mb-3">Use cases</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Built for teams blocked by data access
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              Real data is slow to procure, risky to share and often unavailable when you need it.
              Syntrix removes that bottleneck. Teams can build, test and present with confidence
              without waiting for approvals or exposing sensitive information.
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5">
              <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <ShieldIcon />
                Privacy by design
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Generated records are synthesized from learned structure and statistics, not copied
                from your source data, so outputs are safe to share with vendors, contractors and stakeholders.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USE_CASES.map((u) => (
              <div key={u.title} className="rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold mb-1.5">{u.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{u.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
          <div className="rounded-2xl bg-[var(--bg-sidebar)] text-white px-6 sm:px-12 py-10 sm:py-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Ready to generate your first dataset?
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Upload a CSV, JSON or SQL schema, or start from a document template. It takes less than a minute to set up.
              </p>
            </div>
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors shrink-0"
            >
              Create a project
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col xl:flex-row items-center justify-between gap-4 text-sm text-center text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <LogoMark size={22} />
            <span className="font-semibold text-[var(--text-primary)]">Syntrix</span>
            <span>· Synthetic Data Platform</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">How it works</a>
            <a href="#use-cases" className="hover:text-[var(--text-primary)] transition-colors">Use cases</a>
          </nav>
          <p>© {new Date().getFullYear()} Syntrix</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TopNav({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="hidden lg:block sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-7 text-sm text-[var(--text-secondary)]">
          <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">How it works</a>
          <a href="#use-cases" className="hover:text-[var(--text-primary)] transition-colors">Use cases</a>
        </nav>
        <button type="button" onClick={onCreate} className="btn-3d px-4 py-2 text-sm font-semibold">
          <PlusIcon />
          New project
        </button>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-2xl mb-10 sm:mb-12">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-[var(--text-secondary)] leading-relaxed">{text}</p>
    </div>
  );
}

function ProductPreview() {
  const rows = [
    ["CUS-10482", "Amelia Hart", "amelia.hart@northwind.io", "$1,284.50", "Active"],
    ["CUS-10483", "Daniel Okafor", "d.okafor@brightlane.com", "$342.00", "Active"],
    ["CUS-10484", "Sofia Marín", "sofia.marin@cobalt.dev", "$2,910.75", "Churned"],
    ["CUS-10485", "Yusuf Rahman", "yusuf.r@meridian.co", "$88.20", "Trial"],
    ["CUS-10486", "Grace Liu", "grace.liu@harborlabs.ai", "$1,045.00", "Active"],
  ];
  const statusCls: Record<string, string> = {
    Active: "text-emerald-600 dark:text-emerald-400",
    Churned: "text-red-600 dark:text-red-400",
    Trial: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="ml-3 text-xs font-medium text-[var(--text-secondary)]">customers.csv · synthetic</span>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          Validated
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
              {["id", "name", "email", "ltv", "status"].map((h) => (
                <th key={h} className="px-4 py-2.5 font-medium font-mono">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-2.5 font-mono text-[var(--text-secondary)] whitespace-nowrap">{r[0]}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{r[1]}</td>
                <td className="px-4 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">{r[2]}</td>
                <td className="px-4 py-2.5 font-mono whitespace-nowrap">{r[3]}</td>
                <td className={`px-4 py-2.5 font-medium whitespace-nowrap ${statusCls[r[4]]}`}>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3 border-t border-[var(--border)] text-center">
        {[
          { k: "Rows", v: "10,000" },
          { k: "Null rate", v: "0.4%" },
          { k: "FK integrity", v: "100%" },
        ].map((m, i) => (
          <div key={m.k} className={`px-3 py-3 ${i > 0 ? "border-l border-[var(--border)]" : ""}`}>
            <p className="text-[11px] text-[var(--text-muted)]">{m.k}</p>
            <p className="text-sm font-semibold mt-0.5">{m.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Automatic schema detection",
    text: "Upload CSV, JSON or SQL and Syntrix infers column types, keys, constraints and value distributions automatically.",
    icon: <Svg><path d="M4 6h16M4 12h10M4 18h7" /><circle cx="18" cy="16" r="3" /><path d="m20.5 18.5 1.5 1.5" /></Svg>,
  },
  {
    title: "Relational integrity",
    text: "Generate multi-table datasets where every foreign key resolves, with configurable parent–child cardinalities.",
    icon: <Svg><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M7.5 8 11 15.8M16.5 8 13 15.8" /></Svg>,
  },
  {
    title: "Realistic documents",
    text: "Produce business documents such as invoices and bank statements with consistent, believable content.",
    icon: <Svg><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></Svg>,
  },
  {
    title: "Data hygiene & validation",
    text: "Messy inputs are cleaned before modeling, and every generated dataset is validated against its schema.",
    icon: <Svg><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></Svg>,
  },
  {
    title: "AI-assisted modeling",
    text: "A language-model layer enriches field semantics so names, addresses and free text read like the real thing.",
    icon: <Svg><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="3" /></Svg>,
  },
  {
    title: "Flexible export",
    text: "Download as CSV, JSON or dependency-ordered SQL with CREATE and INSERT statements ready to load.",
    icon: <Svg><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></Svg>,
  },
];

const STEPS = [
  { title: "Upload input", text: "Provide a sample CSV or JSON file, a SQL schema, or choose a document type." },
  { title: "Review schema", text: "Inspect the detected columns, types and relationships, and adjust them as needed." },
  { title: "Configure", text: "Set row counts, distributions and generation options for each table or document." },
  { title: "Generate & export", text: "Preview the validated output and export it in the format your stack expects." },
];

const USE_CASES = [
  { title: "QA & automated testing", text: "Seed test environments with realistic, edge-case-rich data on every run." },
  { title: "Product demos", text: "Present convincing dashboards and workflows without showing real customer data." },
  { title: "Analytics & ML prototyping", text: "Explore pipelines and train early models before production data is approved." },
  { title: "Vendor & partner sharing", text: "Share representative datasets externally without compliance overhead." },
];

/* ------------------------------------------------------------------ */

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
      <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
    </svg>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M9 11h14M9 16h10M9 21h12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function TypeIcon({ type, size = 18 }: { type: string; size?: number }) {
  if (type === "tabular") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M3 15h18M9 4v16" />
      </svg>
    );
  }
  if (type === "relational") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M7.5 8 11 15.8M16.5 8 13 15.8" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
