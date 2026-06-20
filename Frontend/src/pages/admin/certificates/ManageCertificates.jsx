import { useEffect, useState } from "react";
import certificateService from "@/services/certificateService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const inp =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";
const label = "text-xs text-slate-400 mb-1.5 block";
const card =
  "p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm";

const emptyForm = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  verifyLink: "",
  order: 0,
};

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [certFile, setCertFile] = useState(null);

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await certificateService.getCertificates();
      setCertificates(data.certificates || data || []);
    } catch (error) {
      toast.error("Failed to load certificates");
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
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (certFile) fd.append("certificateFile", certFile);

      if (editingId) {
        await certificateService.updateCertificate(editingId, fd);
        toast.success("Certificate updated successfully");
      } else {
        await certificateService.createCertificate(fd);
        toast.success("Certificate added successfully");
      }
      resetForm();
      fetchCertificates();
    } catch (error) {
      toast.error(error.message || "Failed to save certificate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cert) => {
    setForm({
      title: cert.title || "",
      issuer: cert.issuer || "",
      issueDate: cert.issueDate ? cert.issueDate.slice(0, 10) : "",
      credentialId: cert.credentialId || "",
      verifyLink: cert.verifyLink || "",
      order: cert.order ?? 0,
    });
    setEditingId(cert._id);
    setShowForm(true);
    setCertFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await certificateService.deleteCertificate(id);
      toast.success("Certificate deleted");
      fetchCertificates();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setCertFile(null);
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const items = [...certificates];
    const temp = items[index].order;
    items[index].order = items[index - 1].order;
    items[index - 1].order = temp;
    try {
      await Promise.all([
        certificateService.updateCertificate(items[index]._id, { order: items[index].order }),
        certificateService.updateCertificate(items[index - 1]._id, { order: items[index - 1].order }),
      ]);
      fetchCertificates();
    } catch { toast.error("Failed to reorder"); }
  };

  const moveDown = async (index) => {
    if (index === certificates.length - 1) return;
    const items = [...certificates];
    const temp = items[index].order;
    items[index].order = items[index + 1].order;
    items[index + 1].order = temp;
    try {
      await Promise.all([
        certificateService.updateCertificate(items[index]._id, { order: items[index].order }),
        certificateService.updateCertificate(items[index + 1]._id, { order: items[index + 1].order }),
      ]);
      fetchCertificates();
    } catch { toast.error("Failed to reorder"); }
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-emerald-400 tracking-[0.3em] uppercase mb-2">Admin</p>
            <h1 className="text-3xl font-bold text-white">Manage Certificates</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              + Add Certificate
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className={`${card} mb-8`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white">
                {editingId ? "Edit Certificate" : "Add Certificate"}
              </h2>
              <button type="button" onClick={resetForm} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={label}>Title *</label>
                <input className={inp} name="title" value={form.title} onChange={handleChange} placeholder="e.g. AWS Solutions Architect" required />
              </div>
              <div>
                <label className={label}>Issuer *</label>
                <input className={inp} name="issuer" value={form.issuer} onChange={handleChange} placeholder="e.g. Amazon Web Services" required />
              </div>
              <div>
                <label className={label}>Issue Date</label>
                <input className={inp} name="issueDate" type="date" value={form.issueDate} onChange={handleChange} />
              </div>
              <div>
                <label className={label}>Sort Order</label>
                <input className={inp} name="order" type="number" value={form.order} onChange={handleChange} />
              </div>
              <div>
                <label className={label}>Credential ID</label>
                <input className={inp} name="credentialId" value={form.credentialId} onChange={handleChange} placeholder="e.g. AWS-SAA-001" />
              </div>
              <div>
                <label className={label}>Verify Link</label>
                <input className={inp} name="verifyLink" value={form.verifyLink} onChange={handleChange} placeholder="https://credential.example.com/..." />
              </div>
            </div>

            {/* Certificate file upload */}
            <div className="mb-4">
              <label className={label}>Certificate File (image or PDF)</label>
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-white/[0.16] transition-all">
                  <p className="text-xs text-slate-400">
                    {certFile ? certFile.name : editingId ? "Click to replace certificate file" : "Click to upload certificate (image or PDF)"}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*,.pdf,application/pdf" onChange={(e) => setCertFile(e.target.files[0])} />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingId ? "Update Certificate" : "Add Certificate"}
            </button>
          </form>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-sm">No certificates yet. Click "Add Certificate" to begin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert, index) => (
              <div key={cert._id} className={`${card} flex items-start gap-4`}>
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="text-slate-600 hover:text-white disabled:opacity-30 text-xs leading-none">▲</button>
                  <button onClick={() => moveDown(index)} disabled={index === certificates.length - 1} className="text-slate-600 hover:text-white disabled:opacity-30 text-xs leading-none">▼</button>
                </div>
                {cert.certificateFile && (
                  cert.certificateFile.includes(".pdf") ? (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20 shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                  ) : (
                    <img src={cert.certificateFile} alt={cert.title} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/[0.08]" onError={(e) => { e.target.style.display = "none"; }} />
                  )
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-white">{cert.title}</h3>
                    <span className="text-xs text-slate-500">by</span>
                    <span className="text-xs text-emerald-300">{cert.issuer}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {cert.issueDate ? formatDate(cert.issueDate) : ""}
                    {cert.credentialId ? ` . ${cert.credentialId}` : ""}
                  </p>
                  {cert.verifyLink && (
                    <a href={cert.verifyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline mt-0.5 inline-block">Verify →</a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(cert)} className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">Edit</button>
                  <button onClick={() => handleDelete(cert._id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {certificates.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex items-start gap-3">
            <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-emerald-300/70">
              Use ▲/▼ arrows to reorder. Certificates display on the Certificates page sorted by order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
