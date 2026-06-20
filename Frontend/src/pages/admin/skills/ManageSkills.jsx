import { useState, useEffect } from "react";
import skillService from "@/services/skillService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const inp =
  "w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 transition-all duration-300";
const DEFAULT_CATEGORIES = ["Frontend", "Backend", "Database", "DevOps & Tools", "Other"];

const normalizeLevel = (lvl) => {
  if (typeof lvl === "number") return lvl;
  if (lvl === "Advanced") return 85;
  if (lvl === "Intermediate") return 55;
  if (lvl === "Beginner") return 25;
  return Number(lvl) || 0;
};

const emptyForm = {
  name: "",
  icon: "",
  level: 80,
  category: "Frontend",
};

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await skillService.getSkills();
      setSkills(data.skills || data || []);
    } catch (error) {
      setFetchError(error.message || "Failed to load skills");
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...skills.map((s) => s.category).filter(Boolean)])];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "level" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Skill name is required");
    setSubmitting(true);
    try {
      if (editingId) {
        await skillService.updateSkill(editingId, form);
        toast.success("Skill updated successfully");
      } else {
        await skillService.createSkill(form);
        toast.success("Skill added successfully");
      }
      resetForm();
      fetchSkills();
    } catch (error) {
      toast.error(error.message || "Failed to save skill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name || "",
      icon: skill.icon || "",
      level: normalizeLevel(skill.level),
      category: skill.category || "Frontend",
    });
    setEditingId(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await skillService.deleteSkill(id);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">Admin</p>
            <h1 className="text-3xl font-bold text-white">Manage Skills</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              <span>+</span> Add Skill
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white">
                {editingId ? "Edit Skill" : "Add Skill"}
              </h2>
              <button type="button" onClick={resetForm} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Skill Name *</label>
                <input className={inp} name="name" value={form.name} onChange={handleChange} placeholder="e.g. React.js" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Icon / Emoji</label>
                <input className={inp} name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. ⚛️" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Proficiency: {form.level}%</label>
                <input type="range" min={10} max={100} step={5} value={form.level} onChange={handleChange} name="level" className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Category</label>
                <select className={inp} name="category" value={form.category} onChange={handleChange}>
                  {allCategories.map((c) => (<option key={c}>{c}</option>))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
            </button>
          </form>
        )}

        {/* Loading */}
        {loading && <div className="flex justify-center py-12"><Loader /></div>}

        {/* Error */}
        {!loading && fetchError && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-sm mb-4">{fetchError}</p>
            <button onClick={fetchSkills} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !fetchError && skills.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚡</p>
            <p className="text-sm mb-4">No skills yet. Add your first skill to showcase your expertise.</p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">Add Skill</button>
            )}
          </div>
        )}

        {/* Skills grouped */}
        {!loading && !fetchError && skills.length > 0 && (
          <div className="space-y-8">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="text-xs text-cyan-400 tracking-[0.2em] uppercase mb-4">{cat}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {items.map((skill) => (
                    <div
                      key={skill._id}
                      className="group relative p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.10] transition-all"
                    >
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(skill)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 hover:text-cyan-400 transition-colors text-xs">✎</button>
                        <button onClick={() => handleDelete(skill._id)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 hover:text-red-400 transition-colors text-xs">✕</button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{skill.icon || ""}</span>
                        <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${normalizeLevel(skill.level)}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 w-8 text-right">{normalizeLevel(skill.level)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
