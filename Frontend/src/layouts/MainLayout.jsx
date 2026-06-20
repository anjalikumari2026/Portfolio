import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// ── MainLayout ────────────────────────────────────────────────────────
const MainLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[#07070e] text-white overflow-x-hidden">
      {/* ── Global background atmosphere ── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {/* Top-left orb */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full
            bg-blue-700/[0.06] blur-[140px]"
        />
        {/* Top-right orb */}
        <div
          className="absolute -top-20 right-0 w-[500px] h-[400px] rounded-full
            bg-violet-700/[0.05] blur-[120px]"
        />
        {/* Bottom-center orb */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2
            w-[700px] h-[300px] rounded-full
            bg-indigo-700/[0.04] blur-[130px]"
        />

        {/* Subtle noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Page content ── */}
      <main className="relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Scroll to top FAB ── */}
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
