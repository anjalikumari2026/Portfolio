import { useEffect, useState } from "react";
import useInView from "../../hooks/useInView";
import { useAuth } from "@/context/AuthContext";
import projectService from "@/services/projectService";
import skillService from "@/services/skillService";
import certificateService from "@/services/certificateService";
import experienceService from "@/services/experienceService";
import contactService from "@/services/contactService";

const QUICK_ACTIONS = [
  { label: "Add Project", href: "/admin/dashboard/projects/add", icon: "➕" },
  { label: "Manage Skills", href: "/admin/dashboard/skills", icon: "⚡" },
  { label: "Upload Resume", href: "/admin/dashboard/resume", icon: "📄" },
  { label: "View Messages", href: "/admin/dashboard/messages", icon: "💬" },
  { label: "Certificates", href: "/admin/dashboard/certificates", icon: "🏆" },
  { label: "Edit Profile", href: "/admin/dashboard/profile", icon: "👤" },
];

function timeAgo(date) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

const TYPE_COLOR = {
  message: "bg-violet-400",
  project: "bg-cyan-400",
  cert: "bg-emerald-400",
  resume: "bg-orange-400",
  skill: "bg-pink-400",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [statsRef, statsInView] = useInView();
  const [actRef, actInView] = useInView();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState([
    {
      label: "Total Projects",
      val: "0",
      delta: "",
      icon: "🗂️",
      gradient: "from-cyan-500/15 to-blue-600/5",
    },
    {
      label: "Messages",
      val: "0",
      delta: "",
      icon: "💬",
      gradient: "from-violet-500/15 to-purple-600/5",
    },
    {
      label: "Certificates",
      val: "0",
      delta: "",
      icon: "🏆",
      gradient: "from-emerald-500/15 to-teal-600/5",
    },
    {
      label: "Skills Listed",
      val: "0",
      delta: "",
      icon: "⚡",
      gradient: "from-orange-500/15 to-amber-600/5",
    },
  ]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsData, skillsData, certificatesData, experiencesData, messagesData] = await Promise.all([
          projectService.getProjects().catch(() => ({ projects: [] })),
          skillService.getSkills().catch(() => ({ skills: [] })),
          certificateService.getCertificates().catch(() => ({ certificates: [] })),
          experienceService.getExperiences().catch(() => ({ experiences: [] })),
          contactService.getMessages().catch(() => ({ contacts: [] })),
        ]);

        const projectsCount = (projectsData.projects || projectsData || []).length;
        const skillsCount = (skillsData.skills || skillsData || []).length;
        const certificatesCount = (certificatesData.certificates || certificatesData || []).length;
        const experiencesCount = (experiencesData.experiences || experiencesData || []).length;
        const messagesList = messagesData.contacts || messagesData || [];

        setStats([
          {
            label: "Total Projects",
            val: projectsCount.toString(),
            delta: projectsCount > 0 ? "All from database" : "No projects yet",
            icon: "🗂️",
            gradient: "from-cyan-500/15 to-blue-600/5",
          },
          {
            label: "Experience",
            val: experiencesCount.toString(),
            delta: experiencesCount > 0 ? "Work history" : "No experience yet",
            icon: "💼",
            gradient: "from-violet-500/15 to-purple-600/5",
          },
          {
            label: "Certificates",
            val: certificatesCount.toString(),
            delta: certificatesCount > 0 ? "Verified" : "No certificates yet",
            icon: "🏆",
            gradient: "from-emerald-500/15 to-teal-600/5",
          },
          {
            label: "Skills Listed",
            val: skillsCount.toString(),
            delta: skillsCount > 0 ? "Technical skills" : "No skills yet",
            icon: "⚡",
            gradient: "from-orange-500/15 to-amber-600/5",
          },
        ]);

        // Build activity from messages
        const recentMessages = messagesList.slice(0, 5).map((m) => ({
          action: `New message from ${m.name || "Unknown"}`,
          time: timeAgo(m.createdAt),
          type: "message",
        }));
        setActivity(recentMessages);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div
          className={`mb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-1">
            Admin
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {user?.name || "Admin"}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${s.gradient} backdrop-blur-sm hover:border-white/[0.10] hover:-translate-y-1 transition-all duration-400`}
              style={{
                opacity: statsInView ? 1 : 0,
                transform: statsInView ? "translateY(0)" : "translateY(16px)",
                transition: `all 0.5s ease ${i * 80}ms`,
              }}
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.val}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-600 mt-1">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Quick Actions */}
          <div
            className={`p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-sm font-bold text-white mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_ACTIONS.map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {a.icon}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                    {a.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            ref={actRef}
            className={`p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-sm font-bold text-white mb-5">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activity.length > 0 ? (
                activity.map((a, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start"
                    style={{
                      opacity: actInView ? 1 : 0,
                      transition: `opacity 0.4s ease ${i * 80}ms`,
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${TYPE_COLOR[a.type] || "bg-slate-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-snug">{a.action}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Analytics placeholder */}
        <div
          className={`mt-6 p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white">Visitors Overview</h2>
            <span className="text-xs text-slate-500 px-3 py-1 rounded-full border border-white/[0.06]">
              Last 7 days
            </span>
          </div>
          {/* Fake bar chart */}
          <div className="flex items-end gap-2 h-28">
            {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600/40 to-cyan-400/40 border-t border-cyan-400/20 transition-all duration-700"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-slate-600">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
