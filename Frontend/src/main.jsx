import React from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "@/routes/AppRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ProfileProvider>
          <AppRoutes />
        </ProfileProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
