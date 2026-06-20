import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── ScrollToTop ───────────────────────────────────────────────────────
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  // Show after scrolling 320px down
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={handleClick}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 group
            w-11 h-11 flex items-center justify-center
            rounded-xl
            bg-white/[0.03] border border-white/[0.08]
            backdrop-blur-md
            shadow-[0_0_0_0_rgba(99,102,241,0)]
            hover:bg-white/[0.07]
            hover:border-blue-500/30
            hover:shadow-[0_0_22px_rgba(99,102,241,0.22)]
            transition-colors duration-300"
        >
          {/* Gradient top-bar on hover */}
          <span
            className="absolute top-0 left-3 right-3 h-px rounded-full
              bg-gradient-to-r from-blue-500/0 via-indigo-400/70 to-violet-500/0
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Arrow icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-slate-400 group-hover:text-white
              transition-colors duration-300"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
