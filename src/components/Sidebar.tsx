"use client";

import { Project } from "@/types";
import { LogoMark, TypeIcon } from "@/components/LandingPage";

interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelect: (project: Project) => void;
  onCreateNew: () => void;
  onDelete?: (project: Project) => void;
  onHome?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  projects,
  selectedProject,
  onSelect,
  onCreateNew,
  onDelete,
  onHome,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const goHome = () => {
    onHome?.();
    onMobileClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-72 md:w-64 flex flex-col h-full border-r border-white/[0.06] shrink-0 z-50 fixed md:static inset-y-0 left-0 transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: "var(--bg-sidebar)", color: "#e2e8f0" }}
      >
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.06]">
          <button type="button" onClick={goHome} className="flex items-center gap-2.5 text-left" title="Go to Home">
            <LogoMark size={30} />
            <div className="leading-tight">
              <p className="text-[15px] font-semibold text-white tracking-tight">HackData</p>
              <p className="text-[11px] text-slate-400">Synthetic Data Platform</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary nav */}
        <div className="p-3 space-y-1">
          <button
            type="button"
            onClick={() => {
              onCreateNew();
              onMobileClose?.();
            }}
            className="btn-3d w-full px-3 py-2 text-sm font-semibold mb-3"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New project
          </button>

          <NavItem active={!selectedProject} onClick={goHome} label="Home">
            <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
          </NavItem>
        </div>

        {/* Projects */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center justify-between px-2 pt-3 pb-2">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Projects</p>
            <span className="text-[11px] text-slate-500 tabular-nums">{projects.length}</span>
          </div>
          {projects.length === 0 ? (
            <p className="px-2 py-3 text-sm text-slate-500">No projects yet.</p>
          ) : (
            <ul className="space-y-0.5">
              {projects.map((project) => {
                const active = selectedProject?.id === project.id;
                return (
                  <li key={project.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(project);
                        onMobileClose?.();
                      }}
                      className={`w-full text-left pl-2.5 pr-9 py-2 rounded-md text-sm flex items-center gap-2.5 transition-colors ${
                        active ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={active ? "text-[var(--accent)]" : "text-slate-500"}>
                        <TypeIcon type={project.data_type} size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{project.name}</span>
                        <span className="block text-[11px] text-slate-500 capitalize">{project.data_type}</span>
                      </span>
                    </button>

                    {onDelete && (
                      <button
                        type="button"
                        title={`Delete "${project.name}"`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(project);
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/[0.06] text-[11px] text-slate-500 flex items-center justify-between">
          <span>HackData v2</span>
          <span>Synthetic · Privacy-safe</span>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-2.5 py-2 rounded-md text-sm flex items-center gap-2.5 transition-colors ${
        active ? "bg-white/[0.08] text-white font-medium" : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
      {label}
    </button>
  );
}
