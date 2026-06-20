import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";

// ── Route → page title map ────────────────────────────────────────────
const PAGE_TITLES = {
  "/admin/dashboard": { title: "Dashboard", sub: "Overview of your portfolio" },
  "/admin/dashboard/profile": { title: "Profile", sub: "Manage your personal info" },
  "/admin/dashboard/projects": { title: "Projects", sub: "Showcase your work" },
  "/admin/dashboard/skills": { title: "Skills", sub: "Highlight your expertise" },
  "/admin/dashboard/certificates": {
    title: "Certificates",
    sub: "Your achievements",
  },
  "/admin/dashboard/experience": {
    title: "Experience",
    sub: "Your professional journey",
  },
  "/admin/dashboard/resume": { title: "Resume", sub: "Manage your resume" },
  "/admin/dashboard/messages": { title: "Messages", sub: "Inbox from visitors" },
};

// ── Bell icon ─────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

// ── Search icon ───────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// ── Hamburger icon ────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

// ── Topbar ────────────────────────────────────────────────────────────
const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] ?? { title: "Admin", sub: "Welcome back" };

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-20 shrink-0
        px-4 sm:px-6 lg:px-8 py-3
        bg-[#07070e]/80 backdrop-blur-xl
        border-b border-white/[0.06]"
    >
      {/* Horizontal glow line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none
          bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
      />

      <div className="flex items-center gap-3 sm:gap-4">
        {/* ── Mobile menu button ── */}
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="lg:hidden w-8 h-8 flex items-center justify-center shrink-0
            rounded-lg border border-white/[0.08] bg-white/[0.03]
            text-slate-400 hover:text-white hover:border-white/20
            hover:bg-white/[0.06] transition-all duration-200"
        >
          <MenuIcon />
        </button>

        {/* ── Page title (left) ── */}
        <div className="flex flex-col leading-none gap-1 mr-auto min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
            {page.title}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 tracking-wide hidden sm:block truncate">
            {page.sub}
          </p>
        </div>

        {/* ── Search placeholder ── */}
        <div
          className="hidden md:flex items-center gap-2.5
            px-3.5 py-2 rounded-xl
            bg-white/[0.03] border border-white/[0.07]
            text-slate-500 text-xs
            hover:bg-white/[0.055] hover:border-white/[0.12] hover:text-slate-400
            transition-all duration-200 cursor-pointer select-none w-44 lg:w-56"
        >
          <SearchIcon />
          <span>Search…</span>
          <span
            className="ml-auto text-[10px] tracking-wider px-1.5 py-0.5 rounded-md
              border border-white/[0.08] bg-white/[0.03] text-slate-600"
          >
            ⌘K
          </span>
        </div>

        {/* ── Notification bell ── */}
        <button
          aria-label="Notifications"
          className="relative w-8 h-8 flex items-center justify-center shrink-0
            rounded-xl border border-white/[0.08] bg-white/[0.03]
            text-slate-400 hover:text-white hover:border-blue-500/20
            hover:bg-white/[0.06] hover:shadow-[0_0_14px_rgba(99,102,241,0.12)]
            transition-all duration-200"
        >
          <BellIcon />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full
              bg-gradient-to-br from-blue-400 to-violet-400
              shadow-[0_0_5px_rgba(139,92,246,0.7)]"
          />
        </button>

        {/* ── Divider ── */}
        <div className="hidden sm:block w-px h-6 bg-white/[0.08] shrink-0" />

        {/* ── Admin profile chip ── */}
        <div
          className="group flex items-center gap-2.5 shrink-0
            px-2 sm:px-3 py-1.5 rounded-xl
            border border-white/[0.08] bg-white/[0.03]
            hover:bg-white/[0.06] hover:border-blue-500/20
            hover:shadow-[0_0_14px_rgba(99,102,241,0.1)]
            transition-all duration-200 cursor-pointer select-none"
        >
          {/* Avatar */}
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 overflow-hidden
              bg-gradient-to-br from-blue-500/20 to-violet-500/20
              border border-white/[0.1]
              group-hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]
              transition-all duration-200"
          >
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <span
                className="text-[9px] font-bold
                  bg-gradient-to-br from-blue-400 to-violet-400
                  bg-clip-text text-transparent leading-none"
              >
                AP
              </span>
            )}
          </div>

          {/* Name — hidden on very small screens */}
          <div className="hidden sm:flex flex-col leading-none gap-0.5">
            <span className="text-[11px] font-semibold text-slate-300">
              {user?.name || "Admin"}
            </span>
            <span className="text-[9px] text-slate-600 tracking-widest uppercase">
              Admin
            </span>
          </div>

          {/* Chevron */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3 text-slate-600 group-hover:text-slate-400
              transition-colors duration-200 hidden sm:block shrink-0"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;
