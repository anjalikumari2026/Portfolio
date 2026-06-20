import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import resumeService from "@/services/resumeService";

// ── Icon components (inline SVG — zero external deps) ─────────────────
const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M12 10v6m0 0l-3-3m3 3l3-3" />
    <path d="M20 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" />
  </svg>
);

const ProjectsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M4 6h16M4 10h16M4 14h10" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5 text-blue-400 shrink-0"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Highlights list ───────────────────────────────────────────────────
const HIGHLIGHTS = [
  "MCA Graduate with full-stack development expertise",
  "React, Node.js, Express & modern web technologies",
  "Hands-on projects from frontend to backend systems",
  "Clean code practices, REST APIs & database design",
];

// ── Main Component ────────────────────────────────────────────────────
const ResumeDownload = () => {
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    resumeService.getResume().then((data) => {
      if (data?.resume?.resumeUrl) setResumeUrl(data.resume.resumeUrl);
    }).catch(() => {});
  }, []);

  // Scroll-triggered entrance (Framer Motion)
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Staggered fade variants — mirrors the useFadeIn pattern
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden bg-[#07070e]"
    >
      {/* ── Background blobs (same palette as HeroSection) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-0 left-1/4 w-[440px] h-[440px] rounded-full bg-blue-700/8 blur-[110px]" />
        <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] rounded-full bg-violet-700/10 blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[260px] h-[260px] rounded-full bg-indigo-800/8 blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Content wrapper ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="relative z-10 max-w-3xl mx-auto"
      >
        {/* Section label */}
        <motion.div variants={item} className="flex justify-center mb-5">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
            font-medium tracking-widest uppercase
            border border-blue-500/25 bg-blue-500/8 text-blue-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Resume
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div variants={item} className="text-center mb-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            <span className="text-white">Download My </span>
            <span className="relative inline-block">
              <span
                className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400
                bg-clip-text text-transparent"
              >
                Resume
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-px
                bg-gradient-to-r from-blue-400 to-violet-400 rounded-full opacity-60"
              />
            </span>
          </h2>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={item}
          className="text-center text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10"
        >
          A comprehensive overview of my technical background, hands-on
          projects, and skills — crafted to give you everything you need in one
          clean document.
        </motion.p>

        {/* ── Glass card ── */}
        <motion.div
          variants={item}
          className="relative rounded-2xl overflow-hidden
            border border-white/10 bg-white/[0.03] backdrop-blur-sm
            shadow-[0_0_60px_rgba(99,102,241,0.08)]
            hover:border-violet-500/20 hover:shadow-[0_0_80px_rgba(99,102,241,0.14)]
            transition-all duration-500"
        >
          {/* Top gradient line */}
          <div
            className="absolute top-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
          />

          <div className="p-8 sm:p-10">
            {/* Two-column layout: highlights + CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              {/* Left — highlights */}
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                  What's inside
                </p>
                {HIGHLIGHTS.map((text) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center
                      bg-blue-500/10 border border-blue-500/20 shrink-0"
                    >
                      <CheckIcon />
                    </span>
                    <span className="text-slate-300 text-sm leading-snug">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right — CTA block */}
              <div className="flex flex-col items-center sm:items-end gap-4">
                {/* File chip */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl
                  border border-white/10 bg-white/[0.04]"
                >
                  {/* PDF icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center
                    bg-gradient-to-br from-blue-600/30 to-violet-600/30
                    border border-white/10"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-blue-300"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-none">
                      Alok_Patel_Resume.pdf
                    </p>
                    <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                      Updated · 2025
                    </p>
                  </div>
                </div>

                {/* Primary download button */}
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-full sm:w-auto inline-flex items-center
                      justify-center gap-2 px-6 py-3 rounded-xl
                      text-sm font-semibold text-white overflow-hidden
                      bg-gradient-to-r from-blue-600 to-violet-600
                      hover:from-blue-500 hover:to-violet-500
                      shadow-[0_0_20px_rgba(99,102,241,0.3)]
                      hover:shadow-[0_0_36px_rgba(99,102,241,0.55)]
                      transition-all duration-300"
                  >
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                      bg-gradient-to-r from-transparent via-white/10 to-transparent
                      transition-transform duration-700 skew-x-12"
                    />
                    <DownloadIcon />
                    Download Resume
                  </a>
                ) : (
                  <span
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                      text-sm font-semibold text-slate-600 bg-white/[0.03] border border-white/[0.06] cursor-not-allowed"
                  >
                    Resume unavailable
                  </span>
                )}

                {/* Secondary — View Projects */}
                <a
                  href="/projects"
                  className="group w-full sm:w-auto inline-flex items-center
                    justify-center gap-2 px-6 py-3 rounded-xl
                    text-sm font-semibold text-slate-400 hover:text-white
                    border border-white/8 hover:border-violet-500/40 bg-transparent
                    transition-all duration-300"
                >
                  <ProjectsIcon />
                  View Projects
                </a>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
          />
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={item}
          className="text-center text-xs text-slate-600 mt-6 tracking-wide"
        >
          PDF format · Last updated 2025 · Available on request
        </motion.p>
      </motion.div>
    </section>
  );
};

export default ResumeDownload;
