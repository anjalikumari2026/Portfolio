import { useState, useMemo, useEffect } from "react";
import useInView from "../../hooks/useInView";
import projectService from "@/services/projectService";

const CATS = ["All", "Full Stack", "Frontend", "Backend", "Open Source"];

export default function ProjectsPage() {
  const [headerRef, headerInView] = useInView();
  const [gridRef, gridInView] = useInView();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data.projects || data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return (projects || []).filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const matchSearch =
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        (p.technologies || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [search, cat, projects]);

  return (
    <div className="min-h-screen bg-[#07070e] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/4 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <section
        ref={headerRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16"
      >
        <div
          className={`transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-3">Portfolio</p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mb-10">
            A curated selection of production-ready applications, open-source tools, and experimental builds.
          </p>

          {/* Search */}
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  cat === c
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
                    : "border border-white/[0.08] text-slate-400 hover:border-white/[0.14] hover:text-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section ref={gridRef} className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-5xl mb-4">{projects.length === 0 ? "📭" : "🔍"}</div>
            <h3 className="text-lg font-bold text-white mb-2">
              {projects.length === 0 ? "No projects yet" : "No projects found"}
            </h3>
            <p className="text-slate-500 text-sm">
              {projects.length === 0
                ? "Projects will appear here once added."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {filtered.map((p, i) => (
              <div
                key={p._id || p.id}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-400 overflow-hidden"
                style={{
                  opacity: gridInView ? 1 : 0,
                  transform: gridInView ? "translateY(0)" : "translateY(24px)",
                  transition: `all 0.5s ease ${i * 80}ms`,
                }}
              >
                {/* Project Image */}
                {p.image && (
                  <div className="relative w-full h-44 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] to-transparent" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  {/* Category + Featured badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {p.category || "Uncategorized"}
                    </span>
                    {p.featured && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-violet-300 group-hover:bg-clip-text transition-all duration-300">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed mt-2 mb-4 flex-1">
                    {p.description}
                  </p>

                  {/* Tech Stack */}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-full text-xs bg-white/[0.06] text-slate-400 border border-white/[0.06]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    {p.githubLink ? (
                      <a
                        href={p.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white hover:border-white/[0.15] transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        No repo
                      </span>
                    )}

                    {p.liveLink ? (
                      <a
                        href={p.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-md hover:shadow-indigo-500/20 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed">
                        No demo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
