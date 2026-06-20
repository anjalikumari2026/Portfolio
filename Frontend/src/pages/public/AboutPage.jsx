import { useEffect, useState } from "react";
import useInView from "../../hooks/useInView";
import { useProfile } from "@/context/ProfileContext";
import resumeService from "@/services/resumeService";
import educationService from "@/services/educationService";
import experienceService from "@/services/experienceService";
import skillService from "@/services/skillService";

export default function AboutPage() {
  const { profile, loading } = useProfile();
  const [heroRef, heroInView] = useInView();
  const [eduRef, eduInView] = useInView();
  const [expRef, expInView] = useInView();
  const [skillsRef, skillsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [eduLoading, setEduLoading] = useState(true);
  const [expLoading, setExpLoading] = useState(true);
  const [expError, setExpError] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setEduLoading(true);
        setExpLoading(true);
        setExpError(null);
        const [educationData, experienceData, skillsData] = await Promise.all([
          educationService.getEducation().catch(() => ({ education: [] })),
          experienceService.getExperiences().catch(() => {
            setExpError("Failed to load experience");
            return { experiences: [] };
          }),
          skillService.getSkills().catch(() => ({ skills: [] })),
        ]);
        
        setEducation(educationData.education || educationData || []);
        setExperience(experienceData?.experiences || experienceData || []);
        
        const grouped = (skillsData.skills || skillsData || []).reduce((acc, skill) => {
          const cat = skill.category || "Other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(skill.name);
          return acc;
        }, {});
        
        const skillsArray = Object.entries(grouped).map(([cat, items]) => ({
          cat,
          items,
        }));
        
        setSkills(skillsArray);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setEduLoading(false);
        setExpLoading(false);
      }
    };
    resumeService.getResume().then((data) => {
      if (data?.resume?.resumeUrl) setResumeUrl(data.resume.resumeUrl);
    }).catch(() => {});
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#07070e] text-white overflow-x-hidden">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20"
      >
        <div
          className={`transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-4">
            About Me
          </p>
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Developer.{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Creator.
                </span>
                <br />
                Problem Solver.
              </h1>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-72 bg-white/[0.06] rounded animate-pulse" />
                  <div className="h-4 w-96 bg-white/[0.06] rounded animate-pulse" />
                  <div className="h-4 w-64 bg-white/[0.04] rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <p className="text-slate-400 text-lg leading-relaxed mb-4">
                    I'm {profile?.name || ""} — {profile?.title || ""} who builds things that
                    matter. With a deep love for React ecosystems and Node.js
                    backends, I craft experiences that are fast, beautiful, and
                    reliable.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    {profile?.bio || ""}
                  </p>
                </>
              )}
            </div>
            {/* Avatar / Profile Image */}
            <div className="relative w-48 h-48 shrink-0 mx-auto md:mx-0">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-48 h-48 rounded-3xl object-cover border border-white/[0.08]"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-48 h-48 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-900/40 to-cyan-900/20 backdrop-blur-sm flex items-center justify-center text-6xl">
                  👨‍💻
                </div>
              )}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 blur-lg -z-10" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Education */}
      <section
        ref={eduRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-20"
      >
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Background
        </p>
        <h2 className="text-3xl font-bold text-white mb-12">
          Education{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Timeline
          </span>
        </h2>
        <div className="relative pl-6 border-l border-white/[0.06]">
          {eduLoading ? (
            <div className="space-y-10">
              {[1, 2].map((n) => (
                <div key={n} className="relative animate-pulse">
                  <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-white/[0.08]" />
                  <div className="h-3 w-24 bg-white/[0.06] rounded mb-2" />
                  <div className="h-5 w-48 bg-white/[0.06] rounded mb-2" />
                  <div className="h-3 w-36 bg-white/[0.04] rounded mb-1" />
                  <div className="h-3 w-56 bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          ) : education.length > 0 ? (
            education.map((e, i) => (
              <div
                key={e._id || e.degree}
                className="relative mb-10 last:mb-0"
                style={{
                  opacity: eduInView ? 1 : 0,
                  transform: eduInView ? "translateX(0)" : "translateX(-16px)",
                  transition: `all 0.5s ease ${i * 150}ms`,
                }}
              >
                <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/10" />
                <span className="text-xs text-cyan-500 font-mono">
                  {e.startYear}{e.endYear ? ` – ${e.endYear}` : " – Present"}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {e.degree}
                </h3>
                <p className="text-sm text-indigo-300 mb-1">
                  {e.institution}{e.university ? ` · ${e.university}` : ""}{e.location ? ` · ${e.location}` : ""}
                </p>
                <p className="text-sm text-slate-500">
                  {e.cgpaOrPercentage ? `${e.cgpaOrPercentage}${e.description ? ` | ${e.description}` : ""}` : e.description || ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 py-4">No education data available.</p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Experience */}
      <section
        ref={expRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-20"
      >
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Work History
        </p>
        <h2 className="text-3xl font-bold text-white mb-12">
          Experience{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Summary
          </span>
        </h2>
        <div className="space-y-5">
          {expLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-48 bg-white/[0.06] rounded" />
                          <div className="h-3 w-32 bg-white/[0.04] rounded" />
                        </div>
                        <div className="h-5 w-28 bg-white/[0.06] rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-white/[0.04] rounded mb-2" />
                  <div className="h-3 w-3/4 bg-white/[0.04] rounded mb-3" />
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((s) => (<div key={s} className="h-5 w-14 bg-white/[0.04] rounded-full" />))}
                  </div>
                </div>
              ))}
            </div>
          ) : expError ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">⚠️</p>
              <p className="text-sm text-slate-500 mb-4">{expError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all"
              >
                Retry
              </button>
            </div>
          ) : experience.length > 0 ? (
            experience.map((e, i) => {
              const startYr = e.startDate ? new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
              const endYr = e.endDate ? new Date(e.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : e.currentlyWorking ? "Present" : "";
              return (
                <div
                  key={e._id || e.id}
                  className="group p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.10] hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-400"
                  style={{
                    opacity: expInView ? 1 : 0,
                    transform: expInView ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.5s ease ${i * 130}ms`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3">
                    {e.companyImage && (
                      <img src={e.companyImage} alt={e.companyName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-white/[0.08]" onError={(e2) => { e2.target.style.display = "none"; }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">{e.role}</h3>
                          <p className="text-xs sm:text-sm text-indigo-300 truncate">{e.companyName}{e.location ? ` · ${e.location}` : ""}</p>
                        </div>
                        {startYr && (
                          <span className="text-xs text-slate-500 font-mono bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06] whitespace-nowrap shrink-0 self-start">
                            {startYr}{endYr ? ` – ${endYr}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {e.description && <p className="text-xs sm:text-sm text-slate-400 mb-3 leading-relaxed">{e.description}</p>}
                  {e.skillsUsed?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {e.skillsUsed.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-[11px] rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{s}</span>
                      ))}
                    </div>
                  )}
                  {e.certificateFile && (
                    <div className="pt-3 border-t border-white/[0.05]">
                      <a href={e.certificateFile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-4xl mb-3">💼</p>
              <p className="text-sm">No experience data available yet.</p>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Skills */}
      <section
        ref={skillsRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-20"
      >
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Capabilities
        </p>
        <h2 className="text-3xl font-bold text-white mb-12">
          Skills{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Overview
          </span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.length > 0 ? (
            skills.map((s, i) => (
              <div
                key={s.cat}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:-translate-y-1 transition-all duration-400"
                style={{
                  opacity: skillsInView ? 1 : 0,
                  transform: skillsInView ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s ease ${i * 100}ms`,
                }}
              >
                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-4">
                  {s.cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Fallback static data
            [
              {
                cat: "Frontend",
                items: [
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Redux",
                  "Framer Motion",
                ],
              },
              {
                cat: "Backend",
                items: ["Node.js", "Express", "REST API", "GraphQL", "WebSocket", "JWT"],
              },
              {
                cat: "Database",
                items: ["MongoDB", "PostgreSQL", "Redis", "Prisma", "Mongoose"],
              },
              {
                cat: "DevOps & Tools",
                items: ["Docker", "AWS", "Vercel", "Git", "CI/CD", "Linux"],
              },
            ].map((s, i) => (
              <div
                key={s.cat}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:-translate-y-1 transition-all duration-400"
                style={{
                  opacity: skillsInView ? 1 : 0,
                  transform: skillsInView ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s ease ${i * 100}ms`,
                }}
              >
                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-4">
                  {s.cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Resume CTA */}
      <section
        ref={ctaRef}
        className="relative z-10 max-w-5xl mx-auto px-6 py-16 pb-24"
      >
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-indigo-900/20 to-cyan-900/10 backdrop-blur-sm transition-all duration-700 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Interested in working together?
            </h3>
            <p className="text-slate-400 text-sm">
              Download my resume or drop me a message.
            </p>
          </div>
          <div className="flex gap-3">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Download CV
              </a>
            ) : (
              <span
                className="px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-600 text-sm font-semibold cursor-not-allowed"
              >
                Resume unavailable
              </span>
            )}
            <a
              href="/contact"
              className="px-6 py-3 rounded-xl border border-white/[0.10] bg-white/[0.04] text-slate-300 text-sm font-semibold hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
