import { useEffect, useState } from "react";
import experienceService from "@/services/experienceService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const inp =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";
const label = "text-xs text-slate-400 mb-1.5 block";
const card =
  "p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm";

const emptyForm = {
  companyName: "",
  role: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
  skillsUsed: "",
  location: "",
  order: 0,
};

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ManageExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [companyImageFile, setCompanyImageFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [existingImages, setExistingImages] = useState({ companyImage: null, certificateFile: null });
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await experienceService.getExperiences();
      setExperiences(data.experiences || data || []);
    } catch (error) {
      setFetchError(error.message || "Failed to load experiences");
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "skillsUsed") {
          fd.append(k, JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
        } else {
          fd.append(k, v);
        }
      });
      if (companyImageFile) fd.append("companyImage", companyImageFile);
      if (certificateFile) fd.append("certificateFile", certificateFile);

      if (editingId) {
        await experienceService.updateExperience(editingId, fd);
        toast.success("Experience updated successfully");
      } else {
        await experienceService.createExperience(fd);
        toast.success("Experience added successfully");
      }
      resetForm();
      fetchExperiences();
    } catch (error) {
      toast.error(error.message || "Failed to save experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exp) => {
    setForm({
      companyName: exp.companyName || "",
      role: exp.role || "",
      startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
      endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
      currentlyWorking: exp.currentlyWorking || false,
      description: exp.description || "",
      skillsUsed: (exp.skillsUsed || []).join(", ") || "",
      location: exp.location || "",
      order: exp.order ?? 0,
    });
    setEditingId(exp._id);
    setShowForm(true);
    setCompanyImageFile(null);
    setCertificateFile(null);
    setExistingImages({
      companyImage: exp.companyImage || null,
      certificateFile: exp.certificateFile || null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      await experienceService.deleteExperience(id);
      toast.success("Experience deleted");
      fetchExperiences();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setCompanyImageFile(null);
    setCertificateFile(null);
    setExistingImages({ companyImage: null, certificateFile: null });
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const items = [...experiences];
    const temp = items[index].order;
    items[index].order = items[index - 1].order;
    items[index - 1].order = temp;
    try {
      await Promise.all([
        experienceService.updateExperience(items[index]._id, { order: items[index].order }),
        experienceService.updateExperience(items[index - 1]._id, { order: items[index - 1].order }),
      ]);
      fetchExperiences();
    } catch { toast.error("Failed to reorder"); }
  };

  const moveDown = async (index) => {
    if (index === experiences.length - 1) return;
    const items = [...experiences];
    const temp = items[index].order;
    items[index].order = items[index + 1].order;
    items[index + 1].order = temp;
    try {
      await Promise.all([
        experienceService.updateExperience(items[index]._id, { order: items[index].order }),
        experienceService.updateExperience(items[index + 1]._id, { order: items[index + 1].order }),
      ]);
      fetchExperiences();
    } catch { toast.error("Failed to reorder"); }
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">Admin</p>
            <h1 className="text-3xl font-bold text-white">Manage Experience</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            >
              + Add Experience
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className={`${card} mb-8`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white">
                {editingId ? "Edit Experience" : "Add Experience"}
              </h2>
              <button type="button" onClick={resetForm} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={label}>Company Name *</label>
                <input className={inp} name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Google" required />
              </div>
              <div>
                <label className={label}>Role *</label>
                <input className={inp} name="role" value={form.role} onChange={handleChange} placeholder="e.g. Senior Developer" required />
              </div>
              <div>
                <label className={label}>Start Date *</label>
                <input className={inp} name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
              </div>
              <div>
                <label className={label}>End Date</label>
                <input className={inp} name="endDate" type="date" value={form.endDate} onChange={handleChange} disabled={form.currentlyWorking} />
              </div>
              <div>
                <label className={label}>Location</label>
                <input className={inp} name="location" value={form.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" />
              </div>
              <div>
                <label className={label}>Sort Order</label>
                <input className={inp} name="order" type="number" value={form.order} onChange={handleChange} />
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="currentlyWorking" checked={form.currentlyWorking} onChange={handleChange} className="sr-only peer" />
                  <div className="w-10 h-5 bg-white/[0.08] peer-checked:bg-cyan-500 rounded-full transition-colors duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative" />
                </label>
                <span className="text-sm text-slate-400">Currently working here</span>
              </div>
            </div>
            <div className="mb-4">
              <label className={label}>Description</label>
              <textarea className={`${inp} resize-none`} name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Describe your role and achievements..." />
            </div>
            <div className="mb-4">
              <label className={label}>Skills Used (comma separated)</label>
              <input className={inp} name="skillsUsed" value={form.skillsUsed} onChange={handleChange} placeholder="React, Node.js, AWS" />
              {form.skillsUsed && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {form.skillsUsed.split(",").filter(Boolean).map((s) => (
                    <span key={s.trim()} className="px-2.5 py-0.5 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Company Image */}
            <div className="mb-4">
              <label className={label}>Company Logo / Image</label>
              {editingId && existingImages.companyImage && !companyImageFile && (
                <div className="mb-2 flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <img src={existingImages.companyImage} alt="Current" className="w-10 h-10 rounded-lg object-cover border border-white/[0.08]" />
                  <span className="text-xs text-slate-500">Current image</span>
                </div>
              )}
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-white/[0.16] transition-all">
                  <p className="text-xs text-slate-400">
                    {companyImageFile ? companyImageFile.name : editingId ? "Click to replace company image" : "Click to upload company image"}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setCompanyImageFile(e.target.files[0])} />
              </label>
            </div>

            {/* Certificate */}
            <div className="mb-4">
              <label className={label}>Proof / Certificate (PDF optional)</label>
              {editingId && existingImages.certificateFile && !certificateFile && (
                <div className="mb-2 flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {existingImages.certificateFile.includes(".pdf") ? (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                  ) : (
                    <img src={existingImages.certificateFile} alt="Current" className="w-10 h-10 rounded-lg object-cover border border-white/[0.08]" />
                  )}
                  <span className="text-xs text-slate-500">Current file</span>
                </div>
              )}
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-white/[0.16] transition-all">
                  <p className="text-xs text-slate-400">
                    {certificateFile ? certificateFile.name : editingId ? "Click to replace certificate" : "Click to upload certificate (PDF)"}
                  </p>
                </div>
                <input type="file" className="hidden" accept=".pdf,application/pdf,image/*" onChange={(e) => setCertificateFile(e.target.files[0])} />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingId ? "Update Experience" : "Add Experience"}
            </button>
          </form>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : fetchError ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-sm mb-4">{fetchError}</p>
            <button onClick={fetchExperiences} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">Retry</button>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">💼</p>
            <p className="text-sm">No experience entries yet. Click "Add Experience" to begin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <div key={exp._id} className={`${card} flex items-start gap-4`}>
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="text-slate-600 hover:text-white disabled:opacity-30 text-xs leading-none">▲</button>
                  <button onClick={() => moveDown(index)} disabled={index === experiences.length - 1} className="text-slate-600 hover:text-white disabled:opacity-30 text-xs leading-none">▼</button>
                </div>
                {exp.companyImage && (
                  <img src={exp.companyImage} alt={exp.companyName} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/[0.08]" onError={(e) => { e.target.style.display = "none"; }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                    <span className="text-xs text-slate-500">at</span>
                    <span className="text-xs text-indigo-300">{exp.companyName}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatDate(exp.startDate)}{exp.endDate ? ` – ${formatDate(exp.endDate)}` : exp.currentlyWorking ? " – Present" : ""}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && <p className="text-xs text-slate-400 mt-1">{exp.description}</p>}
                  {exp.skillsUsed?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.skillsUsed.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(exp)} className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">Edit</button>
                  <button onClick={() => handleDelete(exp._id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 flex items-start gap-3">
            <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-cyan-300/70">
              Use ▲/▼ arrows to reorder. Experience entries display on the About page sorted by order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
