// ── API Endpoints ─────────────────────────────────────────────────────
// Single source of truth for every backend route.
// Always import from here — never hard-code URLs in service files.
// BaseURL is already set to http://localhost:5000/api, so don't include /api here.

const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  PROFILE: {
    GET: "/profile",
    CREATE: "/profile",
    UPDATE: "/profile",
    IMAGE: "/profile/image",
  },

  PROJECTS: {
    BASE: "/projects",
    BY_ID: (id) => `/projects/${id}`,
  },

  SKILLS: {
    BASE: "/skills",
    BY_ID: (id) => `/skills/${id}`,
  },

  CERTIFICATES: {
    BASE: "/certificates",
    BY_ID: (id) => `/certificates/${id}`,
  },

  EXPERIENCE: {
    BASE: "/experience",
    BY_ID: (id) => `/experience/${id}`,
  },

  RESUME: {
    GET: "/resume",
    UPLOAD: "/resume",
    DELETE: "/resume",
  },

  EDUCATION: {
    BASE: "/education",
    BY_ID: (id) => `/education/${id}`,
  },

  CONTACT: {
    SEND: "/contact",
    LIST: "/contact",
    BY_ID: (id) => `/contact/${id}`,
    MARK_READ: (id) => `/contact/${id}/read`,
    UNREAD_COUNT: "/contact/unread-count",
  },
};

export default ENDPOINTS;
