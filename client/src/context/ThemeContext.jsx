import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const themes = {
  emerald: {
    primary: "#22c55e",
    primaryDark: "#14532d",
    primaryLight: "#4ade80",
  },

  blue: {
    primary: "#3b82f6",
    primaryDark: "#1e3a8a",
    primaryLight: "#60a5fa",
  },

  purple: {
    primary: "#8b5cf6",
    primaryDark: "#581c87",
    primaryLight: "#a78bfa",
  },

  red: {
    primary: "#ef4444",
    primaryDark: "#7f1d1d",
    primaryLight: "#f87171",
  },

  orange: {
    primary: "#f97316",
    primaryDark: "#7c2d12",
    primaryLight: "#fb923c",
  },

  slate: {
    primary: "#64748b",
    primaryDark: "#334155",
    primaryLight: "#94a3b8",
  },
};

const DEFAULT_THEME = "emerald";

export function ThemeProvider({ children }) {
  const stored = localStorage.getItem("theme");

  // Guard against a stale/invalid value in localStorage (e.g. from
  // an older version of this app) that doesn't match any real theme
  // key - that was crashing the app on load with
  // "Cannot read properties of undefined (reading 'primary')".
  const [theme, setTheme] = useState(
    stored && themes[stored] ? stored : DEFAULT_THEME
  );

  useEffect(() => {
    const current = themes[theme] || themes[DEFAULT_THEME];

    document.documentElement.style.setProperty(
      "--primary",
      current.primary
    );

    document.documentElement.style.setProperty(
      "--primary-dark",
      current.primaryDark
    );

    document.documentElement.style.setProperty(
      "--primary-light",
      current.primaryLight
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);