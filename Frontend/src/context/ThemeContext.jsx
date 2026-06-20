import { createContext, useContext, useEffect, useState } from "react";

// ── Context ───────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Persist: read saved preference, fall back to "dark"
    return localStorage.getItem("portfolio-theme") ?? "dark";
  });

  // Apply theme class to <html> and persist on every change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};

export default ThemeContext;
