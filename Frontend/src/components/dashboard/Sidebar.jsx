import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import contactService from "@/services/contactService";

// ── Nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Profile",
    to: "/admin/dashboard/profile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: "Projects",
    to: "/admin/dashboard/projects",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "Skills",
    to: "/admin/dashboard/skills",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Certificates",
    to: "/admin/dashboard/certificates",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M9 13.5l-2 7 5-3 5 3-2-7" />
      </svg>
    ),
  },
  {
    label: "Education",
    to: "/admin/dashboard/education",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
  },
  {
    label: "Experience",
    to: "/admin/dashboard/experience",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <path d="M12 12v4M10 14h4" />
      </svg>
    ),
  },
  {
    label: "Resume",
    to: "/admin/dashboard/resume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    label: "Messages",
    to: "/admin/dashboard/messages",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────
const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await contactService.getUnreadCount();
        setUnreadCount(data.count ?? 0);
      } catch {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div
      className="flex flex-col w-64 h-full
        bg-[#07070e] border-r border-white/[0.06]
        backdrop-blur-xl overflow-hidden"
    >
      {/* ── Logo / Brand ── */}
      <div className="relative px-5 py-6 flex items-center justify-between shrink-0">
        {/* Horizontal divider glow at bottom */}
        <div
          className="absolute bottom-0 left-4 right-4 h-px
            bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />

        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden
              bg-gradient-to-br from-blue-500/20 to-violet-500/20
              border border-white/[0.08]
              shadow-[0_0_14px_rgba(99,102,241,0.15)]"
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
                className="text-xs font-bold
                  bg-gradient-to-br from-blue-400 to-violet-400
                  bg-clip-text text-transparent"
              >
                AP
              </span>
            )}
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[13px] font-semibold text-white tracking-tight">
              {user?.name || "Admin"}
            </span>
            <span className="text-[10px] text-slate-500 tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden w-7 h-7 flex items-center justify-center
            rounded-lg border border-white/[0.08] bg-white/[0.03]
            text-slate-400 hover:text-white hover:border-white/20
            transition-colors duration-200"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="w-3.5 h-3.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Section label ── */}
      <div className="px-5 pt-5 pb-2 shrink-0">
        <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-slate-600">
          Navigation
        </span>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, to, icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.045,
            }}
          >
            <NavLink
              to={to}
              end={to === "/admin/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-250 select-none
                ${
                  isActive
                    ? // Active state
                      "bg-white/[0.06] border border-blue-500/25 text-white shadow-[0_0_18px_rgba(99,102,241,0.12)]"
                    : // Default state
                      "text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.04] hover:border-white/[0.07]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active top accent bar */}
                  {isActive && (
                    <span
                      className="absolute top-0 left-4 right-4 h-px rounded-full
                        bg-gradient-to-r from-blue-500/0 via-indigo-400/70 to-violet-500/0"
                    />
                  )}

                  {/* Icon */}
                  <span
                    className={`shrink-0 transition-all duration-250
                      ${
                        isActive
                          ? "bg-gradient-to-br from-blue-400 to-violet-400 bg-clip-text text-transparent [&>svg]:stroke-current"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                  >
                    {icon}
                  </span>

                  {/* Label */}
                  <span className="flex-1 group-hover:translate-x-0.5 transition-transform duration-200">
                    {label}
                  </span>

                  {/* Unread badge */}
                  {label === "Messages" && unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}

                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0
                        bg-gradient-to-br from-blue-400 to-violet-400
                        shadow-[0_0_6px_rgba(139,92,246,0.7)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* ── Bottom: Logout ── */}
      <div className="relative px-3 pb-5 pt-3 shrink-0">
        {/* Top divider */}
        <div
          className="absolute top-0 left-4 right-4 h-px
            bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        />

        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-slate-400 border border-transparent
            hover:text-red-400 hover:bg-red-500/[0.06] hover:border-red-500/20
            transition-all duration-250 select-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-red-400 transition-colors duration-250"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
