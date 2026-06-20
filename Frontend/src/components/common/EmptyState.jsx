import { motion } from "framer-motion";

// ── Default icon (inbox/empty box) ───────────────────────────────────
const DefaultIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7"
  >
    <path d="M3 9l1.5-6h15L21 9" />
    <path d="M3 9h18v9a3 3 0 01-3 3H6a3 3 0 01-3-3V9z" />
    <path d="M9 13h6" />
  </svg>
);

// ── EmptyState ────────────────────────────────────────────────────────
const EmptyState = ({
  title = "Nothing Here Yet",
  description = "There's nothing to display at the moment. Check back soon.",
  buttonText,
  onAction,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex justify-center px-4 py-8"
    >
      <div
        className="group relative flex flex-col items-center gap-5
          max-w-sm w-full text-center
          px-8 py-10 rounded-2xl
          bg-white/[0.03] border border-white/[0.08]
          backdrop-blur-md
          hover:bg-white/[0.055] hover:border-blue-500/20
          hover:shadow-[0_0_32px_rgba(99,102,241,0.1)]
          transition-all duration-350 ease-out"
      >
        {/* Top accent bar — visible on hover */}
        <span
          className="absolute top-0 left-8 right-8 h-px rounded-full
            bg-gradient-to-r from-blue-500/0 via-indigo-400/60 to-violet-500/0
            opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        />

        {/* ── Icon bubble ── */}
        <div
          className="w-16 h-16 flex items-center justify-center rounded-xl
            bg-white/[0.03] border border-white/[0.08]
            group-hover:border-blue-500/20
            group-hover:shadow-[0_0_18px_rgba(99,102,241,0.12)]
            transition-all duration-300"
        >
          <span
            className="bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400
              bg-clip-text text-transparent [&>svg]:stroke-current"
          >
            {icon ?? <DefaultIcon />}
          </span>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-px rounded-full bg-gradient-to-r from-transparent to-blue-500/50" />
          <div className="w-1 h-1 rounded-full bg-violet-400 shadow-[0_0_5px_rgba(167,139,250,0.7)]" />
          <div className="w-8 h-px rounded-full bg-gradient-to-l from-transparent to-violet-500/50" />
        </div>

        {/* ── Title ── */}
        <h3
          className="text-white font-semibold text-base sm:text-lg
            leading-snug tracking-tight"
        >
          {title}
        </h3>

        {/* ── Description ── */}
        <p className="text-slate-500 text-sm leading-relaxed -mt-1">
          {description}
        </p>

        {/* ── Optional CTA button ── */}
        {buttonText && onAction && (
          <motion.button
            onClick={onAction}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-1 inline-flex items-center gap-2
              px-5 py-2 rounded-xl text-sm font-semibold
              bg-white/[0.04] border border-white/[0.09]
              text-slate-300
              hover:bg-white/[0.08] hover:border-blue-500/30
              hover:text-white hover:shadow-[0_0_18px_rgba(99,102,241,0.15)]
              transition-all duration-300"
          >
            <span
              className="w-1.5 h-1.5 rounded-full
                bg-gradient-to-br from-blue-400 to-violet-400
                shadow-[0_0_5px_rgba(139,92,246,0.6)]"
            />
            {buttonText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
