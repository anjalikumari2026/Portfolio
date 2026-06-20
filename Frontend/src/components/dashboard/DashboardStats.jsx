import { motion } from "framer-motion";

const STATS = [
  {
    title: "Total Projects",
    value: "3",
    trend: "+0 this month",
    trendUp: false,
    accent: "from-blue-500 to-cyan-500",
    glow: "hover:shadow-[0_0_28px_rgba(59,130,246,0.15)]",
    border: "hover:border-blue-500/30",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Skills",
    value: "15",
    trend: "+0 this month",
    trendUp: false,
    accent: "from-violet-500 to-purple-500",
    glow: "hover:shadow-[0_0_28px_rgba(139,92,246,0.15)]",
    border: "hover:border-violet-500/30",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Certificates",
    value: "6",
    trend: "+0 this month",
    trendUp: false,
    accent: "from-indigo-500 to-blue-500",
    glow: "hover:shadow-[0_0_28px_rgba(99,102,241,0.15)]",
    border: "hover:border-indigo-500/30",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M9 13.5l-2 7 5-3 5 3-2-7" />
      </svg>
    ),
  },
  {
    title: "Messages",
    value: "0",
    trend: "0 unread",
    trendUp: false,
    accent: "from-sky-500 to-blue-500",
    glow: "hover:shadow-[0_0_28px_rgba(14,165,233,0.15)]",
    border: "hover:border-sky-500/30",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

// ── StatCard ──────────────────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  trend,
  trendUp,
  accent,
  glow,
  border,
  icon,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.1,
    }}
    whileHover={{ y: -4 }}
    className={`group relative flex flex-col gap-4 p-5 rounded-2xl
      bg-white/[0.03] border border-white/[0.08]
      backdrop-blur-md cursor-default select-none
      hover:bg-white/[0.055]
      ${border} ${glow}
      transition-all duration-300 ease-out overflow-hidden`}
  >
    {/* Top accent bar */}
    <span
      className={`absolute top-0 left-5 right-5 h-px rounded-full
        bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-60
        transition-opacity duration-400`}
    />

    {/* ── Header row ── */}
    <div className="flex items-start justify-between gap-3">
      {/* Icon bubble */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          bg-white/[0.04] border border-white/[0.08]
          group-hover:border-white/[0.15]
          group-hover:shadow-[0_0_14px_rgba(99,102,241,0.15)]
          transition-all duration-300"
      >
        <span
          className={`bg-gradient-to-br ${accent} bg-clip-text text-transparent
            [&>svg]:stroke-current`}
        >
          {icon}
        </span>
      </div>

      {/* Trend badge */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg
          text-[10px] font-semibold tracking-wide
          border transition-all duration-300
          ${
            trendUp
              ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.06]"
              : "text-amber-400 border-amber-500/20 bg-amber-500/[0.06]"
          }`}
      >
        {/* Arrow */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-2.5 h-2.5 ${trendUp ? "" : "rotate-180"}`}
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        {trend}
      </span>
    </div>

    {/* ── Value ── */}
    <div className="flex flex-col gap-1">
      <span
        className={`text-3xl font-bold tracking-tight
          bg-gradient-to-br ${accent} bg-clip-text text-transparent`}
      >
        {value}
      </span>
      <span className="text-xs font-medium text-slate-400 tracking-wide">
        {title}
      </span>
    </div>

    {/* ── Bottom divider dot-line ── */}
    <div className="flex items-center gap-1.5 mt-auto pt-1">
      <div
        className={`flex-1 h-px rounded-full
          bg-gradient-to-r from-transparent opacity-0 group-hover:opacity-100
          via-white/[0.08] to-transparent transition-opacity duration-400`}
      />
      <span
        className={`w-1 h-1 rounded-full shrink-0
          bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-80
          shadow-[0_0_4px_rgba(139,92,246,0.6)]
          transition-opacity duration-400`}
      />
      <div
        className={`flex-1 h-px rounded-full
          bg-gradient-to-l from-transparent opacity-0 group-hover:opacity-100
          via-white/[0.08] to-transparent transition-opacity duration-400`}
      />
    </div>
  </motion.div>
);

// ── DashboardStats ────────────────────────────────────────────────────
const DashboardStats = ({ stats = STATS }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {stats.map((stat, i) => (
      <StatCard key={stat.title} {...stat} index={i} />
    ))}
  </div>
);

export default DashboardStats;
