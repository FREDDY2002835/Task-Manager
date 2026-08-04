import { createContext, useContext, useState, useEffect } from "react";
import translations from "../i18n/translations";
import { useAuth } from "./AuthContext";
import { updateMe } from "../services/api";

const LanguageContext = createContext();

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const { user, setUser } = useAuth();

  const [language, setLanguageState] = useState(
    localStorage.getItem("language") || "en"
  );

  // If the logged-in user has a saved language preference, prefer it
  // (keeps the choice consistent across devices/browsers).
  useEffect(() => {
    if (user?.language && user.language !== language) {
      setLanguageState(user.language);
      localStorage.setItem("language", user.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.language]);

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    if (user) {
      try {
        const res = await updateMe({ language: lang });
        setUser((prev) => ({ ...prev, ...res.data.user }));
      } catch (err) {
        console.error("Failed to save language preference:", err);
      }
    }
  };

  const t = (key) => {
    const value = getNested(translations[language], key);
    return value !== undefined ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
