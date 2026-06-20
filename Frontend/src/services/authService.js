import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

// ── authService ───────────────────────────────────────────────────────

// POST /auth/login  →  { token, user }
const loginAdmin = async (credentials) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// POST /auth/logout
const logoutAdmin = async () => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET /auth/me  →  { user }
const getCurrentAdmin = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.AUTH.ME);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// PUT /auth/change-password  →  { message }
const changePassword = async (payload) => {
  try {
    const { data } = await api.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const authService = { loginAdmin, logoutAdmin, getCurrentAdmin, changePassword };
export default authService;
