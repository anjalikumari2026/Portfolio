import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Storage keys ──────────────────────────────────────────────────────
const TOKEN_KEY = "portfolio-auth-token";
const USER_KEY = "portfolio-auth-user";

// ── Context ───────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true); // true until hydration done

  // ── Hydrate from localStorage on first mount ──────────────────────
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        setTokenState(savedToken);
        setUserState(JSON.parse(savedUser));
      }
    } catch {
      // Corrupted storage — clear and start fresh
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── login: called after a successful API response ─────────────────
  // Usage: login({ token: "...", user: { id, name, email, role } })
  const login = useCallback(({ token: newToken, user: newUser }) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setTokenState(newToken);
    setUserState(newUser);
  }, []);

  // ── logout: clear everything ──────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setTokenState(null);
    setUserState(null);
  }, []);

  // ── setUser: update user profile without touching the token ───────
  const setUser = useCallback(
    (updatedUser) => {
      const merged =
        typeof updatedUser === "function" ? updatedUser(user) : updatedUser;
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      setUserState(merged);
    },
    [user],
  );

  // ── Derived flag ──────────────────────────────────────────────────
  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;
