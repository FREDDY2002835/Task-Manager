import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PageTransition from "../components/PageTransition";
import ChangePasswordForm from "../components/settings/ChangePasswordForm";
import AboutModal from "../components/settings/AboutModal";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { updateMe } from "../services/api";

import {
  FaCog,
  FaUser,
  FaBell,
  FaPalette,
  FaLanguage,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";

function Settings() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);

  const notifications = user?.notifications || {
    taskReminders: true,
    emailNotifications: true,
  };

  const handleToggleNotification = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };

    // Optimistic update
    setUser((prev) => ({ ...prev, notifications: updated }));

    try {
      setSavingNotif(true);
      await updateMe({ notifications: updated });
    } catch (err) {
      console.error("Failed to update notification preference:", err);
      // Revert on failure
      setUser((prev) => ({ ...prev, notifications }));
    } finally {
      setSavingNotif(false);
    }
  };

  return (
    <PageTransition>
      <MainLayout>
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-8">

          {/* Header */}
          <div
            className="rounded-2xl p-4 sm:p-6 lg:p-8 border"
            style={{
              borderColor: "var(--primary-dark)",
              background:
                "linear-gradient(135deg,#08110A,#102417,#18452A)",
            }}
          >
            <div className="flex items-center gap-3 sm:gap-4">

              <div
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <FaCog className="text-white text-base sm:text-xl lg:text-2xl" />
              </div>

              <div>

                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                  {t("settings.title")}
                </h1>

                <p className="text-[11px] sm:text-sm lg:text-base text-gray-400">
                  {t("settings.subtitle")}
                </p>

              </div>

            </div>
          </div>

          {/* Appearance */}
          <div
            className="rounded-2xl p-4 sm:p-6 border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4">

              <FaPalette
                className="text-sm sm:text-lg lg:text-xl"
                style={{ color: "var(--primary-light)" }}
              />

              <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-white">
                {t("settings.appearance")}
              </h2>

            </div>

            <ThemeSwitcher />
          </div>

          {/* Account */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem icon={<FaUser />} title={t("settings.account")} />
            <SettingItem title={t("settings.editProfile")} onClick={() => navigate("/profile")} />
            <SettingItem title={t("settings.changePassword")} onClick={() => setShowPasswordForm(true)} />
          </div>

          {/* Notifications */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem icon={<FaBell />} title={t("settings.notifications")} />
            <SettingItem
              title={t("settings.taskReminders")}
              toggle
              checked={notifications.taskReminders}
              onToggle={() => handleToggleNotification("taskReminders")}
              disabled={savingNotif}
            />
            <SettingItem
              title={t("settings.emailNotifications")}
              toggle
              checked={notifications.emailNotifications}
              onToggle={() => handleToggleNotification("emailNotifications")}
              disabled={savingNotif}
            />
          </div>

          {/* Language */}
          <div
            className="rounded-2xl overflow-hidden border p-4 sm:p-5"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <FaLanguage
                className="text-sm sm:text-lg lg:text-xl"
                style={{ color: "var(--primary-light)" }}
              />
              <span className="text-[11px] sm:text-sm lg:text-base text-white font-semibold">
                {t("settings.language")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className="rounded-xl px-4 py-3 text-sm font-medium transition border"
                style={{
                  background: language === "en" ? "var(--primary)" : "transparent",
                  borderColor: "var(--primary-dark)",
                  color: language === "en" ? "#fff" : "#d1d5db",
                }}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className="rounded-xl px-4 py-3 text-sm font-medium transition border"
                style={{
                  background: language === "fr" ? "var(--primary)" : "transparent",
                  borderColor: "var(--primary-dark)",
                  color: language === "fr" ? "#fff" : "#d1d5db",
                }}
              >
                Français
              </button>
            </div>
          </div>

          {/* About */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem
              icon={<FaInfoCircle />}
              title={t("settings.about")}
              onClick={() => setShowAbout(true)}
            />

            <div className="px-4 py-3 sm:px-5 sm:py-4 text-[11px] sm:text-sm text-gray-400">
              {t("settings.version")}
            </div>
          </div>

        </div>
      </MainLayout>

      {showPasswordForm && (
        <ChangePasswordForm onClose={() => setShowPasswordForm(false)} />
      )}

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </PageTransition>
  );
}

function SettingItem({ icon, title, value, onClick, toggle, checked, onToggle, disabled }) {
  const isInteractive = !!onClick;

  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b last:border-none ${
        isInteractive ? "cursor-pointer hover:bg-white/5 transition" : ""
      }`}
      style={{
        borderColor: "rgba(255,255,255,.05)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">

        {icon && (
          <div
            className="text-xs sm:text-base"
            style={{
              color: "var(--primary-light)",
            }}
          >
            {icon}
          </div>
        )}

        <span className="text-[11px] sm:text-sm lg:text-base text-white">
          {title}
        </span>

      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        {value && (
          <span className="text-[11px] sm:text-sm text-gray-400">
            {value}
          </span>
        )}

        {toggle ? (
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="relative w-11 h-6 rounded-full transition disabled:opacity-60"
            style={{
              background: checked ? "var(--primary)" : "#374151",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{
                transform: checked ? "translateX(20px)" : "translateX(0)",
              }}
            ></span>
          </button>
        ) : (
          isInteractive && (
            <FaChevronRight className="text-gray-500 text-xs sm:text-sm" />
          )
        )}

      </div>
    </div>
  );
}

export default Settings;
