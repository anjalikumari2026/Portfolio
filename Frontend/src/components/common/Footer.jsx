import { Link } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Certificates", to: "/certificates" },
  { label: "Contact", to: "/contact" },
];

const isValidUrl = (url) => url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:"));

const getSocialLinks = (profile) => [
  profile?.github && isValidUrl(profile.github) && {
    label: "GitHub",
    href: profile.github,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  profile?.linkedin && isValidUrl(profile.linkedin) && {
    label: "LinkedIn",
    href: profile.linkedin,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  profile?.twitter && isValidUrl(profile.twitter) && {
    label: "Twitter",
    href: profile.twitter,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  profile?.website && isValidUrl(profile.website) && {
    label: "Website",
    href: profile.website,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  profile?.email && {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
].filter(Boolean);

const Footer = () => {
  const { profile, loading } = useProfile();
  const socialLinks = getSocialLinks(profile);
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/6">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none
          bg-violet-600/[0.07] blur-3xl rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── CTA Top Area ── */}
        <div className="flex flex-col items-center text-center gap-4 py-16 border-b border-white/6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-xl">
            Let's Build Something{" "}
            <span className="bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
            Open to full-time opportunities, freelance projects, and meaningful
            collaborations. Let's turn ideas into impactful products.
          </p>
          <a
            href={profile?.email ? `mailto:${profile.email}` : "#"}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl
              bg-linear-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold
              hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] active:scale-95
              transition-all duration-300 ease-out"
          >
            Get In Touch
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── Middle 3-column Section ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-white font-bold text-lg tracking-tight">
                {loading ? (
                <span className="inline-block w-28 h-5 rounded bg-white/[0.06] animate-pulse" />
              ) : (
                profile?.name || ""
              )}
              </h3>
              <p className="text-sm bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent font-medium">
                {profile?.title || ""}
              </p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Building clean, scalable, and impactful web experiences.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <p className="text-white text-sm font-semibold tracking-wide">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 text-sm hover:text-violet-300
                      transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="flex flex-col gap-3">
            <p className="text-white text-sm font-semibold tracking-wide">
              Connect
            </p>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-2.5 text-slate-400 text-sm
                      hover:text-violet-300 transition-colors duration-200 group"
                  >
                    <span
                      className="w-7 h-7 flex items-center justify-center rounded-lg
                      bg-white/4 border border-white/8
                      group-hover:bg-white/8 group-hover:border-violet-500/30
                      transition-all duration-200"
                    >
                      {social.icon}
                    </span>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between
            gap-3 py-6 border-t border-white/6">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} {profile?.name || ""}. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Designed &amp; Built by{" "}
            <span className="text-slate-400">{profile?.name || ""}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
