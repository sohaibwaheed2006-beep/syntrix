"use client";

import { useState } from "react";
import { Project } from "@/types";
import { TypeIcon } from "@/components/LandingPage";

interface Props {
  onCreated: (project: Project) => void;
  onClose: () => void;
}

const TYPES = [
  { key: "tabular", label: "Tabular", hint: "Single table / CSV" },
  { key: "relational", label: "Relational", hint: "Multi-table with keys" },
  { key: "document", label: "Document", hint: "Invoices, statements" },
] as const;

export default function CreateProjectModal({ onCreated, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dataType, setDataType] = useState<"tabular" | "relational" | "document">("tabular");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, data_type: dataType }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create project");
      }
      onCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[var(--glow)] transition-shadow";

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="w-full max-w-lg rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-lg)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
          <div>
            <h2 id="create-project-title" className="text-lg font-semibold tracking-tight">Create project</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Set up a workspace for a new synthetic dataset.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium mb-1.5">Project name</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer churn test set"
              className={inputCls}
              autoFocus
              required
            />
          </div>

          <div>
            <label htmlFor="project-desc" className="block text-sm font-medium mb-1.5">
              Description <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this dataset be used for?"
              className={`${inputCls} h-20 resize-none`}
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium mb-2">Data type</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TYPES.map((t) => {
                const active = dataType === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setDataType(t.key)}
                    aria-pressed={active}
                    className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 rounded-lg border text-left transition-colors ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-[var(--glow)]"
                        : "border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    <span className={active ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}>
                      <TypeIcon type={t.key} size={20} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{t.label}</span>
                      <span className="block text-xs text-[var(--text-secondary)] mt-0.5">{t.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <div className="text-sm text-red-700 dark:text-red-300 bg-red-500/10 px-3 py-2.5 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading || !name.trim()} className="btn-3d px-5 py-2 text-sm font-semibold">
              {loading ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
