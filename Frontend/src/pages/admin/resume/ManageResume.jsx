import { useState, useEffect } from "react";
import resumeService from "@/services/resumeService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

export default function ManageResume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getResume();
      setResume(data?.resume || null);
    } catch {
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const data = await resumeService.uploadResume(selectedFile);
      toast.success(data.message || "Resume uploaded successfully");
      setResume(data.resume);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume) return;
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await resumeService.deleteResume();
      toast.success("Resume deleted");
      setResume(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">Admin</p>
        <h1 className="text-3xl font-bold text-white mb-8">Manage Resume</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : (
          <>
            {/* Current Resume */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm mb-6">
              <h2 className="text-sm font-bold text-white mb-4">Current Resume</h2>

              {resume ? (
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{resume.fileName || "Resume"}</p>
                      <p className="text-xs text-slate-500">Uploaded {formatDate(resume.uploadedAt || resume.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={resume.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-red-400 hover:border-red-500/20 disabled:opacity-40 transition-all"
                    >
                      {deleting ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-white/[0.06] text-slate-500 text-sm">
                  <span>📭</span> No resume uploaded yet.
                </div>
              )}
            </div>

            {/* Upload / Replace */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-4">
                {resume ? "Replace Resume" : "Upload Resume"}
              </h2>

              <label className="cursor-pointer block">
                <div className="border-2 border-dashed rounded-2xl p-8 text-center border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02] transition-all duration-300">
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-sm text-slate-400 mb-1">
                    {selectedFile ? selectedFile.name : "Click to select a PDF file"}
                  </p>
                  <p className="text-xs text-slate-600">Max 10MB · PDF only</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3 min-w-0">
                    <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-slate-300 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500 shrink-0">({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 transition-all"
                    >
                      {uploading ? "Uploading..." : resume ? "Replace" : "Upload"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-5 p-4 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 flex items-start gap-3">
              <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-cyan-300/70">
                Uploading a new resume automatically replaces the old one. The latest resume will be available for download on your portfolio.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
