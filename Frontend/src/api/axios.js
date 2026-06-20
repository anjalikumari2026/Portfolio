import axios from "axios";

// ── Axios instance ────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT token ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("portfolio-auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: normalise errors ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred.";

    // Auto-logout on 401 (expired / invalid token)
    if (error?.response?.status === 401) {
      localStorage.removeItem("portfolio-auth-token");
      localStorage.removeItem("portfolio-auth-user");
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
