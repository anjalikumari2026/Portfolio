import { useState } from "react";
import { useNavigate } from "react-router-dom";
import projectService from "@/services/projectService";
import toast from "react-hot-toast";

const inp =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";
const label = "text-xs text-slate-400 mb-1.5 block";
const CATS = ["Full Stack", "Frontend", "Backend", "Open Source", "Mobile"];
const STATUSES = ["active", "draft", "archived"];

export function ProjectForm({ initial = {}, mode = "add" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    technologies: (initial.technologies || []).join(", ") || "",
    githubLink: initial.githubLink || "",
    liveLink: initial.liveLink || "",
    category: initial.category || "Full Stack",
    featured: initial.featured || false,
    order: initial.order ?? 0,
    status: initial.status || "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("githubLink", form.githubLink);
      formData.append("liveLink", form.liveLink);
      formData.append("category", form.category);
      formData.append("featured", form.featured);
      formData.append("order", form.order);
      formData.append("status", form.status);
      formData.append(
        "technologies",
        JSON.stringify(
          form.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (mode === "edit") {
        await projectService.updateProject(initial._id, formData);
        toast.success("Project updated successfully");
      } else {
        await projectService.createProject(formData);
        toast.success("Project created successfully");
      }

      setTimeout(() => {
        navigate("/admin/dashboard/projects");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Basic */}
      <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <h2 className="text-sm font-bold text-white mb-5">Project Details</h2>
        <div className="space-y-4">
          <div>
            <label className={label}>Project Title</label>
            <input
              required
              className={inp}
              placeholder="e.g. NexaCommerce"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea
              required
              rows={3}
              className={`${inp} resize-none`}
              placeholder="Project description..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Category</label>
              <select
                className={inp}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select
                className={inp}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Sort Order</label>
              <input
                type="number"
                className={inp}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-white/[0.08] peer-checked:bg-cyan-500 rounded-full transition-colors duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative" />
            </label>
            <span className="text-sm text-slate-400">Featured project</span>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <h2 className="text-sm font-bold text-white mb-5">Tech Stack</h2>
        <div>
          <label className={label}>Technologies (comma separated)</label>
          <input
            className={inp}
            placeholder="React, Node.js, MongoDB, Tailwind CSS"
            value={form.technologies}
            onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
          />
          {form.technologies && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {form.technologies.split(",").filter(Boolean).map((t) => (
                <span
                  key={t.trim()}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <h2 className="text-sm font-bold text-white mb-5">Project Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>GitHub Repository</label>
            <input
              type="url"
              className={inp}
              placeholder="https://github.com/..."
              value={form.githubLink}
              onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))}
            />
          </div>
          <div>
            <label className={label}>Live Demo URL</label>
            <input
              type="url"
              className={inp}
              placeholder="https://..."
              value={form.liveLink}
              onChange={(e) => setForm((f) => ({ ...f, liveLink: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Image upload */}
      <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <h2 className="text-sm font-bold text-white mb-5">Project Image</h2>
        <label className="cursor-pointer block">
          <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-10 text-center hover:border-white/[0.16] hover:bg-white/[0.02] transition-all duration-300">
            <div className="text-3xl mb-3">🖼️</div>
            <p className="text-sm text-slate-400 mb-1">
              {imageFile ? imageFile.name : initial.image ? "Current image set. Click to replace." : "Drop image here or click to upload"}
            </p>
            <p className="text-xs text-slate-600">PNG, JPG, WebP up to 5MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : mode === "add" ? "Add Project" : "Update Project"}
        </button>
      </div>
    </form>
  );
}

export function AddProject() {
  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-cyan-600/4 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">Admin · Projects</p>
        <h1 className="text-3xl font-bold text-white mb-8">Add New Project</h1>
        <ProjectForm mode="add" />
      </div>
    </div>
  );
}

export default AddProject;
