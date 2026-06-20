import { motion } from "framer-motion";

// ── Loader ────────────────────────────────────────────────────────────
const Loader = ({ text = "Loading..." }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[#07070e]"
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[400px] h-[400px] rounded-full bg-blue-700/[0.07] blur-[100px]"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[300px] h-[300px] rounded-full bg-violet-700/[0.07] blur-[90px]"
        />
      </div>

      {/* ── Spinner container ── */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* ── Ring stack ── */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer spinning ring */}
          <motion.span
            className="absolute inset-0 rounded-full border border-transparent
              border-t-blue-500/70 border-r-blue-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
          />

          {/* Inner spinning ring — opposite direction */}
          <motion.span
            className="absolute inset-[6px] rounded-full border border-transparent
              border-t-violet-500/70 border-r-violet-500/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.0, ease: "linear", repeat: Infinity }}
          />

          {/* Center glow dot */}
          <motion.span
            className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-violet-400
              shadow-[0_0_10px_rgba(139,92,246,0.7)]"
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        {/* ── Label ── */}
        {text && (
          <motion.p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-400"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Loader;
