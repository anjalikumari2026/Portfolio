import { useEffect, useState } from "react";
import useInView from "../../hooks/useInView";
import skillService from "@/services/skillService";
import projectService from "@/services/projectService";
import { useProfile } from "@/context/ProfileContext";

function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full bg-white/5 pointer-events-none"
      style={style}
    />
  );
}

export default function HomePage() {
  const { profile, loading } = useProfile();
  const [heroRef, heroInView] = useInView();
  const [introRef, introInView] = useInView();
  const [skillsRef, skillsInView] = useInView();
  const [projectsRef, projectsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [typed, setTyped] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const roles = profile?.title
    ? [profile.title, "UI/UX Enthusiast", "Open Source Contributor"]
    : ["UI/UX Enthusiast", "Open Source Contributor"];
  const [roleIdx, setRoleIdx] = useState(0);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, projectsData] = await Promise.all([
          skillService.getSkills().catch(() => ({ skills: [] })),
          projectService.getProjects().catch(() => ({ projects: [] })),
        ]);
        
        const allSkills = skillsData.skills || skillsData;
        setSkills(allSkills);
        
        const allProjects = projectsData.projects || projectsData;
        const featured = allProjects
          .filter(p => p.featured)
          .slice(0, 3);
        setProjects(featured);

        setStats([
          { label: "Projects Shipped", val: `${allProjects.length}+` },
          { label: "Technologies Used", val: `${allSkills.length}+` },
          { label: "GitHub Repos", val: `${Math.max(allProjects.length, 3)}+` },
          { label: "Years Coding", val: "3+" },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let i = 0;
    let deleting = false;
    let current = roles[roleIdx];
    const tick = () => {
      if (!deleting) {
        setTyped(current.slice(0, i + 1));
        i++;
        if (i === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        setTyped(current.slice(0, i - 1));
        i--;
        if (i === 0) {
          deleting = false;
          setRoleIdx((p) => (p + 1) % roles.length);
          return;
        }
      }
      setTimeout(tick, deleting ? 40 : 70);
    };
    const t = setTimeout(tick, 100);
    return () => clearTimeout(t);
  }, [roleIdx]);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    width: Math.random() * 180 + 30,
    height: Math.random() * 180 + 30,
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    opacity: Math.random() * 0.06 + 0.01,
    filter: `blur(${Math.random() * 60 + 20}px)`,
    background: ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981"][i % 4],
  }));

  return (
    <div className="min-h-screen bg-[#07070e] text-white overflow-x-hidden">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p, i) => (
          <Particle
            key={i}
            style={{ borderRadius: "50%", position: "absolute", ...p }}
          />
        ))}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <div
          className={`transition-all duration-1000 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-slate-400 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for work
          </div>

          <div className="flex flex-col items-center gap-4 mb-4">
            {profile?.profileImage && (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-2 border-white/[0.08] shadow-lg shadow-cyan-500/10"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <span className="block text-white">Hi, I'm</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {profile?.name || ""}
              </span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-slate-400 font-light mt-4 mb-8 h-8">
            <span className="text-slate-300">{typed}</span>
            <span className="w-0.5 h-6 bg-cyan-400 animate-pulse" />
          </div>

          <p className="max-w-xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed mb-10">
            {profile?.bio || ""}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/projects"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              View Projects
            </a>
            <a
              href="/contact"
              className="px-8 py-3.5 rounded-xl border border-white/[0.12] bg-white/[0.04] text-slate-300 font-semibold text-sm hover:border-white/20 hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
            >
              Contact Me
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {[
              { key: "github", url: profile?.github, label: "GitHub" },
              { key: "linkedin", url: profile?.linkedin, label: "LinkedIn" },
              { key: "twitter", url: profile?.twitter, label: "Twitter" },
              { key: "website", url: profile?.website, label: "Website" },
            ].filter((s) => s.url && (s.url.startsWith("http://") || s.url.startsWith("https://"))).map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-300"
              >
                {s.key === "github" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                )}
                {s.key === "linkedin" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                )}
                {s.key === "twitter" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                )}
                {s.key === "website" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                )}
              </a>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 text-slate-600 mt-16 mb-6">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section
        ref={introRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
      >
        <div
          className={`transition-all duration-700 ${introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-4">
            About Me
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                Turning ideas into{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  digital reality
                </span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                With 3+ years of experience building production-grade web
                applications, I bring both technical depth and design
                sensibility to every project.
              </p>
              <p className="text-slate-400 leading-relaxed">
                My expertise spans React, Node.js, MongoDB, and everything in
                between. I'm passionate about clean code, performance
                optimization, and intuitive user experiences.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-center transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="text-3xl font-black bg-gradient-to-br from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    {s.val}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* SKILLS PREVIEW */}
      <section
        ref={skillsRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
      >
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Tech Stack
        </p>
        <h2 className="text-3xl font-bold text-white mb-12">
          Skills &{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Expertise
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.length > 0 ? (
            skills.map((skill, i) => (
              <div
                key={skill._id || skill.id || skill.name}
                className={`group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-500`}
                style={{
                  transitionDelay: skillsInView ? `${i * 80}ms` : "0ms",
                  opacity: skillsInView ? 1 : 0,
                  transform: skillsInView ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{skill.icon || "⚡"}</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-1000"
                    style={{ width: skillsInView ? `${skill.level}%` : "0%" }}
                  />
                </div>
              </div>
            ))
          ) : (
            // Fallback static data
            [
              { name: "React", icon: "⚛️", level: 92 },
              { name: "Node.js", icon: "🟢", level: 88 },
              { name: "MongoDB", icon: "🍃", level: 82 },
              { name: "Express", icon: "🚂", level: 85 },
              { name: "TypeScript", icon: "🔷", level: 78 },
              { name: "Tailwind CSS", icon: "🎨", level: 95 },
            ].map((skill, i) => (
              <div
                key={skill.name}
                className={`group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-500`}
                style={{
                  transitionDelay: skillsInView ? `${i * 80}ms` : "0ms",
                  opacity: skillsInView ? 1 : 0,
                  transform: skillsInView ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-1000"
                    style={{ width: skillsInView ? `${skill.level}%` : "0%" }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* PROJECTS PREVIEW */}
      <section
        ref={projectsRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
      >
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Portfolio
        </p>
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl font-bold text-white">
            Featured{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <a
            href="/projects"
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
          >
            View all →
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((p, i) => (
              <div
                key={p._id || p.id || p.title}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 overflow-hidden"
                style={{
                  opacity: projectsInView ? 1 : 0,
                  transform: projectsInView ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                {p.image && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] to-transparent" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-violet-300 group-hover:bg-clip-text transition-all duration-300">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2 mb-4 flex-1">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(p.technologies || []).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-slate-400 border border-white/[0.06]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {(!p.technologies || p.technologies.length === 0) && (
                    <div className="mb-4" />
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                    {p.githubLink ? (
                      <a
                        href={p.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Code
                      </a>
                    ) : null}
                    {p.liveLink ? (
                      <a
                        href={p.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-md hover:shadow-indigo-500/20 transition-all"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback static data
            [
              {
                title: "NexaCommerce",
                description: "Full-stack e-commerce platform with real-time inventory, Stripe payments, and admin dashboard.",
                technologies: ["React", "Node.js", "MongoDB"],
                githubLink: "https://github.com",
                liveLink: "https://example.com",
              },
              {
                title: "TaskFlow AI",
                description: "AI-powered project management tool with smart scheduling and team collaboration features.",
                technologies: ["React", "Express", "OpenAI"],
                githubLink: "https://github.com",
                liveLink: "https://example.com",
              },
              {
                title: "DataPulse",
                description: "Real-time analytics dashboard aggregating data from multiple APIs with live chart updates.",
                technologies: ["React", "WebSocket", "D3.js"],
                githubLink: "https://github.com",
                liveLink: "https://example.com",
              },
            ].map((p, i) => (
              <div
                key={p.title}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 overflow-hidden"
                style={{
                  opacity: projectsInView ? 1 : 0,
                  transform: projectsInView ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-slate-400 border border-white/[0.06]">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        Code
                      </a>
                    )}
                    {p.liveLink && (
                      <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-md hover:shadow-indigo-500/20 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
      >
        <div
          className={`relative p-12 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-900/20 to-cyan-900/10 backdrop-blur-sm text-center transition-all duration-700 ${ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                extraordinary?
              </span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              I'm currently open to freelance projects and full-time
              opportunities.
            </p>
            <a
              href="/contact"
              className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
