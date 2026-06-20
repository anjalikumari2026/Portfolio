import { useState, useEffect } from "react";
import useInView from "../../hooks/useInView";
import certificateService from "@/services/certificateService";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function isPdf(url) {
  return url?.includes(".pdf");
}

export default function CertificatesPage() {
  const [headerRef, headerInView] = useInView();
  const [gridRef, gridInView] = useInView();
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await certificateService.getCertificates();
        setCertificates(data.certificates || data || []);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#07070e] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <section
        ref={headerRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16"
      >
        <div
          className={`transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-xs text-emerald-400 tracking-[0.3em] uppercase mb-3">
            Credentials
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Certificates &{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Achievements
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl">
            Industry-recognized certifications validating my expertise across
            cloud infrastructure, frontend engineering, and full-stack
            development.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section
        ref={gridRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pb-28"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.length > 0 ? (
            certificates.map((cert, i) => (
              <div
                key={cert._id}
                className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:-translate-y-2 hover:shadow-xl transition-all duration-400"
                style={{
                  opacity: gridInView ? 1 : 0,
                  transform: gridInView ? "translateY(0)" : "translateY(24px)",
                  transition: `all 0.5s ease ${i * 90}ms`,
                }}
              >
                {/* Verified badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-emerald-400 font-medium">Verified</span>
                </div>

                {/* Thumbnail / icon */}
                <div className="mb-4">
                  {cert.certificateFile && !isPdf(cert.certificateFile) ? (
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.06]">
                      <img
                        src={cert.certificateFile}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl">🏆</div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/[0.06] flex items-center justify-center">
                      {cert.certificateFile && isPdf(cert.certificateFile) ? (
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      ) : (
                        <span className="text-4xl">🏆</span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-1 pr-14">{cert.title}</h3>
                <p className="text-xs text-emerald-300 mb-1">{cert.issuer}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(cert.issueDate)}
                  {cert.credentialId ? ` · ${cert.credentialId}` : ""}
                </p>

                {/* Actions row */}
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2">
                  {cert.certificateFile && (
                    <a
                      href={cert.certificateFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View Certificate
                    </a>
                  )}
                  {cert.verifyLink && (
                    <a
                      href={cert.verifyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-1.5 rounded-lg text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 hover:-translate-y-0.5 transition-all duration-300"
                      title="Verify credential"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-slate-500">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-sm">No certificates to display yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
