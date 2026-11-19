"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import Sidebar from "@/components/Sidebar";
import CreateProjectModal from "@/components/CreateProjectModal";
import InputUpload from "@/components/InputUpload";
import SchemaReview from "@/components/SchemaReview";
import ConfigPanel from "@/components/ConfigPanel";
import GeneratePanel from "@/components/GeneratePanel";
import PreviewPanel from "@/components/PreviewPanel";
import LandingPage, { LogoMark } from "@/components/LandingPage";
import StatusBadge from "@/components/StatusBadge";

type Tab = "upload" | "schema" | "config" | "generate" | "preview";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("upload");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (e) {
      console.error("Failed to fetch projects:", e);
      setProjects([]);
    }
  }

  async function handleProjectCreated(project: Project) {
    setProjects((prev) => [project, ...prev]);
    setSelectedProject(project);
    setShowCreateModal(false);
    setActiveTab("upload");
  }

  async function fetchProject(project: Project): Promise<Project | null> {
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      if (!res.ok) {
        console.warn(`Failed to refresh project ${project.id}: HTTP ${res.status}`);
        return project;
      }
      const freshProject = await res.json();
      if (!freshProject || !freshProject.id) {
        return project;
      }
      setSelectedProject(freshProject);
      return freshProject;
    } catch (err) {
      console.warn("Network error refreshing project:", err);
      return project;
    }
  }

  async function handleSelectProject(project: Project) {
    const freshProject = await fetchProject(project);
    if (!freshProject) return;

    const status = freshProject.status || "draft";
    if (["completed", "completed_with_warnings", "failed"].includes(status)) setActiveTab("preview");
    else if (status === "configured") setActiveTab("config");
    else if (status === "analyzing" && freshProject.data_type === "document") setActiveTab("config");
    else setActiveTab("upload");
  }

  async function handleDeleteProject(project: Project) {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        if (selectedProject?.id === project.id) {
          setSelectedProject(null);
        }
        try {
          window.sessionStorage.removeItem(`hackdata:upload:${project.id}`);
        } catch {
          // sessionStorage unavailable — nothing to clean up.
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  }

  function refreshProject() {
    if (selectedProject) fetchProject(selectedProject);
  }

  const s = selectedProject?.status || "";
  const isDocument = selectedProject?.data_type === "document";
  const finishedGeneration = ["completed", "completed_with_warnings", "failed"].includes(s);
  const allSteps: { key: Tab; label: string; enabled: boolean }[] = [
    { key: "upload", label: "Input", enabled: true },
    { key: "schema", label: "Schema", enabled: s !== "" && s !== "draft" },
    { key: "config", label: "Configure", enabled: ["configured", "generating"].includes(s) || finishedGeneration },
    { key: "generate", label: "Generate", enabled: s === "configured" || finishedGeneration },
    { key: "preview", label: "Preview", enabled: finishedGeneration },
  ];
  const steps = isDocument ? allSteps.filter((step) => step.key !== "schema") : allSteps;
  const activeIndex = steps.findIndex((step) => step.key === activeTab);

  return (
    <div className="app-shell flex overflow-hidden">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelect={handleSelectProject}
        onCreateNew={() => setShowCreateModal(true)}
        onDelete={handleDeleteProject}
        onHome={() => setSelectedProject(null)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0 z-20">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 font-semibold text-sm"
            title="Go to Home"
          >
            <LogoMark size={24} />
            HackData
          </button>

          <button type="button" onClick={() => setShowCreateModal(true)} className="btn-3d px-3.5 py-2 text-xs font-semibold">
            New
          </button>
        </div>

        {selectedProject ? (
          <>
            <header className="bg-[var(--bg-card)] border-b border-[var(--border)] px-4 sm:px-8 pt-4 sm:pt-5 shrink-0 z-10">
              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Home
                </button>
                <span>/</span>
                <span>Projects</span>
                <span>/</span>
                <span className="text-[var(--text-secondary)] truncate">{selectedProject.name}</span>
              </nav>

              <div className="flex items-start justify-between gap-3 mb-2 sm:mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{selectedProject.name}</h1>
                    <StatusBadge status={selectedProject.status} />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">
                    <span className="capitalize">{selectedProject.data_type}</span> dataset
                    {selectedProject.description ? ` · ${selectedProject.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="btn-secondary px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-medium"
                    title="Back to Home"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M11 6l-6 6 6 6" />
                    </svg>
                    <span className="hidden sm:inline">Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(selectedProject)}
                    title="Delete this project"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-[10px] text-xs font-medium text-red-600 dark:text-red-400 border border-[var(--border-strong)] hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Stepper */}
              <nav className="flex gap-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none" aria-label="Workflow steps">
                {steps.map((step, i) => {
                  const active = activeTab === step.key;
                  const done = i < activeIndex && step.enabled;
                  return (
                    <button
                      key={step.key}
                      type="button"
                      onClick={() => step.enabled && setActiveTab(step.key)}
                      disabled={!step.enabled}
                      aria-current={active ? "step" : undefined}
                      className={`relative flex items-center gap-2 px-2.5 sm:px-4 py-3 text-sm font-medium whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                        active
                          ? "border-[var(--accent)] text-[var(--text-primary)]"
                          : step.enabled
                          ? "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          : "border-transparent text-[var(--text-muted)] opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[11px] font-semibold flex items-center justify-center ${
                          active
                            ? "bg-[var(--accent)] text-white"
                            : done
                            ? "bg-[var(--accent-light)] text-[var(--accent)]"
                            : "border border-[var(--border-strong)]"
                        }`}
                      >
                        {done ? (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12 5 5L20 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span className={active ? "" : "hidden sm:inline"}>{step.label}</span>
                    </button>
                  );
                })}
              </nav>
            </header>

            <div key={activeTab} className="animate-fade-up flex-1 overflow-auto px-4 py-5 sm:p-8 min-w-0">
              <div className="max-w-6xl mx-auto">
                {activeTab === "upload" && (
                  <InputUpload
                    project={selectedProject}
                    onAnalyzed={async () => {
                      const fresh = await fetchProject(selectedProject);
                      setActiveTab(fresh?.data_type === "document" ? "config" : "schema");
                    }}
                  />
                )}
                {activeTab === "schema" && (
                  <SchemaReview
                    projectId={selectedProject.id}
                    onConfirmed={() => {
                      refreshProject();
                      setActiveTab("config");
                    }}
                  />
                )}
                {activeTab === "config" && (
                  <ConfigPanel
                    projectId={selectedProject.id}
                    dataType={selectedProject.data_type}
                    onSaved={() => setActiveTab("generate")}
                  />
                )}
                {activeTab === "generate" && (
                  <GeneratePanel
                    projectId={selectedProject.id}
                    onGenerated={() => {
                      refreshProject();
                      setActiveTab("preview");
                    }}
                  />
                )}
                {activeTab === "preview" && <PreviewPanel projectId={selectedProject.id} />}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <LandingPage
              projects={projects}
              onCreate={() => setShowCreateModal(true)}
              onOpenProject={handleSelectProject}
            />
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateProjectModal
          onCreated={handleProjectCreated}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
