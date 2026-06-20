import { useState } from "react";
import useInView from "../../hooks/useInView";
import contactService from "@/services/contactService";
import { useProfile } from "@/context/ProfileContext";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { profile, loading } = useProfile();
  const [headerRef, headerInView] = useInView();
  const [formRef, formInView] = useInView();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSending(true);
    try {
      await contactService.sendMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inp =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#07070e] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/4 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <section
        ref={headerRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16"
      >
        <div
          className={`transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-3">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Let's{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl">
            Have a project in mind or just want to say hi? My inbox is always
            open. I'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        ref={formRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pb-28"
      >
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <div
            className={`p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-700 ${formInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="px-6 py-2.5 rounded-xl border border-white/[0.10] text-slate-300 text-sm hover:bg-white/[0.04] transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold text-white mb-6">
                  Send a Message
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className={inp}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className={inp}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  className={inp}
                />
                <div>
                  <textarea
                    rows={6}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className={`${inp} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message →"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div
            className={`space-y-5 transition-all duration-700 delay-200 ${formInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Info cards */}
            {[
              { icon: "📧", label: "Email", val: profile?.email || "" },
              { icon: "📍", label: "Location", val: profile?.location || "" },
              { icon: "🕐", label: "Response Time", val: "Within 24 hours" },
            ].map((c) => (
              <div
                key={c.label}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.10] hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-sm text-slate-200 font-medium">
                      {c.val}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <p className="text-xs text-slate-500 mb-4">Find me on</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  profile?.github?.startsWith("http") && { name: "GitHub", icon: "GH", href: profile.github, color: "hover:border-slate-400/30" },
                  profile?.linkedin?.startsWith("http") && { name: "LinkedIn", icon: "in", href: profile.linkedin, color: "hover:border-blue-500/30" },
                  profile?.twitter?.startsWith("http") && { name: "Twitter", icon: "𝕏", href: profile.twitter, color: "hover:border-sky-400/30" },
                  profile?.website?.startsWith("http") && { name: "Website", icon: "🌐", href: profile.website, color: "hover:border-violet-400/30" },
                ].filter(Boolean).map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white ${s.color} transition-all duration-300 hover:bg-white/[0.04]`}
                  >
                    <span className="text-sm font-mono font-bold">
                      {s.icon}
                    </span>
                    <span className="text-xs">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
