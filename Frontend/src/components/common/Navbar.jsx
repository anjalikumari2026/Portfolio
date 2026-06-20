import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";
import resumeService from "@/services/resumeService";

const Navbar = () => {
  const { profile, loading } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeFetching, setResumeFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleResumeClick = useCallback((e) => {
    if (resumeUrl) return;
    e.preventDefault();
    if (resumeFetching) return;
    setResumeFetching(true);
    resumeService.getResume().then((data) => {
      if (data?.resume?.resumeUrl) {
        setResumeUrl(data.resume.resumeUrl);
        window.open(data.resume.resumeUrl, "_blank", "noopener");
      }
    }).catch(() => {}).finally(() => setResumeFetching(false));
  }, [resumeUrl, resumeFetching]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Projects", to: "/projects" },
    { label: "Certificates", to: "/certificates" },
    { label: "Contact", to: "/contact" },
  ];

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors duration-300 group
     ${isActive ? "text-white" : "text-slate-400 hover:text-white"}`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            scrolled
              ? "py-3 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
              : "py-5 bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/admin/login"
            className="group flex items-center gap-2 no-underline cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            {/* Avatar or fallback dot */}
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover border border-white/[0.15]"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <span
                className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-violet-500
                group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
              />
            )}
            <span
              className="text-white font-bold text-lg tracking-tight
              bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent
              group-hover:from-blue-300 group-hover:via-white group-hover:to-violet-300
              transition-all duration-500"
            >
              {loading ? (
                <span className="inline-block w-24 h-5 rounded bg-white/[0.06] animate-pulse" />
              ) : (
                profile?.name || ""
              )}
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={linkClass}
                end={to === "/"}
              >
                {label}
                {/* Animated underline */}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-blue-400 to-violet-500
                  group-hover:w-full transition-all duration-300 rounded-full"
                />
              </NavLink>
            ))}

            {/* Social Icons */}
            <div className="flex items-center gap-1.5">
              {[
                { key: "github", url: profile?.github, label: "GitHub" },
                { key: "linkedin", url: profile?.linkedin, label: "LinkedIn" },
                { key: "twitter", url: profile?.twitter, label: "Twitter" },
                { key: "website", url: profile?.website, label: "Website" },
              ].filter((s) => s.url && (s.url.startsWith("http://") || s.url.startsWith("https://"))).map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  {s.key === "github" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                  )}
                  {s.key === "linkedin" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  )}
                  {s.key === "twitter" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  )}
                  {s.key === "website" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  )}
                </a>
              ))}
            </div>

            {/* Resume CTA */}
            <a
              href={resumeUrl || "#"}
              onClick={handleResumeClick}
              target={resumeUrl ? "_blank" : undefined}
              rel={resumeUrl ? "noopener noreferrer" : undefined}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all duration-300 group overflow-hidden
                ${resumeUrl
                  ? "text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.55)]"
                  : "text-slate-500 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
            >
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                bg-gradient-to-r from-transparent via-white/10 to-transparent
                transition-transform duration-700 skew-x-12"
              />
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {resumeFetching ? "Loading..." : "Resume"}
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5
              rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <span
              className={`block h-px w-5 bg-white rounded-full transition-all duration-300
              ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-white rounded-full transition-all duration-300
              ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-white rounded-full transition-all duration-300
              ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72
            bg-[#0d0d14]/95 backdrop-blur-2xl border-l border-white/[0.07]
            flex flex-col pt-24 pb-10 px-8 gap-2
            transition-transform duration-400 ease-out
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Decorative gradient blob */}
          <div
            className="absolute top-20 right-0 w-40 h-40 rounded-full
            bg-violet-600/10 blur-3xl pointer-events-none"
          />

          {navLinks.map(({ label, to }, i) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                 transition-all duration-300 no-underline
                 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                 ${
                   isActive
                     ? "text-white bg-white/[0.08] border border-white/[0.08]"
                     : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                 }`
              }
            >
              <span className="w-1 h-1 rounded-full bg-blue-400/60" />
              {label}
            </NavLink>
          ))}

          {/* Mobile Social Icons */}
          <div className="flex items-center justify-center gap-3 mt-4 mb-2">
            {[
              { key: "github", url: profile?.github, label: "GitHub" },
              { key: "linkedin", url: profile?.linkedin, label: "LinkedIn" },
              { key: "twitter", url: profile?.twitter, label: "Twitter" },
              { key: "website", url: profile?.website, label: "Website" },
            ].filter((s) => s.url && (s.url.startsWith("http://") || s.url.startsWith("https://"))).map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                {s.key === "github" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                )}
                {s.key === "linkedin" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                )}
                {s.key === "twitter" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                )}
                {s.key === "website" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                )}
              </a>
            ))}
          </div>

          {/* Mobile Resume */}
          <a
            href={resumeUrl || "#"}
            onClick={(e) => { setMenuOpen(false); handleResumeClick(e); }}
            target={resumeUrl ? "_blank" : undefined}
            rel={resumeUrl ? "noopener noreferrer" : undefined}
            className={`mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              font-semibold text-sm transition-all duration-300
              ${resumeUrl
                ? "text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                : "text-slate-500 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {resumeFetching ? "Loading..." : "Download Resume"}
          </a>

          {/* Bottom tagline */}
          <p className="mt-auto text-xs text-slate-600 text-center">
            &copy; {new Date().getFullYear()} {profile?.name || ""}
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
