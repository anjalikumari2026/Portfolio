import { useEffect, useState } from "react";
import educationService from "@/services/educationService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const inp =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";
const label = "text-xs text-slate-400 mb-1.5 block";
const card =
  "p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm";

const emptyForm = {
  degree: "",
  institution: "",
  university: "",
  startYear: "",
  endYear: "",
  cgpaOrPercentage: "",
  description: "",
  location: "",
  order: 0,
};

export default function ManageEducation() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await educationService.getEducation();
      setEducations(data.education || data || []);
    } catch (error) {
      setError(error.message || "Failed to load education data");
      toast.error("Failed to load education data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "order" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await educationService.updateEducation(editingId, form);
        toast.success("Education updated successfully");
      } else {
        await educationService.createEducation(form);
        toast.success("Education added successfully");
      }
      resetForm();
      fetchEducation();
    } catch (error) {
      toast.error(error.message || "Failed to save education");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (edu) => {
    setForm({
      degree: edu.degree || "",
      institution: edu.institution || "",
      university: edu.university || "",
      startYear: edu.startYear || "",
      endYear: edu.endYear || "",
      cgpaOrPercentage: edu.cgpaOrPercentage || "",
      description: edu.description || "",
      location: edu.location || "",
      order: edu.order ?? 0,
    });
    setEditingId(edu._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await educationService.deleteEducation(id);
      toast.success("Education deleted");
      fetchEducation();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const items = [...educations];
    const temp = items[index].order;
    items[index].order = items[index - 1].order;
    items[index - 1].order = temp;
    try {
      await Promise.all([
        educationService.updateEducation(items[index]._id, { order: items[index].order }),
        educationService.updateEducation(items[index - 1]._id, { order: items[index - 1].order }),
      ]);
      fetchEducation();
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const moveDown = async (index) => {
    if (index === educations.length - 1) return;
    const items = [...educations];
    const temp = items[index].order;
    items[index].order = items[index + 1].order;
    items[index + 1].order = temp;
    try {
      await Promise.all([
        educationService.updateEducation(items[index]._id, { order: items[index].order }),
        educationService.updateEducation(items[index + 1]._id, { order: items[index + 1].order }),
      ]);
      fetchEducation();
    } catch {
      toast.error("Failed to reorder");
    }
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
            <h1 className="text-3xl font-bold text-white">Manage Education</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            >
              + Add Education
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className={`${card} mb-8`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white">
                {editingId ? "Edit Education" : "Add Education"}
              </h2>
              <button type="button" onClick={resetForm} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={label}>Degree *</label>
                <input className={inp} name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. B.Tech in Computer Science" required />
              </div>
              <div>
                <label className={label}>Institution *</label>
                <input className={inp} name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. IIT Bombay" required />
              </div>
              <div>
                <label className={label}>University / Board</label>
                <input className={inp} name="university" value={form.university} onChange={handleChange} placeholder="e.g. Mumbai University" />
              </div>
              <div>
                <label className={label}>Location</label>
                <input className={inp} name="location" value={form.location} onChange={handleChange} placeholder="e.g. Mumbai, India" />
              </div>
              <div>
                <label className={label}>Start Year *</label>
                <input className={inp} name="startYear" value={form.startYear} onChange={handleChange} placeholder="e.g. 2020" required />
              </div>
              <div>
                <label className={label}>End Year</label>
                <input className={inp} name="endYear" value={form.endYear} onChange={handleChange} placeholder="e.g. 2024 (leave blank if current)" />
              </div>
              <div>
                <label className={label}>CGPA / Percentage</label>
                <input className={inp} name="cgpaOrPercentage" value={form.cgpaOrPercentage} onChange={handleChange} placeholder="e.g. 8.9/10.0" />
              </div>
              <div>
                <label className={label}>Sort Order</label>
                <input className={inp} name="order" type="number" value={form.order} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-4">
              <label className={label}>Description</label>
              <textarea className={`${inp} resize-none`} name="description" rows={2} value={form.description} onChange={handleChange} placeholder="Brief description of your studies" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingId ? "Update Education" : "Add Education"}
            </button>
          </form>
        )}

        {/* List */}
        {error ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-sm text-red-400 mb-4">{error}</p>
            <button onClick={fetchEducation} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">Retry</button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : educations.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-sm">No education entries yet. Click "Add Education" to begin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {educations.map((edu, index) => (
              <div key={edu._id} className={`${card} flex items-start gap-4`}>
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="text-slate-600 hover:text-white disabled:opacity-30 text-xs leading-none">▲</button>
                  <button onClick={() => moveDown(index)} disabled={index === educations.length - 1} className="text-slate-600 hover:text-white disabled:opacity-30 text-xs leading-none">▼</button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                  <p className="text-xs text-indigo-300">
                    {edu.institution}{edu.university ? ` · ${edu.university}` : ""}{edu.location ? ` · ${edu.location}` : ""}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : " – Present"}
                    {edu.cgpaOrPercentage ? ` · ${edu.cgpaOrPercentage}` : ""}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-slate-400 mt-1">{edu.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(edu)} className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">Edit</button>
                  <button onClick={() => handleDelete(edu._id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {educations.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 flex items-start gap-3">
            <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-cyan-300/70">
              Use the ▲/▼ arrows to reorder. Education entries display on the About page sorted by their order value.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
