"use client";
import { createContext, useContext, useState, useEffect } from "react";
import ParticleField from "@/components/ParticleField";
import AuroraBackground from "@/components/AuroraBackground";

const ThemeContext = createContext({ dark: true, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div
        style={{
          background: dark ? "#0a0a0f" : "#fafafa",
          color: dark ? "#e2e8f0" : "#1a1a2e",
          minHeight: "100vh",
          position: "relative",
          transition: "background-color 0.4s ease, color 0.4s ease",
        }}
      >
        <ParticleField />
        <AuroraBackground />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
