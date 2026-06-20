import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// ── DashboardLayout ───────────────────────────────────────────────────
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07070e] flex overflow-hidden">
      {/* ── Background atmosphere ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full
            bg-blue-700/[0.05] blur-[120px]"
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full
            bg-violet-700/[0.05] blur-[100px]"
        />
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      {/* Desktop: always visible | Mobile: slide-in drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Right panel: Topbar + Content ── */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable content */}
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex-1 overflow-y-auto
            px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
