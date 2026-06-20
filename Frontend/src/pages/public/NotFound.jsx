import { useEffect, useState } from "react";

export default function NotFound() {
  const [visible, setVisible] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070e] text-white flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div
        className={`relative z-10 text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* 404 */}
        <div className="relative mb-4">
          <span
            className={`text-[160px] md:text-[220px] font-black leading-none select-none bg-gradient-to-b from-white/10 to-white/[0.02] bg-clip-text text-transparent block ${glitch ? "translate-x-1" : ""} transition-transform duration-75`}
            aria-hidden
          >
            404
          </span>
          {glitch && (
            <>
              <span className="absolute inset-0 text-[160px] md:text-[220px] font-black leading-none select-none text-cyan-400/20 block translate-x-2 -translate-y-1">
                404
              </span>
              <span className="absolute inset-0 text-[160px] md:text-[220px] font-black leading-none select-none text-violet-400/20 block -translate-x-2 translate-y-1">
                404
              </span>
            </>
          )}
        </div>

        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-slate-400 font-mono tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            SIGNAL_LOST :: PAGE_NOT_FOUND
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Lost in the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            digital void
          </span>
        </h1>
        <p className="text-slate-400 max-w-sm mx-auto mb-10 text-sm">
          The page you're looking for has drifted into the void. Let's get you
          back to familiar territory.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            ← Back to Home
          </a>
          <a
            href="/contact"
            className="px-8 py-3.5 rounded-xl border border-white/[0.10] bg-white/[0.03] text-slate-300 font-semibold text-sm hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Report Issue
          </a>
        </div>

        {/* Coordinates decorative */}
        <div className="mt-16 text-xs text-slate-700 font-mono">
          ERR:404 / NS:PUBLIC / TS:{Date.now()}
        </div>
      </div>
    </div>
  );
}
