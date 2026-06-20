// ─────────────────────────────────────────────────────────────────────
// constants.js  –  Single source of truth for all static config values
// ─────────────────────────────────────────────────────────────────────

// ── Navigation ────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

// ── Social links are now fetched dynamically from the Profile API ──────
// ── Contact info is now fetched dynamically from the Profile API ───────

// ── Project categories ────────────────────────────────────────────────
export const PROJECT_CATEGORIES = [
  "All",
  "Full Stack",
  "Frontend",
  "Backend",
  "React",
  "Node.js",
  "MongoDB",
  "API",
  "Mobile",
  "Other",
];

// ── Skill categories ──────────────────────────────────────────────────
export const SKILL_CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
  "Languages",
  "Cloud",
  "Other",
];

// ── Dashboard sidebar links ───────────────────────────────────────────
export const DASHBOARD_LINKS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "grid" },
  { label: "Profile", to: "/admin/dashboard/profile", icon: "user" },
  { label: "Projects", to: "/admin/dashboard/projects", icon: "layers" },
  { label: "Skills", to: "/admin/dashboard/skills", icon: "zap" },
  { label: "Certificates", to: "/admin/dashboard/certificates", icon: "award" },
  { label: "Education", to: "/admin/dashboard/education", icon: "book" },
  { label: "Experience", to: "/admin/dashboard/experience", icon: "briefcase" },
  { label: "Resume", to: "/admin/dashboard/resume", icon: "file-text" },
  { label: "Messages", to: "/admin/dashboard/messages", icon: "message-square" },
];

// ── LocalStorage keys ─────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: "portfolio-auth-token",
  AUTH_USER: "portfolio-auth-user",
  THEME: "portfolio-theme",
};

// ── API status ────────────────────────────────────────────────────────
export const API_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// ── Toast / notification messages ────────────────────────────────────
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back! Logged in successfully.",
  LOGIN_ERROR: "Invalid credentials. Please try again.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  SAVE_SUCCESS: "Changes saved successfully.",
  SAVE_ERROR: "Failed to save changes. Please try again.",
  DELETE_SUCCESS: "Deleted successfully.",
  DELETE_ERROR: "Failed to delete. Please try again.",
  UPLOAD_SUCCESS: "File uploaded successfully.",
  UPLOAD_ERROR: "File upload failed. Please try again.",
  MESSAGE_SENT: "Your message has been sent! I'll get back to you soon.",
  MESSAGE_ERROR: "Failed to send message. Please try again.",
  COPY_SUCCESS: "Copied to clipboard!",
  COPY_ERROR: "Failed to copy to clipboard.",
  RESUME_DOWNLOAD: "Resume download started.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Session expired. Please log in again.",
};

// ── Theme constants ───────────────────────────────────────────────────
export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const DEFAULT_THEME = THEMES.DARK;

// ── Animation durations (ms) ──────────────────────────────────────────
export const ANIMATION = {
  FAST: 150,
  BASE: 300,
  SLOW: 600,
  SLOWER: 900,
  STAGGER: 100, // per-item stagger delay
};

// ── Pagination ────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 6,
  MESSAGES_LIMIT: 10,
  PROJECTS_LIMIT: 6,
};

// ── File constraints ──────────────────────────────────────────────────
export const FILE_LIMITS = {
  IMAGE_MAX_MB: 2,
  RESUME_MAX_MB: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_RESUME_TYPES: ["application/pdf"],
};

// ── Resume filename is now handled dynamically ────────────────────────

// ── Skill proficiency levels ──────────────────────────────────────────
export const PROFICIENCY_LEVELS = [
  { label: "Beginner", value: 25 },
  { label: "Elementary", value: 40 },
  { label: "Intermediate", value: 60 },
  { label: "Advanced", value: 80 },
  { label: "Expert", value: 95 },
];

// ── Experience types ──────────────────────────────────────────────────
export const EXPERIENCE_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Freelance",
  "Contract",
  "Open Source",
];
