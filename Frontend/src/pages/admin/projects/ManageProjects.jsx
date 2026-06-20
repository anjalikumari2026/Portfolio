import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import projectService from "@/services/projectService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";

const CATS = ["All", "Full Stack", "Frontend", "Backend", "Open Source"];

export default function ManageProjects() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data?.projects || data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return (projects || []).filter((p) => {
      const matchCat = cat === "All" || p?.category === cat;
      const matchSearch =
        !search || p?.title?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, cat, projects]);

  const deleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectService.deleteProject(id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Admin
        </p>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
          <button
            onClick={() => navigate("/admin/dashboard/projects/add")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>+</span> Add Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  cat === c
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
                    : "border border-white/[0.08] text-slate-400 hover:border-white/[0.14]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {/* Empty state */}
        {!loading && !projects?.length && (
          <EmptyState
            icon="📭"
            title="No projects yet"
            description="Add your projects to showcase your work."
            actionLabel="Add Project"
            onAction={() => navigate("/admin/dashboard/projects/add")}
          />
        )}

        {/* Table */}
        {!loading && projects?.length > 0 && (
          <>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-4xl mb-3">�</div>
                <h3 className="text-base font-bold text-white mb-1">
                  No projects found
                </h3>
                <p className="text-slate-500 text-sm">
                  Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.05] text-xs text-slate-500 uppercase tracking-widest">
                  <span>Project</span>
                  <span className="hidden sm:block">Category</span>
                  <span className="hidden md:block">Updated</span>
                  <span>Actions</span>
                </div>
                {filtered.map((p) => (
                  <div
                    key={p?._id || p?.id}
                    className="group grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {p?.title || ""}
                        </span>
                        {p?.featured && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(p?.technologies || []).map((t) => (
                          <span key={t} className="text-xs text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="hidden sm:block text-xs text-slate-500 whitespace-nowrap">
                      {p?.category || p?.cat || ""}
                    </span>
                    <span className="hidden md:block text-xs text-slate-600 whitespace-nowrap">
                      {p?.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/projects/edit/${p?._id || p?.id}`)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all duration-200"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteProject(p?._id || p?.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-600 mt-4">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
            </p>
          </>
        )}
      </div>
    </div>
  );
}
