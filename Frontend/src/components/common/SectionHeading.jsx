import { motion } from "framer-motion";

// ── Animation variants ────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  },
});

// ── SectionHeading ────────────────────────────────────────────────────
const SectionHeading = ({ label, title, description, align = "center" }) => {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 ${
        isCenter ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {/* ── Label pill ── */}
      {label && (
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              text-[10px] font-semibold tracking-[0.2em] uppercase
              border border-blue-500/20 bg-blue-500/[0.08] text-blue-400"
          >
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            {label}
          </span>
        </motion.div>
      )}

      {/* ── Main heading ── */}
      {title && (
        <motion.h2
          variants={fadeUp(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight
            tracking-tight text-white max-w-3xl"
        >
          {/* Split on last word to apply gradient accent to it */}
          {title.split(" ").length > 2 ? (
            <>
              {title.split(" ").slice(0, -2).join(" ")}{" "}
              <span
                className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400
                  bg-clip-text text-transparent"
              >
                {title.split(" ").slice(-2).join(" ")}
              </span>
            </>
          ) : (
            <span
              className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400
                bg-clip-text text-transparent"
            >
              {title}
            </span>
          )}
        </motion.h2>
      )}

      {/* ── Divider ── */}
      <motion.div
        variants={fadeUp(0.18)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={`flex items-center gap-2 ${isCenter ? "self-center" : "self-start"}`}
      >
        <div
          className="w-12 h-px rounded-full
            bg-gradient-to-r from-transparent to-blue-500/60"
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-violet-400
            shadow-[0_0_6px_rgba(167,139,250,0.8)]"
        />
        <div
          className="w-12 h-px rounded-full
            bg-gradient-to-l from-transparent to-violet-500/60"
        />
      </motion.div>

      {/* ── Description ── */}
      {description && (
        <motion.p
          variants={fadeUp(0.26)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className={`text-slate-400 text-base sm:text-lg leading-relaxed
            max-w-2xl ${isCenter ? "self-center" : "self-start"}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
